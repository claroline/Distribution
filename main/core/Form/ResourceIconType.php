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

class ResourceIconType extends AbstractType
{
    private $creator;

    public function __construct($creator)
    {
        $this->creator = $creator;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add(
            'name',
            'text',
            ['label' => 'name', 'disabled' => true]
        );
        $builder->add(
            'newIcon',
            'file',
            [
                'required' => false,
                'mapped' => false,
                'label' => 'icon',
            ]
        );
        $builder->add(
            'creationDate',
            'date',
            [
                'disabled' => true,
                'widget' => 'single_text',
                'format' => 'yyyy-MM-dd',
                'label' => 'creation_date',
            ]
        );
        $builder->add(
            'creator',
            'text',
            [
                'data' => $this->creator,
                'mapped' => false,
                'disabled' => true,
                'label' => 'creator',
            ]
        );
    }

    public function getName()
    {
        return 'resource_icon_form';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(['translation_domain' => 'platform']);
    }
}
