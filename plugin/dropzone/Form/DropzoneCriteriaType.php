<?php

namespace Icap\DropzoneBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DropzoneCriteriaType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('goBack', 'hidden', [
                'mapped' => false,
            ])
            ->add('correctionInstruction', 'tinymce', ['required' => false])
            ->add('totalCriteriaColumn', 'number', ['required' => true])
            ->add('allowCommentInCorrection', 'checkbox', ['required' => false])
            ->add('forceCommentInCorrection', 'checkbox', ['required' => false])
            ->add('recalculateGrades', 'hidden', ['mapped' => false]);
    }

    public function getName()
    {
        return 'icap_dropzone_criteria_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'translation_domain' => 'icap_dropzone',
        ]);
    }
}
