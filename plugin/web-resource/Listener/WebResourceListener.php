<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\WebResourceBundle\Listener;

use Claroline\CoreBundle\Entity\Resource\File;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Event\Resource\CopyResourceEvent;
use Claroline\CoreBundle\Event\CreateFormResourceEvent;
use Claroline\CoreBundle\Event\CreateResourceEvent;
use Claroline\CoreBundle\Event\Resource\DeleteResourceEvent;
use Claroline\CoreBundle\Event\Resource\DownloadResourceEvent;
use Claroline\CoreBundle\Event\Resource\OpenResourceEvent;
use Claroline\CoreBundle\Form\FileType;
use Claroline\ScormBundle\Event\ExportScormResourceEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Finder\Iterator\RecursiveDirectoryIterator;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Response;

/**
 * @DI\Service("claroline.listener.web_resource_listener")
 */
class WebResourceListener
{
    /**
     * Service container.
     *
     * @var \Symfony\Component\DependencyInjection\ContainerInterface
     */
    private $container;


    /**
     * Class constructor.
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
        $this->filesPath = $this->container->getParameter('claroline.param.files_directory').DIRECTORY_SEPARATOR;
        $this->tokenStorage = $this->container->get('security.token_storage');
        $this->workspaceManager = $this->container->get('claroline.manager.workspace_manager');
    }

    /**
     * @DI\Observe("create_claroline_web_resource")
     *
     * @param CreateResourceEvent $event
     */
    public function onCreate(CreateResourceEvent $event)
    {
        $request = $this->container->get('request_stack')->getMasterRequest();
        $workspace = $event->getParent()->getWorkspace();
        $form = $this->container->get('form.factory')->create(new FileType(), new File());
        $form->handleRequest($request);

        if ($form->isValid()) {
            if (!$this->isZip($form->get('file')->getData())) {
                $error = $this->container->get('translator')->trans('not_a_zip', [], 'resource');
                $form->addError(new FormError($error));
            } else {
                $event->setResources([$this->create($form->get('file')->getData(), $workspace)]);
                $event->stopPropagation();

                return;
            }
        }

        $content = $this->container->get('templating')->render(
            'ClarolineCoreBundle:resource:create_form.html.twig',
            [
                'form' => $form->createView(),
                'resourceType' => $event->getResourceType(),
            ]
        );
        $event->setErrorFormContent($content);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("open_claroline_web_resource")
     *
     * @param \Claroline\CoreBundle\Event\CreateResourceEvent|\Claroline\CoreBundle\Event\Resource\OpenResourceEvent $event
     */
    public function onOpenWebResource(OpenResourceEvent $event)
    {
        $hash = $event->getResource()->getHashName();

        $content = $this->container->get('templating')->render(
            'ClarolineWebResourceBundle:web-resource:open.html.twig',
            [
                'workspace' => $event->getResource()->getResourceNode()->getWorkspace(),
                'path' => $hash.'/'.$this->guessRootFileFromUnzipped($this->zipPath.$hash),
                '_resource' => $event->getResource(),
            ]
        );

        $event->setResponse(new Response($content));
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("export_scorm_claroline_web_resource")
     *
     * @param ExportScormResourceEvent $event
     */
    public function onExportScorm(ExportScormResourceEvent $event)
    {
        $resource = $event->getResource();
        $hash = $resource->getHashName();
        $filename = 'file_'.$resource->getResourceNode()->getId();

        $template = $this->container->get('templating')->render(
            'ClarolineWebResourceBundle:Scorm:export.html.twig',
            [
                'path' => $filename.'/'.$this->guessRootFileFromUnzipped($this->zipPath.$hash),
                '_resource' => $event->getResource(),
            ]
        );

        // Set export template
        $event->setTemplate($template);

        $event->addFile($filename, $this->zipPath.$hash, true);

        $event->stopPropagation();
    }

    /**
     * @DI\Observe("delete_claroline_web_resource")
     *
     * @param DeleteResourceEvent $event
     */
    public function onDelete(DeleteResourceEvent $event)
    {
        $file = $this->filesPath.$event->getResource()->getHashName();
        $unzipFile = $this->zipPath.$event->getResource()->getHashName();

        if (file_exists($file)) {
            $event->setFiles([$file]);
        }

        if (file_exists($unzipFile)) {
            $this->unzipDelete($unzipFile);
        }

        $event->stopPropagation();
    }

    /**
     * @DI\Observe("copy_claroline_web_resource")
     *
     * @param CopyResourceEvent $event
     */
    public function onCopy(CopyResourceEvent $event)
    {
        $file = $this->copy($event->getResource());
        $event->setCopy($file);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("download_claroline_web_resource")
     *
     * @param DownloadResourceEvent $event
     */
    public function onDownload(DownloadResourceEvent $event)
    {
        $event->setItem($this->filesPath.$event->getResource()->getHashName());
        $event->stopPropagation();
    }


    /**
     * Returns a new hash for a file.
     *
     * @param mixed mixed The extension of the file or an Claroline\CoreBundle\Entity\Resource\File
     *
     * @return string
     */
    private function getHash($mixed)
    {
        if ($mixed instanceof File) {
            $mixed = pathinfo($mixed->getHashName(), PATHINFO_EXTENSION);
        }

        return $this->container->get('claroline.utilities.misc')->generateGuid().'.'.$mixed;
    }



    public function create(UploadedFile $tmpFile, Workspace $workspace = null)
    {
        $file = new File();
        $fileName = $tmpFile->getClientOriginalName();
        $hash = $this->getHash(pathinfo($fileName, PATHINFO_EXTENSION));
        $file->setSize(filesize($tmpFile));
        $file->setName($fileName);
        $file->setHashName($hash);
        $file->setMimeType('custom/claroline_web_resource');
        $tmpFile->move($this->filesPath, $hash);
        $this->unzip($hash);

        return $file;
    }



    /**
     * Copies a file (no persistence).
     *
     * @param File $resource
     *
     * @return File
     */
    private function copy(File $resource)
    {
        $hash = $this->getHash($resource);

        $file = new File();
        $file->setSize($resource->getSize());
        $file->setName($resource->getName());
        $file->setMimeType($resource->getMimeType());
        $file->setHashName($hash);
        copy($this->filesPath.$resource->getHashName(), $this->filesPath.$hash);
        $this->getZip()->open($this->filesPath.$hash);
        $this->unzip($hash);

        return $file;
    }


}
