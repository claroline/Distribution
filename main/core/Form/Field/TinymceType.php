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

use Claroline\CoreBundle\Form\DataTransformer\JavascriptSafeTransformer;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

/**
 * @DI\Service("claroline.form.tinymce")
 * @DI\FormType(alias = "tinymce")
 */
class TinymceType extends TextareaType
{
    private $defaultAttributes = ['class' => 'claroline-tiny-mce hide'];

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->addModelTransformer(new JavascriptSafeTransformer());
    }

    public function getName()
    {
        return 'tinymce';
    }

    public function getParent()
    {
        return 'textarea';
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(['attr' => $this->defaultAttributes]);
        $resolver->setNormalizers(
            [
                'attr' => function (Options $options, $value) {
                    return array_merge($this->defaultAttributes, $value);
                },
            ]
        );
    }
}
