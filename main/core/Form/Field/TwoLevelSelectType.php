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
use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * @DI\Service("claroline.form.twolevelselect")
 * @DI\FormType(alias = "twolevelselect")
 */
class TwoLevelSelectType extends AbstractType
{
    public function getParent()
    {
        return 'choice';
    }

    public function getName()
    {
        return 'twolevelselect';
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
