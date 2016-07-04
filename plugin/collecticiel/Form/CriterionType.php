<?php

namespace Innova\CollecticielBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CriterionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('instruction', 'tinymce', [])
            ->add('totalCriteriaColumn', 'hidden', [])
            ->add('allowCommentInCorrection', 'hidden', [])
            ->add('correctionsGlobalInstructions', 'hidden', ['mapped' => false]);
    }

    public function getName()
    {
        return 'innova_collecticiel_criterion_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'translation_domain' => 'innova_collecticiel',
        ]);
    }
}
