<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class AdminAnalyticsConnectionsType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'unique', 'buttongroupselect', [
                    'label' => 'show',
                    'attr' => ['class' => 'input-sm'],
                    'choices' => [
                        'false' => 'connections',
                        'true' => 'unique_connections',
                    ],
                    'theme_options' => ['label_width' => 'col-md-2', 'control_width' => 'col-md-3'],
                ]
            )
            ->add(
                'range',
                'daterange',
                [
                    'label' => 'for_period',
                    'required' => false,
                    'attr' => ['class' => 'input-sm'],
                    'theme_options' => ['label_width' => 'col-md-2', 'control_width' => 'col-md-3'],
                ]
            );
    }

    public function getName()
    {
        return 'admin_analytics_connections_form';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver
        ->setDefaults(
            [
                'translation_domain' => 'platform',
                'csrf_protection' => false,
            ]
        );
    }
}
