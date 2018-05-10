<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Listener\Resource\Types;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\Entity\Resource\ResourceShortcut;
use Claroline\CoreBundle\Event\Resource\CopyResourceEvent;
use Claroline\CoreBundle\Event\Resource\DeleteResourceEvent;
use Claroline\CoreBundle\Event\Resource\DownloadResourceEvent;
use Claroline\CoreBundle\Event\Resource\OpenResourceEvent;
use Claroline\CoreBundle\Event\Resource\LoadResourceEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Form\FormFactoryInterface;

/**
 * Integrates the "Shortcut" resource.
 *
 * @DI\Service
 *
 * @todo delete all shortcuts when a ResourceNode is deleted.
 */
class ShortcutListener
{
    /** @var ContainerInterface */
    private $container;

    /** @var FormFactoryInterface */
    private $formFactory;

    /** @var TwigEngine */
    private $templating;

    /** @var SerializerProvider */
    private $serializer;

    /**
     * ShortcutListener constructor.
     *
     * @DI\InjectParams({
     *     "container"       = @DI\Inject("service_container"),
     *     "formFactory"     = @DI\Inject("form.factory"),
     *     "templating"      = @DI\Inject("templating"),
     *     "eventDispatcher" = @DI\Inject("claroline.event.event_dispatcher"),
     *     "serializer"      = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param ContainerInterface   $container
     * @param FormFactoryInterface $formFactory
     * @param TwigEngine           $templating
     * @param StrictDispatcher     $eventDispatcher
     * @param SerializerProvider   $serializer
     */
    public function __construct(
        ContainerInterface $container,
        FormFactoryInterface $formFactory,
        TwigEngine $templating,
        StrictDispatcher $eventDispatcher,
        SerializerProvider $serializer
    ) {
        $this->container = $container;
        $this->formFactory = $formFactory;
        $this->templating = $templating;
        $this->eventDispatcher = $eventDispatcher;
        $this->serializer = $serializer;
    }

    /**
     * Loads a shortcut.
     * It forwards the event to the target of the shortcut.
     *
     * @DI\Observe("load_resource_shortcut")
     *
     * @param LoadResourceEvent $event
     */
    public function onLoad(LoadResourceEvent $event)
    {
        //
        $shortcut = $event->getResource();
        $event->setAdditionalData([
            //'directory' => $this->serializer->serialize(),
        ]);

        $event->stopPropagation();
    }

    /**
     * Opens a shortcut.
     * It forwards the event to the target of the shortcut.
     *
     * @DI\Observe("open_resource_shortcut")
     *
     * @param OpenResourceEvent $event
     */
    public function onOpen(OpenResourceEvent $event)
    {
        /*$directory = $event->getResource();
        $content = $this->templating->render(
            'ClarolineCoreBundle:Directory:index.html.twig',
            [
                'directory' => $directory,
                '_resource' => $directory,
            ]
        );
        $response = new Response($content);
        $event->setResponse($response);
        $event->stopPropagation();*/
    }

    /**
     * Downloads a shortcut.
     * It forwards the event to the target of the shortcut.
     *
     * @DI\Observe("download_resource_shortcut")
     *
     * @param DownloadResourceEvent $event
     */
    public function onDownload(DownloadResourceEvent $event)
    {

    }

    /**
     * Removes a shortcut.
     *
     * @DI\Observe("delete_resource_shortcut")
     *
     * @param deleteResourceEvent $event
     */
    public function onDelete(DeleteResourceEvent $event)
    {
        $event->stopPropagation();
    }

    /**
     * Copies a shortcut.
     *
     * @DI\Observe("copy_resource_shortcut")
     *
     * @param copyResourceEvent $event
     */
    public function onCopy(CopyResourceEvent $event)
    {
        /** @var ResourceShortcut $shortcut */
        $shortcut = $event->getResource();

        $copy = new ResourceShortcut();
        $copy->setTarget($shortcut->getTarget());

        $event->setCopy($copy);
    }
}
