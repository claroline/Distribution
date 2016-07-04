<?php

namespace UJM\ExoBundle\Form;

use Claroline\CoreBundle\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class InteractionHoleType extends AbstractType
{
    private $user;
    private $catID;

    public function __construct(User $user, $catID = -1)
    {
        $this->user = $user;
        $this->catID = $catID;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('question', new QuestionType($this->user, $this->catID))
            ->add('html', 'tinymce', [
                    'attr' => ['data-new-tab' => 'yes'],
                    'label' => 'hole',
                    'attr' => ['data-before-unload' => 'off'],
                    'required' => false,
                ]
            )
            ->add('holes', 'collection', ['type' => new HoleType(),
                                               'prototype' => true,
                                               //'by_reference' => false,
                                               'allow_add' => true,
                                               'allow_delete' => true, ]);
            //->add('interaction')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class' => 'UJM\ExoBundle\Entity\InteractionHole',
                'cascade_validation' => true,
                'translation_domain' => 'ujm_exo',
            ]
        );
    }

    public function getName()
    {
        return 'ujm_exobundle_interactionholetype';
    }
}
