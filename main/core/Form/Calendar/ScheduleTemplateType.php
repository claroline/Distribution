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

class ScheduleTemplateType extends AngularType
{
    public function __construct()
    {
        $this->forApi = false;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('day', 'integer', ['label' => 'start', 'required' => true])
            ->add('name', 'string', ['label' => 'name', 'required' => true])
            ->add('description', 'text', ['label' => 'description', 'required' => false])
            ->add('startHour', 'integer', ['label' => 'openHour', 'required' => true])
            ->add('endHour', 'integer', ['label' => 'endHour', 'required' => true]);
    }

    public function getName()
    {
        return 'schedule_template_form';
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
        $default['ng-model'] = 'scheduleTemplate';

        $resolver->setDefaults($default);
    }
}
