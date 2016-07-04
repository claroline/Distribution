<?php

namespace Icap\BlogBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class BlogBannerType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('banner_activate', 'checkbox', [
                'required' => false,
            ])
            ->add('banner_background_color', 'text', [
                'theme_options' => ['label_width' => ''],
            ])
            ->add('banner_height', 'text', [
                'theme_options' => ['label_width' => ''],
                'attr' => [
                    'class' => 'input-sm',
                    'data-min' => 100,
                ],
            ])
            ->add('file', 'file', [
                'label' => 'icap_blog_banner_form_banner_background_image',
                'theme_options' => ['label_width' => ''],
                'required' => false,
            ])
            ->add('banner_background_image_position', 'text', [
                'theme_options' => ['label_width' => ''],
                'required' => false,
            ])
            ->add('banner_background_image_repeat', 'text', [
                'theme_options' => ['label_width' => ''],
                'required' => false,
            ])
        ;
    }

    public function getName()
    {
        return 'icap_blog_banner_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
           'translation_domain' => 'icap_blog',
            'data_class' => 'Icap\BlogBundle\Entity\BlogOptions',
            'csrf_protection' => true,
            'intention' => 'configure_banner_blog',
            'no_captcha' => true,
        ]);
    }
}
