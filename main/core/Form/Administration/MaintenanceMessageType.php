<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Form\Administration;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class MaintenanceMessageType extends AbstractType
{
    private $content;

    public function __construct($content = '')
    {
        $this->content = $content;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add(
            'content',
            'tinymce',
            array(
                'required' => false,
                'mapped' => false,
                'data' => $this->content,
            )
        );
    }

    public function getName()
    {
        return 'maintenance_message_form';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array('translation_domain' => 'platform'));
    }
}
