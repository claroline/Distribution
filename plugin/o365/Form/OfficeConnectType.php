<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FormaLibre\OfficeConnectBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Validator\Constraints\NotBlank;

class OfficeConnectType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'office_client_id',
                'text',
                [
                    'constraints' => new NotBlank(),
                    'attr' => ['min' => 0],
                    'label' => 'office_client_id',
                ]
            )
            ->add(
                'office_password',
                'text',
                [
                    'constraints' => new NotBlank(),
                    'label' => 'password',
                ]
            )
            ->add(
                'office_app_tenant_domain_name',
                'text',
                [
                    'constraints' => new NotBlank(),
                    'label' => 'app_tenant_domain_name',
                ]
            )
            ->add('office_client_active', 'checkbox', ['label' => 'active', 'required' => false]);
    }

    public function getName()
    {
        return 'platform_facebook_application_form';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(['translation_domain' => 'office']);
    }
}
