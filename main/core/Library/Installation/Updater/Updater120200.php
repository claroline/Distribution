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

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Content;
use Claroline\CoreBundle\Entity\ContentTranslation;
use Claroline\CoreBundle\Entity\Template\Template;
use Claroline\CoreBundle\Entity\Template\TemplateType;
use Claroline\InstallationBundle\Updater\Updater;
use Psr\Log\LogLevel;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Updater120200 extends Updater
{
    protected $logger;

    /** @var  ObjectManager */
    private $om;

    private $contentRepo;
    private $translationRepo;
    private $templateRepo;
    private $templateTypeRepo;

    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->logger = $logger;

        $this->om = $container->get('claroline.persistence.object_manager');
        $this->contentRepo = $this->om->getRepository(Content::class);
        $this->translationRepo = $this->om->getRepository(ContentTranslation::class);
        $this->templateRepo = $this->om->getRepository(Template::class);
        $this->templateTypeRepo = $this->om->getRepository(TemplateType::class);
    }

    public function postUpdate()
    {
        $this->generatePlatformTemplates();
    }

    public function generatePlatformTemplates()
    {
        $this->log('Generating platform templates...');

        $this->om->startFlushSuite();
        $this->generateTemplate('claro_mail_registration');
        $this->generateTemplate('claro_mail_layout');
        $this->om->endFlushSuite();

        $this->log('Platform templates generated.');
    }

    private function generateTemplate($type)
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
                    $this->log("$type template generated.");
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
}
