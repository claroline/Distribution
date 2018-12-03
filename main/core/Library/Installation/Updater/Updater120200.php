<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Library\Installation\Updater;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Content;
use Claroline\CoreBundle\Entity\ContentTranslation;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Template\Template;
use Claroline\CoreBundle\Entity\Template\TemplateType;
use Claroline\InstallationBundle\Updater\Updater;
use Psr\Log\LogLevel;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Translation\TranslatorInterface;

class Updater120200 extends Updater
{
    const BATCH_SIZE = 500;

    protected $logger;

    /** @var ObjectManager */
    private $om;

    /** @var TranslatorInterface */
    private $translator;

    private $parameters;

    private $contentRepo;
    private $translationRepo;
    private $templateRepo;
    private $templateTypeRepo;

    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->logger = $logger;

        $this->om = $container->get('claroline.persistence.object_manager');
        $this->translator = $container->get('translator');

        $this->parameters = $container->get('claroline.serializer.parameters')->serialize([Options::SERIALIZE_MINIMAL]);

        $this->contentRepo = $this->om->getRepository(Content::class);
        $this->translationRepo = $this->om->getRepository(ContentTranslation::class);
        $this->templateRepo = $this->om->getRepository(Template::class);
        $this->templateTypeRepo = $this->om->getRepository(TemplateType::class);
    }

    public function postUpdate()
    {
        $this->buildNewPaths();
        $this->generatePlatformTemplates();
    }

    private function buildNewPaths()
    {
        $total = $this->om->count(ResourceNode::class);
        $this->log('Building resource paths ('.$total.')');

        $offset = 0;

        while ($offset < $total) {
            $nodes = $this->om->getRepository(ResourceNode::class)->findBy([], [], self::BATCH_SIZE, $offset);

            foreach ($nodes as $node) {
                $this->om->persist($node);
                ++$offset;
                $this->log('Building resource paths '.$offset.'/'.$total);
            }

            $this->log('Flush');
            $this->om->flush();
            $this->om->clear();
        }
    }

    private function generatePlatformTemplates()
    {
        $this->log('Generating platform templates...');

        $this->om->startFlushSuite();
        $this->generateTemplateFromContent('claro_mail_registration');
        $this->generateTemplateFromContent('claro_mail_layout');
        $this->generateForgottenPasswordTemplate();
        $this->om->endFlushSuite();

        $this->log('Platform templates have been generated.');
    }

    private function generateTemplateFromContent($type)
    {
        $this->log("Generating $type template...");

        $templateType = $this->templateTypeRepo->findOneBy(['name' => $type]);

        if ($templateType) {
            $templates = $this->templateRepo->findBy(['type' => $templateType]);

            if (0 === count($templates)) {
                $content = $this->contentRepo->findOneBy(['type' => $type]);

                if ($content) {
                    $template = new Template();
                    $template->setType($templateType);
                    $template->setName($type);
                    $template->setLang('en');
                    $template->setTitle($content->getTitle());
                    $template->setContent($content->getContent());
                    $this->om->persist($template);

                    $templateType->setDefaultTemplate($type);
                    $this->om->persist($templateType);

                    $translatedContents = $this->translationRepo->findBy([
                        'objectClass' => Content::class,
                        'foreignKey' => $content->getId(),
                        'field' => 'content',
                    ]);

                    foreach ($translatedContents as $translatedContent) {
                        $locale = $translatedContent->getLocale();
                        $translatedTitle = $this->translationRepo->findOneBy([
                            'objectClass' => Content::class,
                            'foreignKey' => $content->getId(),
                            'field' => 'title',
                            'locale' => $locale,
                        ]);
                        $translatedTemplate = new Template();
                        $translatedTemplate->setType($templateType);
                        $translatedTemplate->setName($type);
                        $translatedTemplate->setLang($locale);
                        $translatedTemplate->setContent($translatedContent->getContent());

                        if ($translatedTitle) {
                            $translatedTemplate->setTitle($translatedTitle->getContent());
                        }
                        $this->om->persist($translatedTemplate);
                    }
                    $this->log("$type template has been generated.");
                } else {
                    $this->log("$type content not found.", LogLevel::ERROR);
                }
            } else {
                $this->log("$type template already exists.");
            }
        } else {
            $this->log("$type type not found.", LogLevel::ERROR);
        }
    }

    private function generateForgottenPasswordTemplate()
    {
        $this->log('Generating template for forgotten password...');

        $templateType = $this->templateTypeRepo->findOneBy(['name' => 'forgotten_password']);

        if ($templateType) {
            $templates = $this->templateRepo->findBy(['type' => $templateType]);

            if (0 === count($templates)) {
                foreach ($this->parameters['locales']['available'] as $locale) {
                    $template = new Template();
                    $template->setType($templateType);
                    $template->setName('forgotten_password');
                    $template->setLang($locale);

                    $title = $this->translator->trans('resetting_your_password', [], 'platform', $locale);
                    $template->setTitle($title);

                    $content = '<div>'.$this->translator->trans('reset_password_txt', [], 'platform', $locale).'</div>';
                    $content .= '<div>'.$this->translator->trans('your_username', [], 'platform', $locale).' : %username%</div>';
                    $content .= '<a href="%password_reset_link%">'.$this->translator->trans('mail_click', [], 'platform', $locale).'</a>';
                    $template->setContent($content);
                    $this->om->persist($template);
                }
                $templateType->setDefaultTemplate('forgotten_password');
                $this->om->persist($templateType);

                $this->log('Template for forgotten password has been generated.');
            } else {
                $this->log('Template for forgotten password already exists.');
            }
        } else {
            $this->log('Template type for forgotten password not found.', LogLevel::ERROR);
        }
    }
}
