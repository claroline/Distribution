<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\PdfPlayerBundle\Listener;

use Claroline\CoreBundle\Event\Resource\File\PlayFileEvent;
use Claroline\ScormBundle\Event\ExportScormResourceEvent;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;
use Symfony\Component\HttpFoundation\Response;

class PdfPlayerListener
{
    use ContainerAwareTrait;

    public function onOpenPdf(PlayFileEvent $event)
    {
        $path = $this->container->getParameter('claroline.param.files_directory')
            .DIRECTORY_SEPARATOR
            .$event->getResource()->getHashName();
        $content = $this->container->get('templating')->render(
            'ClarolinePdfPlayerBundle::open.html.twig',
            [
                'path' => $path,
                'pdf' => $event->getResource(),
                'workspace' => $event->getResource()->getResourceNode()->getWorkspace(),
                '_resource' => $event->getResource(),
            ]
        );
        $response = new Response($content);
        $event->setResponse($response);
        $event->stopPropagation();
    }

    public function onExportScorm(ExportScormResourceEvent $event)
    {
        $resource = $event->getResource();

        $template = $this->container->get('templating')->render(
            'ClarolinePdfPlayerBundle:Scorm:export.html.twig', [
                '_resource' => $resource,
            ]
        );

        // Set export template
        $event->setTemplate($template);

        // Add PDF file
        $event->addFile('file_'.$resource->getResourceNode()->getId(), $resource->getHashName());

        // Add assets
        $webpack = $this->container->get('claroline.extension.webpack');
        $event->addAsset('claroline-distribution-plugin-pdf-player-pdf-viewer.js', $webpack->hotAsset('dist/claroline-distribution-plugin-pdf-player-pdf-viewer.js', true));

        // Add translations
        $event->addTranslationDomain('widget');

        $event->stopPropagation();
    }
}
