<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Form\Calendar;

use Claroline\CoreBundle\Form\Angular\AngularType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class YearType extends AngularType
{
    public function __construct()
    {
        $this->forApi = false;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('start', 'datetime', ['label' => 'start', 'required' => true])
            ->add('end', 'datetime', ['label' => 'end', 'required' => true])
            ->add('openHour', 'integer', ['label' => 'openHour', 'required' => false])
            ->add('closeHour', 'integer', ['label' => 'closeHour', 'required' => false])
            ->add('organization', 'entity', [
                    'class' => 'ClarolineCoreBundle:Organization\Organization',
                    'property' => 'name',
                    'multiple' => false,
                    'expanded' => false,
                    'required' => true,
                ]
            );
    }

    public function getName()
    {
        return 'year_form';
    }

    public function enableApi()
    {
        $this->forApi = true;
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $default = ['translation_domain' => 'platform'];
        if ($this->forApi) {
            $default['csrf_protection'] = false;
        }
        $default['ng-model'] = 'year';

        $resolver->setDefaults($default);
    }
}
