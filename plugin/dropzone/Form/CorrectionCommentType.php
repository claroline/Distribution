<?php

namespace Icap\DropzoneBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CorrectionCommentType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        if ($options['allowCommentInCorrection'] == true && $options['edit'] === true) {
            $builder->add('comment', 'tinymce', ['required' => false]);
        }

        $builder
            ->add('goBack', 'hidden', ['mapped' => false]);
    }

    public function getName()
    {
        return 'icap_dropzone_correct_comment_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'edit' => true,
            'allowCommentInCorrection' => false,
            'translation_domain' => 'icap_dropzone',
        ]);
    }
}
