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
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Email;

class MailType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add(
                'receiver',
                TextType::class,
                array(
                    'required' => true,
                    'constraints' => new Email(),
                    'label' => 'receiver',
                )
            )
            ->add('object', TextType::class, array('label' => 'object'))
            ->add('content', 'tinymce', array('label' => 'content'));
    }

    public function getName()
    {
        return 'mail_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array('translation_domain' => 'platform'));
    }
}
