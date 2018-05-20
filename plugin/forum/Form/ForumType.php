<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ForumBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class ForumType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('name', TextType::class, array('constraints' => new NotBlank(), 'attr' => array('autofocus' => true)));
        $builder->add(
            'activateNotifications',
            ChoiceType::class,
            array(
                'choices' => array(true => 'yes', false => 'no'),
                'expanded' => false,
                'multiple' => false,
                'label' => 'notifications',
            )
        );
    }

    public function getName()
    {
        return 'forum_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            array(
                'translation_domain' => 'forum',
            )
        );
    }
}
