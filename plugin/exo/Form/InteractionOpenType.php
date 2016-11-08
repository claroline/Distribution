<?php

namespace UJM\ExoBundle\Form;

use Claroline\CoreBundle\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class InteractionOpenType extends AbstractType
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
            ->add('question', new QuestionType($this->user, $this->catID));
        $builder
            ->add(
                'typeopenquestion', 'entity', [
                    'class' => 'UJM\\ExoBundle\\Entity\\TypeOpenQuestion',
                    'label' => 'type_question',
                    'choice_translation_domain' => true,
                ]
            );
        $builder
            ->add(
                'wordResponses', 'collection', [
                    'type' => new WordResponseType(),
                    'prototype' => true,
                    'allow_add' => true,
                    'allow_delete' => true,
                ]
            );
        $builder
            ->add(
                'scoreMaxLongResp', 'text', [
                'required' => false,
                'label' => 'right_response',
                    'attr' => ['placeholder' => 'points'],
                ]
            );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class' => 'UJM\ExoBundle\Entity\InteractionOpen',
                'cascade_validation' => true,
                'translation_domain' => 'ujm_exo',
            ]
        );
    }

    public function getName()
    {
        return 'ujm_exobundle_interactionopentype';
    }
}
