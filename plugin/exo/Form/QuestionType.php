<?php

namespace UJM\ExoBundle\Form;

use Claroline\CoreBundle\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use UJM\ExoBundle\Repository\CategoryRepository;

class QuestionType extends AbstractType
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
        $uid = $this->user->getId();

        $builder
            ->add(
                'title', 'text', [
                    'label' => 'title',
                    'required' => false,
                    'attr' => ['placeholder' => 'question_title'],
                ]
            )
            ->add(
                'category', 'entity', [
                    'class' => 'UJM\\ExoBundle\\Entity\\Category',
                    'label' => 'Category.value',
                    'required' => false,
                    'empty_value' => 'choose_category',
                    'query_builder' => function (CategoryRepository $cr) use ($uid) {
                        if ($this->catID === -1) {
                            return $cr->getUserCategory($uid);
                        } else {
                            return $cr->createQueryBuilder('c')
                                ->where('c.id = ?1')
                                ->setParameter(1, $this->catID);
                        }
                    },
                ]
            )
            ->add(
                'stepID', 'hidden', [
                    'mapped' => false,
                ]
            )
            ->add('description', 'textarea', [
                    'label' => 'question_description',
                    'required' => false,
                    'attr' => [
                        'placeholder' => 'question_description',
                        'class' => 'form-control',
                        'data-new-tab' => 'yes',
                    ],
                ]
            )
            ->add('invite', 'tinymce', [
                    'label' => 'question',
                    'attr' => [
                        'placeholder' => 'question',
                        'data-new-tab' => 'yes',
                    ],
                ]
            )
            ->add(
                'model', 'checkbox', [
                    'required' => false,
                    'label' => 'question_model',
                    'translation_domain' => 'ujm_exo',
                ]
            )
            ->add('feedBack', 'tinymce', [
                    //for automatically open documents in a new tab for all tinymce field
                    'attr' => [
                        'data-new-tab' => 'yes',
                        'placeholder' => 'interaction_feedback',
                    ],
                    'label' => 'interaction_feedback',
                    'required' => false,
                ]
            )
            ->add(
                'hints', 'collection', [
                    'type' => new HintType(),
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
                'data_class' => 'UJM\ExoBundle\Entity\Question',
                'translation_domain' => 'ujm_exo',
            ]
        );
    }

    public function getName()
    {
        return 'ujm_exobundle_questiontype';
    }
}
