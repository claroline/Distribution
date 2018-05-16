<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Form\Field;

use JMS\DiExtraBundle\Annotation as DI;
use JMS\DiExtraBundle\Annotation\Tag;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * @DI\Service("claroline.form.buttongroupselect")
 * @Tag("form.type")
 */
class ButtonGroupSelectType extends AbstractType
{
    public function getParent()
    {
        return ChoiceType::class;
    }

    public function getName()
    {
        return 'buttongroupselect';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver
        ->setDefaults(
            [
                'translation_domain' => 'platform',
            ]
        );
    }
}
