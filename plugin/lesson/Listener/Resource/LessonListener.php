<?php

namespace Icap\LessonBundle\Listener\Resource;

use Claroline\CoreBundle\Event\CreateFormResourceEvent;
use Claroline\CoreBundle\Event\CreateResourceEvent;
use Claroline\CoreBundle\Event\Resource\DeleteResourceEvent;
use Claroline\CoreBundle\Event\Resource\OpenResourceEvent;
use Claroline\CoreBundle\Event\Resource\CopyResourceEvent;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Icap\LessonBundle\Entity\Lesson;
use Icap\LessonBundle\Form\LessonType;
use Symfony\Component\HttpFoundation\RedirectResponse;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\Response;

/**
 * @DI\Service()
 */
class LessonListener
{

    private $container;

    /* @var ObjectManager */
    private $om;

    /** @var SerializerProvider */
    private $serializer;

    /**
     * LessonListener constructor.
     *
     * @DI\InjectParams({
     *     "container" = @DI\Inject("service_container")
     * })
     *
     * @param ContainerInterface $container
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->om = $container->get('claroline.persistence.object_manager');
        $this->serializer = $container->get('claroline.api.serializer');
    }

    /**
     * @DI\Observe("create_form_icap_lesson")
     *
     * @param CreateFormResourceEvent $event
     */
    public function onCreateForm(CreateFormResourceEvent $event)
    {
        $form = $this->container->get('form.factory')->create(new LessonType(), new Lesson());
        $content = $this->container->get('templating')->render(
            'ClarolineCoreBundle:resource:create_form.html.twig',
            [
                'form' => $form->createView(),
                'resourceType' => 'icap_lesson',
            ]
        );

        $event->setResponseContent($content);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("create_icap_lesson")
     *
     * @param CreateResourceEvent $event
     */
    public function onCreate(CreateResourceEvent $event)
    {
        $request = $this->container->get('request_stack')->getMasterRequest();
        $form = $this->container->get('form.factory')->create(new LessonType(), new Lesson());
        $form->handleRequest($request);
        if ($form->isValid()) {
            $lesson = $form->getData();
            $event->setResources([$lesson]);
        } else {
            $content = $this->container->get('templating')->render(
                'ClarolineCoreBundle:Resource:create_form.html.twig',
                [
                    'form' => $form->createView(),
                    'resourceType' => 'icap_lesson',
                ]
            );
            $event->setErrorFormContent($content);
        }
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("open_icap_lesson")
     *
     * @param OpenResourceEvent $event
     */
    public function onOpen(OpenResourceEvent $event)
    {
        /** @var Path $path */
        $lesson = $event->getResource();

        $content = $this->container->get('templating')->render(
            'IcapLessonBundle:lesson:open.html.twig', [
                '_resource' => $lesson,
                'lesson' => $this->serializer->serialize($lesson),
            ]
        );

        $event->setResponse(new Response($content));
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("copy_icap_lesson")
     *
     * @param CopyResourceEvent $event
     */
    public function onCopy(CopyResourceEvent $event)
    {
        $entityManager = $this->container->get('doctrine.orm.entity_manager');
        $lesson = $event->getResource();

        $newLesson = new Lesson();
        $newLesson->setName($lesson->getResourceNode()->getName());
        $entityManager->persist($newLesson);
        $entityManager->flush($newLesson);

        //$chapterRepository = $entityManager->getRepository('IcapLessonBundle:Chapter');
        $chapter_manager = $this->container->get('icap.lesson.manager.chapter');
        $chapter_manager->copyRoot($lesson->getRoot(), $newLesson->getRoot());

        $event->setCopy($newLesson);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("delete_icap_lesson")
     *
     * @param DeleteResourceEvent $event
     */
    public function onDelete(DeleteResourceEvent $event)
    {
        $om = $this->container->get('claroline.persistence.object_manager');
        $lesson = $event->getResource();
        $om->remove($lesson);
        $om->flush();
        $event->stopPropagation();
    }
}
