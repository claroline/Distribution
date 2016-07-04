<?php

namespace UJM\ExoBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class WordResponseType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('response', 'text')
            ->add('score', 'text', [
                'attr' => ['placeholder' => 'points'],
                'translation_domain' => 'ujm_exo', ])
            ->add(
                'caseSensitive', 'checkbox', [
                    'required' => false,
                    'attr' => ['title' => 'case_sensitive'],
                    'translation_domain' => 'ujm_exo',
                ]
            )
            ->add(
                   'feedback', 'textarea', [
                   'required' => false, 'label' => ' ',
                   'attr' => ['class' => 'form-control',
                                   'data-new-tab' => 'yes',
                                   'placeholder' => 'feedback_answer_check',
                                   'style' => 'height:34px;',
                                   'translation_domain' => 'ujm_exo',
                       ],

                  ]
            )
            //->add('interactionopen')
            //->add('hole')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => 'UJM\ExoBundle\Entity\WordResponse',
            'translation_domain' => 'ujm_exo',
        ]);
    }

    public function getName()
    {
        return 'ujm_exobundle_wordresponsetype';
    }
}
