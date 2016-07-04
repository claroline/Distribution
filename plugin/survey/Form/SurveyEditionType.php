<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\SurveyBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class SurveyEditionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add(
            'description',
            'tinymce'
        );
        $builder->add(
            'startDate',
            'date',
            [
                'required' => false,
                'widget' => 'single_text',
                'format' => 'yyyy-MM-dd',
            ]
        );
        $builder->add(
            'endDate',
            'date',
            [
                'required' => false,
                'widget' => 'single_text',
                'format' => 'yyyy-MM-dd',
            ]
        );
        $builder->add(
            'hasPublicResult',
            'checkbox',
            ['required' => true]
        );
        $builder->add(
            'allowAnswerEdition',
            'checkbox',
            ['required' => true]
        );
    }

    public function getName()
    {
        return 'survey_edition_form';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(['translation_domain' => 'survey']);
    }
}
