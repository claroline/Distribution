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

class WorkspaceOrderToolEditType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('name', TextType::class, array('required' => true));
    }

    public function getName()
    {
        return 'workspace_order_tool_edit_form';
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
