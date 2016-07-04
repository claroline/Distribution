<?php

namespace UJM\ExoBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProposalType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'ordre', 'text'
            )
            ->add(
                'value', 'textarea', [
                    'required' => true,
                    'label' => ' ',
                    'attr' => [
                        'class' => 'form-control',
                        'style' => 'height:34px;',
                        'placeholder' => 'choice',
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
                'data_class' => 'UJM\ExoBundle\Entity\Proposal',
                'translation_domain' => 'ujm_exo',
            ]);
    }

    public function getName()
    {
        return 'ujm_exobundle_proposaltype';
    }
}
