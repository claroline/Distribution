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
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\Validator\Constraints\NotBlank;

class UpdateFileType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('name', 'hidden', ['data' => 'tmpname']);
        $builder->add(
            'file',
            'file',
            [
                'required' => true,
                'mapped' => false,
                'label' => 'file',
                'constraints' => [
                    new NotBlank(),
                    new File(),
                ],
            ]
        );
    }

    public function getName()
    {
        return 'file_form';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver
            ->setDefaults(
                [
                    'translation_domain' => 'platform',
                ]
            );
    }
}
