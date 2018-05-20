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

use Claroline\CoreBundle\Form\Field\ContentType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SendMailType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('object', TextType::class, ['label' => 'object'])
            ->add(ContentType::class, 'tinymce', ['label' => 'message']);
    }

    public function getName()
    {
        return 'send_mail_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(['translation_domain' => 'platform']);
    }
}
