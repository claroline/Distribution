<?php

namespace UJM\ExoBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class HintType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'value', 'textarea', [
                    'label' => 'hint',
                    'attr' => ['style' => 'height:57px',
                                      'class' => 'form-control', ],
                ]
            )
            ->add(
                'penalty', 'text', [
                    'label' => 'penalty',
                    'attr' => ['style' => 'width:50px; text-align: end;'],
                ]
            );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class' => 'UJM\ExoBundle\Entity\Hint',
                'translation_domain' => 'ujm_exo',
            ]
        );
    }

    public function getName()
    {
        return 'ujm_exobundle_hinttype';
    }
}
