<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\DataFixtures\Required\Data;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\DataFixtures\Required\RequiredFixture;
use Claroline\CoreBundle\Entity\Template\Template;
use Claroline\CoreBundle\Entity\Template\TemplateType;

class LoadTemplateData implements RequiredFixture
{
    public function load(ObjectManager $om)
    {
        $translator = $this->container->get('translator');
        $parameters = $this->container->get('claroline.serializer.parameters')->serialize([Options::SERIALIZE_MINIMAL]);

        $templateTypeRepo = $om->getRepository(TemplateType::class);

        $mailRegistrationType = $templateTypeRepo->findOneBy(['name' => 'claro_mail_registration']);
        $mailLayoutType = $templateTypeRepo->findOneBy(['name' => 'claro_mail_layout']);
        $passwordType = $templateTypeRepo->findOneBy(['name' => 'forgotten_password']);

        if ($mailRegistrationType) {
            $mailRegistrationFR = new Template();
            $mailRegistrationFR->setName('claro_mail_registration');
            $mailRegistrationFR->setType($mailRegistrationType);
            $mailRegistrationFR->setTitle('Inscription à %platform_name%');
            $content = "<div>Votre nom d'utilisateur est %username%</div></br>";
            $content .= '<div>Votre mot de passe est %password%</div>';
            $content .= '<div>%validation_mail%</div>';
            $mailRegistrationFR->setContent($content);
            $mailRegistrationFR->setLang('fr');
            $om->persist($mailRegistrationFR);

            $mailRegistrationEN = new Template();
            $mailRegistrationEN->setName('claro_mail_registration');
            $mailRegistrationEN->setType($mailRegistrationType);
            $mailRegistrationEN->setTitle('Registration to %platform_name%');
            $content = '<div>You username is %username%</div></br>';
            $content .= '<div>Your password is %password%</div>';
            $content .= '<div>%validation_mail%</div>';
            $mailRegistrationEN->setContent($content);
            $mailRegistrationEN->setLang('en');
            $om->persist($mailRegistrationEN);

            $mailRegistrationType->setDefaultTemplate('claro_mail_registration');
            $om->persist($mailRegistrationType);
        }
        if ($mailLayoutType) {
            $mailLayoutFR = new Template();
            $mailLayoutFR->setName('claro_mail_layout');
            $mailLayoutFR->setType($mailLayoutType);
            $mailLayoutFR->setContent('<div></div>%content%<div></hr>Powered by %platform_name%</div>');
            $mailLayoutFR->setLang('fr');
            $om->persist($mailLayoutFR);

            $mailLayoutEN = new Template();
            $mailLayoutEN->setName('claro_mail_layout');
            $mailLayoutEN->setType($mailLayoutType);
            $mailLayoutEN->setContent('<div></div>%content%<div></hr>Powered by %platform_name%</div>');
            $mailLayoutEN->setLang('en');
            $om->persist($mailLayoutEN);

            $mailLayoutType->setDefaultTemplate('claro_mail_layout');
            $om->persist($mailLayoutType);
        }
        if ($passwordType) {
            foreach ($parameters['locales']['available'] as $locale) {
                $template = new Template();
                $template->setType($passwordType);
                $template->setName('forgotten_password');
                $template->setLang($locale);

                $title = $translator->trans('resetting_your_password', [], 'platform', $locale);
                $template->setTitle($title);

                $content = '<div>'.$translator->trans('reset_password_txt', [], 'platform', $locale).'</div>';
                $content .= '<div>'.$translator->trans('your_username', [], 'platform', $locale).' : %username%</div>';
                $content .= '<a href="%password_reset_link%">'.$translator->trans('mail_click', [], 'platform', $locale).'</a>';
                $template->setContent($content);
                $om->persist($template);
            }
            $passwordType->setDefaultTemplate('forgotten_password');
            $om->persist($passwordType);
        }

        $om->flush();
    }

    public function setContainer($container)
    {
        $this->container = $container;
    }
}
