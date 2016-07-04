<?php

namespace Icap\DropzoneBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DropzoneCommonType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $defaultDateTimeOptions = [
            'required' => false,
            'read_only' => false,
            'component' => true,
            'autoclose' => true,
            'language' => $options['language'],
            'date_format' => $options['date_format'],
        ];

        $builder
            ->add('stayHere', 'hidden', [
                'mapped' => false,
            ])
            ->add('autoCloseForManualStates', 'hidden', [
                'mapped' => false,
            ])
            ->add('instruction', 'tinymce', [
                'required' => false,
            ])

            ->add('allowWorkspaceResource', 'checkbox', ['required' => false])
            ->add('allowUpload', 'checkbox', ['required' => false])
            ->add('allowUrl', 'checkbox', ['required' => false])
            ->add('allowRichText', 'checkbox', ['required' => false])

            ->add('peerReview', 'choice', [
                'required' => true,
                'choices' => [
                    'Standard evaluation' => false,
                    'Peer review evaluation' => true,
                ],
                'choices_as_values' => true,
                'expanded' => true,
                'multiple' => false,
            ])
            ->add('expectedTotalCorrection', 'integer', ['required' => true])

            ->add('displayNotationToLearners', 'checkbox', ['required' => false])
            ->add('diplayCorrectionsToLearners', 'checkbox', ['required' => false])
            ->add('allowCorrectionDeny', 'checkbox', ['required' => false])
            ->add('displayNotationMessageToLearners', 'checkbox', ['required' => false])
            ->add('successMessage', 'tinymce', ['required' => false])
            ->add('failMessage', 'tinymce', ['required' => false])
            ->add('minimumScoreToPass', 'integer', ['required' => true])

            ->add('manualPlanning', 'choice', [
                'required' => true,
                'choices' => [
                    'manualPlanning' => true,
                    'sheduleByDate' => false,
                ],
                'choices_as_values' => true,
                'expanded' => true,
                'multiple' => false,
            ])

            ->add('manualState', 'choice', [
                'choices' => [
                    'notStartedManualState' => 'notStarted',
                    'allowDropManualState' => 'allowDrop',
                    'peerReviewManualState' => 'peerReview',
                    'allowDropAndPeerReviewManualState' => 'allowDropAndPeerReview',
                    'finishedManualState' => 'finished',
                ],
                'choices_as_values' => true,
                'expanded' => true,
                'multiple' => false,
            ])
            ->add('autoCloseOpenedDropsWhenTimeIsUp', 'checkbox', ['required' => false])
            ->add('notifyOnDrop', 'checkbox', ['required' => false])
            /*
             *
             ->add('startAllowDrop', 'datetime', array('date_widget' => 'single_text', 'time_widget' => 'single_text', 'with_seconds' => false, 'required' => false))
            ->add('endAllowDrop', 'datetime', array('date_widget' => 'single_text', 'time_widget' => 'single_text', 'with_seconds' => false, 'required' => false))
            ->add('startReview', 'datetime', array('date_widget' => 'single_text', 'time_widget' => 'single_text', 'with_seconds' => false, 'required' => false))
            ->add('endReview', 'datetime', array('date_widget' => 'single_text', 'time_widget' => 'single_text', 'with_seconds' => false, 'required' => false))
            */
            ->add('startAllowDrop', 'datetimepicker', $defaultDateTimeOptions)
            ->add('endAllowDrop', 'datetimepicker', $defaultDateTimeOptions)
            ->add('startReview', 'datetimepicker', $defaultDateTimeOptions)
            ->add('endReview', 'datetimepicker', $defaultDateTimeOptions);
    }

    public function getName()
    {
        return 'icap_dropzone_common_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class' => 'Icap\DropzoneBundle\Entity\Dropzone',
                'language' => 'en',
                'translation_domain' => 'icap_dropzone',
                'date_format' => DateType::HTML5_FORMAT,
            ]
        );
    }
}
