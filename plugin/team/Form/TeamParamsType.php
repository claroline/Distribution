<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\TeamBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TeamParamsType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add(
            'maxTeams',
            IntegerType::class,
            [
                'attr' => ['min' => 0],
                'required' => false,
            ]
        );
        $builder->add(
            'isPublic',
            ChoiceType::class,
            [
                'choices' => [
                    true => 'public',
                    false => 'private',
                ],
                'required' => true,
            ]
        );
        $builder->add(
            'selfRegistration',
            CheckboxType::class,
            ['required' => true]
        );
        $builder->add(
            'selfUnregistration',
            CheckboxType::class,
            ['required' => true]
        );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(['translation_domain' => 'team']);
    }
}
