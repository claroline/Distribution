<?php

namespace Icap\BlogBundle\Form;

use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @DI\Service("icap_blog.form.post")
 */
class PostType extends AbstractType
{
    /** @var \Claroline\CoreBundle\Manager\EventManager */
    private $authorizationChecker;

    /**
     * @DI\InjectParams({
     *     "authorizationChecker" = @DI\Inject("security.authorization_checker")
     * })
     */
    public function __construct(AuthorizationCheckerInterface $authorizationChecker)
    {
        $this->authorizationChecker = $authorizationChecker;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title', 'text', [
                    'theme_options' => ['control_width' => 'col-md-12'],
                    'constraints' => new Assert\NotBlank([
                        'message' => 'blog_post_need_title',
                    ]),
                ]
            )
            ->add('content', 'tinymce', [
                    'attr' => [
                        'style' => 'height: 300px;',
                    ],
                    'theme_options' => ['control_width' => 'col-md-12'],
                    'constraints' => new Assert\NotBlank([
                        'message' => 'blog_post_need_content',
                    ]),
                ]
            )
            ->add('tags', 'tags')
        ;

        $authorizationChecker = $this->authorizationChecker;

        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            function (FormEvent $event) use ($authorizationChecker, $options) {
                $form = $event->getForm();
                $data = $event->getData();
                $blog = $data->getBlog();

                if ($authorizationChecker->isGranted('EDIT', $blog) || $authorizationChecker->isGranted('POST', $blog)) {
                    $form->add('publicationDate', 'datepicker', [
                            'required' => false,
                            'read_only' => true,
                            'component' => true,
                            'autoclose' => true,
                            'language' => $options['language'],
                            'format' => $options['date_format'],
                       ]
                    );
                }
            }
        );
    }

    public function getName()
    {
        return 'icap_blog_post_form';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'translation_domain' => 'icap_blog',
            'data_class' => 'Icap\BlogBundle\Entity\Post',
            'csrf_protection' => true,
            'intention' => 'create_post',
            'language' => 'en',
            'date_format' => DateType::HTML5_FORMAT,
        ]);
    }
}
