<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\TextPlayerBundle\Listener\Resource;

use Claroline\CoreBundle\Event\PlayFileEvent;
use Claroline\ScormBundle\Event\ExportScormResourceEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Response;



/**
 * Listens to resource events dispatched by the core.
 *
 * @DI\Service("claro_text.listener.text_player")
 */
class TextPlayerListener
{
    private $container;

    /**
     * ExerciseListener constructor.
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
    }

    /**
     * Opens the text resource.
     *
     * @DI\Observe("play_file_text")
     *
     * @param PlayFileEvent $event
     */
    public function onOpen(PlayFileEvent $event)
    {
        $path = $this->container->getParameter('claroline.param.files_directory')
        .DIRECTORY_SEPARATOR
        .$event->getResource()->getHashName();
        $text = file_get_contents($path);
        $content = $this->container->get('templating')->render(
            'ClarolineTextPlayerBundle:Text:text.html.twig', [
                '_resource' => $event->getResource(),
                'text' => $text,
            ]
        );
        
        $event->setResponse(new Response($content));
        $event->stopPropagation();
    }

    /**
     * Exports text resource to SCORM.
     *
     * @DI\Observe("export_scorm_file_text")
     *
     * @param ExportScormResourceEvent $event
     */
    public function onExportScorm(ExportScormResourceEvent $event)
    {
        
        $resource = $event->getResource();

        $template = $this->container->get('templating')->render(
            'ClarolineTextPlayerBundle:Scorm:export.html.twig', [
                '_resource' => $resource,
            ]
        );

        // Set export template
        $event->setTemplate($template);

        // Add Text file
        $event->addFile('file_'.$resource->getResourceNode()->getId(), $resource->getHashName());

        $event->stopPropagation();
    }
}
