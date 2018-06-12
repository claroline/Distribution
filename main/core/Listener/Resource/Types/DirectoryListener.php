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
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Event\CreateResourceEvent;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\Resource\Directory;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Event\Resource\CopyResourceEvent;
use Claroline\CoreBundle\Event\Resource\DeleteResourceEvent;
use Claroline\CoreBundle\Event\Resource\LoadResourceEvent;
use Claroline\CoreBundle\Event\Resource\OpenResourceEvent;
use Claroline\CoreBundle\Event\Resource\ResourceActionEvent;
use Claroline\CoreBundle\Manager\Resource\RightsManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Component\HttpFoundation\Response;

/**
 * Integrates the "Directory" resource.
 *
 * @DI\Service
 */
class DirectoryListener
{
    /** @var TwigEngine */
    private $templating;

    /** @var SerializerProvider */
    private $serializer;

    /** @var RightsManager */
    private $rightsManager;

    /**
     * DirectoryListener constructor.
     *
     * @DI\InjectParams({
     *     "templating"    = @DI\Inject("templating"),
     *     "om"            = @DI\Inject("claroline.persistence.object_manager"),
     *     "serializer"    = @DI\Inject("claroline.api.serializer"),
     *     "rightsManager" = @DI\Inject("claroline.manager.rights_manager")
     * })
     *
     * @param TwigEngine         $templating
     * @param ObjectManager      $om
     * @param SerializerProvider $serializer
     * @param RightsManager      $rightsManager
     */
    public function __construct(
        TwigEngine $templating,
        ObjectManager $om,
        SerializerProvider $serializer,
        RightsManager $rightsManager
    ) {
        $this->templating = $templating;
        $this->om = $om;
        $this->serializer = $serializer;
        $this->rightsManager = $rightsManager;
    }

    /**
     * Creates a new resource inside a directory.
     *
     * @DI\Observe("resource.directory.add")
     *
     * @param ResourceActionEvent $event
     */
    public function onAdd(ResourceActionEvent $event)
    {
        $parent = $event->getResourceNode();
        $data = $event->getData();
        $options = $event->getOptions();

        // create the resource node
        $resourceNode = $this->serializer->deserialize(ResourceNode::class, $data['node'], $options);
        $resourceNode->setParent($parent);
        $resourceNode->setWorkspace($parent->getWorkspace());

        // initialize custom resource Entity
        $resourceClass = $resourceNode->getResourceType()->getClass();

        /** @var AbstractResource $resource */
        $resource = new $resourceClass();
        if (!empty($data['resource'])) {
            $resource = $this->serializer->deserialize($resourceClass, $data['resource'], $options);
        }

        $resource->setResourceNode($resourceNode);

        if (!empty($data['rights'])) {
            foreach ($data['rights'] as $rights) {
                /** @var Role $role */
                $role = $this->om->getRepository('ClarolineCoreBundle:Role')->findOneBy(['name' => $rights['name']]);
                $this->rightsManager->editPerms($rights['permissions'], $role, $resourceNode);
            }
        }
    }

    /**
     * @DI\Observe("resource.directory.create")
     *
     * @param CreateResourceEvent $event
     */
    public function onCreate(CreateResourceEvent $event)
    {
        $event->stopPropagation();
    }

    /**
     * Loads a directory.
     *
     * @DI\Observe("load_directory")
     *
     * @param LoadResourceEvent $event
     */
    public function onLoad(LoadResourceEvent $event)
    {
        $event->setAdditionalData([
            'directory' => $this->serializer->serialize($event->getResource()),
        ]);

        $event->stopPropagation();
    }

    /**
     * Opens a directory.
     *
     * @DI\Observe("open_directory")
     *
     * @param OpenResourceEvent $event
     */
    public function onOpen(OpenResourceEvent $event)
    {
        $directory = $event->getResource();

        $content = $this->templating->render(
            'ClarolineCoreBundle:Directory:index.html.twig', [
                'directory' => $directory,
                '_resource' => $directory,
            ]
        );

        $response = new Response($content);
        $event->setResponse($response);

        $event->stopPropagation();
    }

    /**
     * Removes a directory.
     *
     * @DI\Observe("delete_directory")
     *
     * @param deleteResourceEvent $event
     */
    public function onDelete(DeleteResourceEvent $event)
    {
        $event->stopPropagation();
    }

    /**
     * Copies a directory.
     *
     * @DI\Observe("copy_directory")
     *
     * @param copyResourceEvent $event
     */
    public function onCopy(CopyResourceEvent $event)
    {
        $resourceCopy = new Directory();
        $event->setCopy($resourceCopy);
    }
}
