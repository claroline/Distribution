<?php

namespace UJM\ExoBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ChoiceType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'ordre', 'text'
            )
            ->add(
                'rightResponse', 'checkbox', [
                    'required' => false, 'label' => ' ',
                ]
            )
            ->add(
                'label', 'textarea', [
                    'label' => ' ',
                    'required' => true,
                    'attr' => ['style' => 'height:34px; ',
                    'class' => 'form-control',
                    'placeholder' => 'choice',
                    ],
                ]
            )
            ->add(
                'weight', 'text', [
                    'required' => false,
                    'label' => ' ',
                    'attr' => ['placeholder' => 'points', 'size' => '10'],
                ]
            )
            ->add(
                   'feedback', 'textarea', [
                   'required' => false, 'label' => ' ',
                   'attr' => ['class' => 'form-control',
                                   'data-new-tab' => 'yes',
                                   'placeholder' => 'feedback_answer_check',
                                   'style' => 'height:34px;',
                       ],
                  ]
            )
            ->add(
                'positionForce', 'checkbox', [
                    'required' => false, 'label' => ' ',
                ]
            );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class' => 'UJM\ExoBundle\Entity\Choice',
                'translation_domain' => 'ujm_exo',
            ]
        );
    }

    public function getName()
    {
        return 'ujm_exobundle_choicetype';
    }
}
