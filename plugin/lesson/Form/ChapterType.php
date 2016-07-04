<?php

namespace Icap\LessonBundle\Form;

use Icap\LessonBundle\Entity\Chapter;
use Icap\LessonBundle\Entity\Lesson;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 * @DI\Service("icap.lesson.chaptertype")
 */
class ChapterType extends AbstractType
{
    protected $translator;

    /**
     * Constructor.
     *
     * @DI\InjectParams({
     *     "translator" = @DI\Inject("translator")
     * })
     */
    public function __construct($translator)
    {
        $this->translator = $translator;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title', 'text')
            ->add('text', 'tinymce', [
                    'attr' => [
                        'data-theme' => 'advanced',
                        'height' => '600',
                    ],
                ]
            )
        ;
        if ($options['chapters'] != null) {
            $root = true;
            $parentId = null;
            foreach ($options['chapters'] as $child) {
                if ($root) {
                    $choices[$child->getId()] = $this->translator->trans('Root', [], 'icap_lesson');
                    $root = false;
                } else {
                    $choices[$child->getId()] = $child->getTitle();
                }
                //check that the provided parentId is a legit chapter id
                if ($options['parentId'] == $child->getId()) {
                    $parentId = $child->getId();
                }
            }
            $builder->add('parentChapter', 'choice', [
                'mapped' => false,
                'choices' => $choices,
                'data' => $parentId,
            ]);
        }
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => 'Icap\LessonBundle\Entity\Chapter',
            'chapters' => [],
            'parentId' => null,
            'no_captcha' => true,
        ]);
    }

    public function getName()
    {
        return 'icap_lesson_chaptertype';
    }
}
