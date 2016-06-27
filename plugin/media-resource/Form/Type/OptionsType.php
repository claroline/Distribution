<?php

namespace Innova\MediaResourceBundle\Form\Type;

use Innova\MediaResourceBundle\Entity\Options;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

/**
 * Description of OptionsType.
 */
class OptionsType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('mode', 'choice', [
                            'label' => 'options_form_view_mode',
                            'required' => true,
                            'choices' => [
                              Options::CONTINUOUS_LIVE => 'options_form_view_mode_choices_live',
                              Options::CONTINUOUS_PAUSE => 'options_form_view_mode_choices_pause',
                              Options::FREE => 'options_form_view_mode_choices_free',
                              Options::CONTINUOUS_ACTIVE => 'options_form_view_mode_choices_active',
                              Options::SCRIPTED_ACTIVE => 'options_form_view_mode_choices_scripted_active',
                              ],
                              'expanded' => false,
                              'multiple' => false,
                    ]
                )
                ->add('showTextTranscription', 'checkbox', [
                            'label' => 'options_form_enable_text_transcription',
                            'required' => false,
                    ]
                )
                ->add('ttsLanguage', 'choice', [
                            'choices' => [
                              Options::EN_US => 'options_form_tts_choices_en_US',
                              Options::EN_GB => 'options_form_tts_choices_en_GB',
                              Options::DE_DE => 'options_form_tts_choices_de_DE',
                              Options::ES_ES => 'options_form_tts_choices_es_ES',
                              Options::FR_FR => 'options_form_tts_choices_fr_FR',
                              Options::IT_IT => 'options_form_tts_choices_it_IT',
                              ],
                              'expanded' => false,
                              'multiple' => false,
                              'label' => 'options_form_tts_language',
                              'required' => true,
                    ]
                );
    }

    public function getDefaultOptions()
    {
        return [
            'data_class' => 'Innova\MediaResourceBundle\Entity\Options',
            'translation_domain' => 'resource_form',
        ];
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults($this->getDefaultOptions());

        return $this;
    }

    public function getName()
    {
        return 'media_resource_options';
    }
}
