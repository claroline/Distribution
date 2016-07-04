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

class ActivityParametersType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add(
            'withTutor',
            'choice',
            [
                'choices' => [0 => 'no', 1 => 'yes'],
                'required' => false,
                'label' => 'with_tutor',
            ]
        );
        $builder->add(
            'max_duration',
            'integer',
            [
                'attr' => ['min' => 1],
                'required' => false,
                'label' => 'max_second_duration',
            ]
        );
        $builder->add(
            'who',
            'choice',
            [
                'choices' => [
                    'individual' => 'individual',
                    'collaborative' => 'collaborative',
                    'mixed' => 'mixed',
                ],
                'required' => false,
                'label' => 'method_of_work',
            ]
        );
        $builder->add(
            'where',
            'choice',
            [
                'choices' => [
                    'anywhere' => 'anywhere',
                    'classroom' => 'classroom',
                ],
                'required' => false,
                'label' => 'learning_place',
            ]
        );
        $builder->add(
            'max_attempts',
            'integer',
            [
                'attr' => ['min' => 1],
                'required' => false,
                'label' => 'max_attempts',
            ]
        );
        $builder->add(
            'evaluation_type',
            'choice',
            [
                'choices' => [
                    'manual' => 'evaluation-manual',
                    'automatic' => 'evaluation-automatic',
                ],
                'required' => true,
                'label' => 'evaluation_type',
            ]
        );
    }

    public function getName()
    {
        return 'activity_parameters_form';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(
            ['translation_domain' => 'platform']
        );
    }
}
