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

use JMS\DiExtraBundle\Annotation\FormType;
use JMS\DiExtraBundle\Annotation\Service;
use Symfony\Component\Form\Extension\Core\Type\BaseType;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

/**
 * @Service("claroline.form.scroll")
 * @FormType(alias = "scroll")
 */
class ScrollType extends BaseType
{
    public function getName()
    {
        return 'scroll';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(
            [
                'attr' => ['class' => 'content-scroll'],
                'mapped' => false,
                'read_only' => true,
            ]
        );
    }
}
