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

use Claroline\CoreBundle\Entity\Content;
use Claroline\CoreBundle\Manager\ContentManager;
use Claroline\CoreBundle\Manager\LocaleManager;
use JMS\DiExtraBundle\Annotation\Inject;
use JMS\DiExtraBundle\Annotation\InjectParams;
use JMS\DiExtraBundle\Annotation\Service;
use JMS\DiExtraBundle\Annotation\Tag;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * @Service("claroline.form.content")
 * @Tag("form.type")
 */
class ContentType extends AbstractType
{
    private $langs;
    private $contentManager;
    private $tinymce;

    /**
     * @InjectParams({
     *     "localeManager" = @Inject("claroline.manager.locale_manager"),
     *     "contentManager" = @Inject("claroline.manager.content_manager")
     * })
     */
    public function __construct(LocaleManager $localeManager, ContentManager $contentManager)
    {
        $this->langs = $localeManager->getAvailableLocales();
        $this->contentManager = $contentManager;
        $this->tinymce = true;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $translatedContent = [];

        if ($builder->getData() instanceof Content) {
            $translatedContent = $this->contentManager->getTranslatedContent(
                ['id' => $builder->getData()->getId()]
            );
        } elseif (is_array($builder->getData())) {
            $translatedContent = $builder->getData();
        }

        if (isset($options['attr']['tinymce']) && !$options['attr']['tinymce']) {
            $this->tinymce = false;
        }

        if (!empty($this->langs)) {
            foreach ($this->langs as $lang) {
                if (isset($translatedContent[$lang])) {
                    $builder->add(
                        $lang,
                        BaseContentType::class,
                        [
                            'attr' => ['tinymce' => $this->tinymce],
                            'data' => $translatedContent[$lang],
                        ]
                    );
                } else {
                    $builder->add($lang, BaseContentType::class, ['attr' => ['tinymce' => $this->tinymce]]);
                }
            }
        }
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'mapped' => false,
                'attr' => ['class' => 'content-element content-translatable relative'],
            ]
        );
    }

    public function finishView(FormView $view, FormInterface $form, array $options)
    {
        parent::finishView($view, $form, $options);

        $themeOptions = [
            'contentTitle' => true,
            'contentText' => true,
            'titlePlaceHolder' => 'optional_title',
            'textPlaceHolder' => 'create_content',
        ];

        foreach ($themeOptions as $option => $defaultValue) {
            if (isset($options['attr']) && isset($options['attr'][$option])) {
                $view->vars[$option] = $options['attr'][$option];
            } else {
                $view->vars[$option] = $defaultValue;
            }
        }
    }
}