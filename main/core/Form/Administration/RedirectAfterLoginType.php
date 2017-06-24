<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Form\Administration;

use Claroline\CoreBundle\Library\Configuration\PlatformDefaults;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * @DI\Service("redirect_after_login_form")
 * @DI\Tag("form.type")
 */
class RedirectAfterLoginType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'redirectAfterLoginOption',
                'choice',
                [
                    'choices' => $this->buildRedirectOptions(),
                    'choices_as_values' => true,
                    'expanded' => true,
                    'multiple' => false,
                    'label' => 'redirect_after_login_option',
                ]
            )
            ->add(
                'redirectAfterLoginUrl',
                'text',
                [
                    'label' => 'redirect_after_login_url',
                    'required' => false,
                ]
            )
            ->add(
                'defaultWorkspaceTag',
                'text',
                [
                    'label' => 'default_workspace_tag',
                    'required' => false,
                    'disabled' => isset($options['lockedParams']['default_workspace_tag']),
                ]
            )
        ;
    }

    public function getName()
    {
        return 'redirect_after_login_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'translation_domain' => 'platform',
            'lockedParams' => []
        ]);
    }

    private function buildRedirectOptions()
    {
        $options = PlatformDefaults::$REDIRECT_OPTIONS;
        $choices = [];

        foreach ($options as $option) {
            $choices['redirect_after_login_option_'.strtolower($option)] = $option;
        }

        return $choices;
    }
}
