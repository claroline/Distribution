<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 4/13/17
 */

namespace Claroline\AuthenticationBundle\Form\ExternalSynchronization;

use Claroline\AuthenticationBundle\Library\Configuration\ExternalSynchronization\ExternalSourceConfiguration;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class ExternalSourceConfigurationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'name',
                TextType::class,
                [
                    'constraints' => new NotBlank(),
                    'label' => 'name',
                ]
            )
            ->add(
                'host',
                TextType::class,
                [
                    'constraints' => new NotBlank(),
                    'label' => 'host',
                ]
            )
            ->add(
                'port',
                NumberType::class,
                [
                    'required' => false,
                    'label' => 'port',
                ]
            )
            ->add(
                'dbname',
                TextType::class,
                [
                    'constraints' => new NotBlank(),
                    'label' => 'database',
                ]
            )
            ->add(
                'driver',
                ChoiceType::class,
                [
                    'choices' => ExternalSourceConfiguration::PDO_LIST,
                    'choices_as_values' => true,
                    'constraints' => new NotBlank(),
                    'label' => 'type',
                ]
            )
            ->add(
                'user',
                TextType::class,
                [
                    'constraints' => new NotBlank(),
                    'label' => 'user',
                ]
            )
            ->add(
                'password',
                PasswordType::class,
                [
                    'constraints' => new NotBlank(),
                    'label' => 'password',
                    'always_empty' => false,
                    'attr' => ['autocomplete' => 'new-password'],
                ]
            );
    }

    /**
     * Returns the name of this type.
     *
     * @return string The name of this type
     */
    public function getName()
    {
        return 'claroline_external_synchronization_source_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'translation_domain' => 'platform',
            'csrf_protection' => true,
            'csrf_field_name' => '_token',
        ]);
    }
}
