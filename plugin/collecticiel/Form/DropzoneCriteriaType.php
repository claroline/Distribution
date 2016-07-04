<?php

namespace Innova\CollecticielBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class DropzoneCriteriaType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('goBack', 'hidden', [
                'mapped' => false,
            ])

// Ajout du nom du critère
            ->add('name', 'text', [
                'constraints' => new NotBlank(),
                'required' => true,
            ])

            ->add('recalculateGrades', 'hidden', ['mapped' => false]);
    }

    public function getName()
    {
        return 'innova_collecticiel_criteria_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'translation_domain' => 'innova_collecticiel',
        ]);
    }
}
