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

use Symfony\Component\Form\Extension\Core\Type\BaseType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use JMS\DiExtraBundle\Annotation\Service;
use JMS\DiExtraBundle\Annotation\FormType;

/**
 * @Service("claroline.form.base_content")
 * @FormType(alias = "base_content")
 */
class BaseContentType extends BaseType
{
    public function getName()
    {
        return 'base_content';
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $title = '';
        $content = '';

        if (is_array($translatedContent = $builder->getData())) {
            if (isset($translatedContent['title'])) {
                $title = $translatedContent['title'];
            }
            if (isset($translatedContent['content'])) {
                $content = $translatedContent['content'];
            }
        }

        $builder->add('title', TextType::class, array('data' => $title));
        if (isset($options['theme_options']['tinymce']) && !$options['theme_options']['tinymce']) {
            $builder->add(
                ContentType::class,
                'textarea',
                array(
                    'attr' => array('class' => 'form-control', 'rows' => '3'),
                    'mapped' => false,
                    'data' => $content,
                )
            );
        } else {
            $builder->add(ContentType::class, 'tinymce', array('data' => $content));
        }
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array('required' => false, 'mapped' => false));
    }
}
