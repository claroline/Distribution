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

use Claroline\CoreBundle\Validator\Constraints\CsvWorkspace;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\OptionsResolver\OptionsResolver;

class WorkspaceImportType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add(
            FileType::class,
            FileType::class,
            array(
                'label' => 'workspace',
                'required' => true,
                'mapped' => false,
                'constraints' => array(
                    new NotBlank(),
                    new File(),
                    new CsvWorkspace(),
                ),
            )
        );
    }

    public function getName()
    {
        return 'workspace_import_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver
            ->setDefaults(
                array(
                    'translation_domain' => 'platform',
                )
            );
    }
}
