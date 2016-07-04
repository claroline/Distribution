<?php

namespace Claroline\CoreBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class UserPublicProfileUrlType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('public_url', 'text', [
                'required' => true,
                'attr' => [
                    'maxlength' => 30,
                    'class' => 'check-ok',
                    'pattern' => '[^/]+',
                ],
            ]);
    }

    public function getName()
    {
        return 'user_public_profile_url_form';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults([
            'translation_domain' => 'platform',
            'data_class' => 'Claroline\CoreBundle\Entity\User',
            'csrf_protection' => true,
            'intention' => 'configure_public_profile_url',
        ]);
    }
}
