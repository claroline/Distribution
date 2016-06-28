<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Form;

use Claroline\CoreBundle\Form\Angular\AngularType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Validator\Constraints\DateTime;
use Symfony\Component\Validator\Constraints\NotBlank;

class SessionEventType extends AngularType
{
    private $forApi = false;
    private $ngAlias;

    public function __construct($ngAlias = 'cmc')
    {
        $this->ngAlias = $ngAlias;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add(
            'name',
            'text',
            ['required' => true, 'label' => 'name', 'translation_domain' => 'platform']
        );
        $builder->add(
            'description',
            'textarea',
            ['required' => false, 'label' => 'description', 'translation_domain' => 'platform']
        );
        $builder->add(
            'startDate',
            'datetime',
            [
                'required' => true,
                'input' => 'datetime',
                'format' => 'dd/MM/yyy HH:mm',
//                'format' => 'MM/dd/yyyy',
                'widget' => 'single_text',
                'attr' => [
                    'class' => 'date',
                    'with_seconds' => false,
                    'data_timezone' => 'Europe/Brussels',
                    'user_timezone' => 'Europe/Brussels',
                ],
                'constraints' => [new DateTime(), new NotBlank()],
                'translation_domain' => 'platform',
                'label' => 'start_date',
            ]
        );
        $builder->add(
            'endDate',
            'datetime',
            [
                'required' => true,
                'input' => 'datetime',
                'format' => 'dd/MM/yyy HH:mm',
//                'format' => 'MM/dd/yyyy',
//                'format' => 'dd-MM-yyyy',
                'widget' => 'single_text',
                'attr' => [
                    'class' => 'date',
                    'with_seconds' => false,
                    'data_timezone' => 'Europe/Brussels',
                    'user_timezone' => 'Europe/Brussels',
                ],
                'constraints' => [new DateTime(), new NotBlank()],
                'translation_domain' => 'platform',
                'label' => 'end_date',
            ]
        );
        $builder->add(
            'location',
            'textarea',
            ['required' => false, 'label' => 'location', 'translation_domain' => 'platform']
        );
    }

    public function getName()
    {
        return 'session_event_form';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $default = ['translation_domain' => 'cursus'];

        if ($this->forApi) {
            $default['csrf_protection'] = false;
        }
        $default['ng-model'] = 'sessionEvent';
        $default['ng-controllerAs'] = $this->ngAlias;
        $resolver->setDefaults($default);
    }

    public function enableApi()
    {
        $this->forApi = true;
    }
}
