<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class ActivityType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title', TextType::class, array('label' => 'name', 'constraints' => new NotBlank(), 'attr' => array('autofocus' => true)))
            ->add('description', 'tinymce', array('required' => false, 'label' => 'description'))
            ->add(
                'primaryResource',
                'resourcePicker',
                array(
                    'required' => false,
                    'attr' => array(
                        'data-blacklist' => 'activity,directory',
                    ),
                )
            )->add(
                'published',
                CheckboxType::class,
                array(
                    'required' => true,
                    'mapped' => false,
                    'attr' => array('checked' => 'checked'),
                    'label' => 'publish_resource',
               )
            );
    }

    public function getName()
    {
        return 'activity_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array('translation_domain' => 'platform'));
    }
}
