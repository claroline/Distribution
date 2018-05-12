<?php

namespace Claroline\CoreBundle\Manager\Resource;

use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Event\Resource\CopyResourceEvent;
use Claroline\CoreBundle\Event\Resource\DownloadResourceEvent;
use Claroline\CoreBundle\Event\Resource\PublicationChangeEvent;
use Claroline\CoreBundle\Event\Resource\ResourceEvaluationEvent;

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

    public function open(ResourceNode $resourceNode)
    {

    }

    public function copy(ResourceNode $copiedNode, ResourceNode $originalNode)
    {
        /** @var CopyResourceEvent $event */
        $event = $this->dispatcher->dispatch(
            static::eventName('copy', $copiedNode),
            CopyResourceEvent::class,
            [$this->getResourceFromNode($originalNode), $copiedNode]
        );

        return $event;
    }

    public function move()
    {

    }

    /**
     * @param ResourceNode $resourceNode
     *
     * @return DownloadResourceEvent
     */
    public function download(ResourceNode $resourceNode)
    {
        /** @var DownloadResourceEvent $event */
        $event = $this->dispatcher->dispatch(
            static::eventName('download', $resourceNode),
            DownloadResourceEvent::class,
            [$this->getResourceFromNode($resourceNode)]
        );

        return $event;
    }

    public function togglePublication(ResourceNode $resourceNode)
    {
        /** @var PublicationChangeEvent $event */
        $event = $this->dispatcher->dispatch(
            static::eventName('publication_change', $resourceNode),
            PublicationChangeEvent::class,
            [$this->getResourceFromNode($resourceNode)]
        );

        return $event;
    }

    public function evaluate($resourceUserEvaluation)
    {
        /** @var ResourceEvaluationEvent $event */
        $event = $this->dispatcher->dispatch(
            'resource_evaluation',
            ResourceEvaluationEvent::class,
            [$resourceUserEvaluation]
        );

        return $event;
    }

    /**
     * Generates the names for dispatched events.
     *
     * @param string       $prefix
     * @param ResourceNode $resourceNode
     *
     * @return string
     */
    private static function eventName($prefix, ResourceNode $resourceNode)
    {
        return $prefix.'_'.$resourceNode->getResourceType()->getName();
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
