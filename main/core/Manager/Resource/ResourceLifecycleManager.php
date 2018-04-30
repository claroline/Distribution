<?php

namespace Claroline\CoreBundle\Manager\Resource;

use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Event\CopyResourceEvent;
use Claroline\CoreBundle\Event\DownloadResourceEvent;
use Claroline\CoreBundle\Event\PublicationChangeEvent;

/**
 * Centralizes events dispatched for resources integration.
 */
class ResourceLifecycleManager
{
    /** @var StrictDispatcher */
    private $dispatcher;

    /** @var ObjectManager */
    private $om;

    /**
     * ResourceLifecycleManager constructor.
     *
     * @DI\InjectParams({
     *     "eventDispatcher" = @DI\Inject("claroline.event.event_dispatcher"),
     *     "om"              = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param StrictDispatcher $eventDispatcher
     * @param ObjectManager    $om
     */
    public function __construct(
        StrictDispatcher $eventDispatcher,
        ObjectManager $om)
    {
        $this->dispatcher = $eventDispatcher;
        $this->om = $om;
    }

    public function onOpen(ResourceNode $resourceNode)
    {

    }

    public function onCopy(ResourceNode $copiedNode, ResourceNode $originalNode)
    {
        /** @var CopyResourceEvent $event */
        $event = $this->dispatcher->dispatch(
            'copy_'.$copiedNode->getResourceType()->getName(),
            'CopyResource',
            [$this->getResourceFromNode($originalNode), $copiedNode]
        );

        return $event;
    }

    /**
     * @param ResourceNode $resourceNode
     *
     * @return DownloadResourceEvent
     */
    public function onDownload(ResourceNode $resourceNode)
    {
        /** @var DownloadResourceEvent $event */
        $event = $this->dispatcher->dispatch(
            'download_'.$resourceNode->getResourceType()->getName(),
            'DownloadResource',
            [$this->getResourceFromNode($resourceNode)]
        );

        return $event;
    }

    public function onTogglePublication(ResourceNode $resourceNode)
    {
        /** @var PublicationChangeEvent $event */
        $event = $this->dispatcher->dispatch(
            'publication_change_'.$resourceNode->getResourceType()->getName(),
            'PublicationChange',
            [$this->getResourceFromNode($resourceNode)]
        );

        return $event;
    }

    /**
     * Returns the resource linked to a node.
     *
     * @param ResourceNode $resourceNode
     *
     * @return AbstractResource
     */
    private function getResourceFromNode(ResourceNode $resourceNode)
    {
        /** @var AbstractResource $resource */
        $resource = $this->om->getRepository($resourceNode->getClass())->findOneBy(['resourceNode' => $resourceNode]);

        return $resource;
    }
}
