<?php

namespace UJM\ExoBundle\Form;

use Claroline\CoreBundle\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class InteractionMatchingType extends AbstractType
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
            ->add(
                'question', new QuestionType(
                    $this->user, $this->catID
                )
            );
        $builder
            ->add(
                'shuffle', 'checkbox', [
                    'label' => 'inter_matching_shuffle',
                    'required' => false,
                ]
            );
        $builder
            ->add(
                'typeMatching', 'entity', [
                    'class' => 'UJM\\ExoBundle\\Entity\\TypeMatching',
                    'label' => 'matching_value',
                    'choice_translation_domain' => true,
                ]
            );
        $builder
            ->add(
                'labels', 'collection', [
                    'type' => new LabelType(),
                    'prototype' => true,
                    'allow_add' => true,
                    'allow_delete' => true,
                ]
            );
        $builder
            ->add(
                'proposals', 'collection', [
                    'type' => new ProposalType(),
                    'prototype' => true,
                    'allow_add' => true,
                    'allow_delete' => true,
                ]
            );
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class' => 'UJM\ExoBundle\Entity\InteractionMatching',
                'cascade_validation' => true,
                'translation_domain' => 'ujm_exo',
            ]
        );
    }

    public function getName()
    {
        return 'ujm_exobundle_interactionmatchingtype';
    }
}
