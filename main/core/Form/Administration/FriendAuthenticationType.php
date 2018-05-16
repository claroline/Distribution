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
use Symfony\Component\OptionsResolver\OptionsResolver;

class FriendAuthenticationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add(
            'allowAuthentication',
            CheckboxType::class,
            array(
                'label' => 'allow_authentication',
                'required' => false,
            )
        );
        $builder->add(
            'createUserIfMissing',
            'hidden',
            array('data' => true)
        );
    }

    public function getName()
    {
        return 'friend_authentication_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
                'translation_domain' => 'platform',
            )
        );
    }
}
