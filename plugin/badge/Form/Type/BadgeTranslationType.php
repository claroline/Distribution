<?php

namespace Icap\BadgeBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class BadgeTranslationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', 'text', ['label' => 'badge_form_name', 'attr' => ['maxlength' => 128]])
            ->add('description', 'text', ['label' => 'badge_form_description', 'attr' => ['maxlength' => 128]])
            ->add('criteria', 'tinymce', ['label' => 'badge_form_criteria'])
            ->add('locale', 'hidden');
    }

    public function getName()
    {
        return 'badge_translation_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class' => 'Icap\BadgeBundle\Entity\BadgeTranslation',
                'translation_domain' => 'icap_badge',
            ]
        );
    }
}
