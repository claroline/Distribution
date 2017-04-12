<?php

namespace Claroline\CoreBundle\Manager\Resource;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Event\Resource\DecorateResourceNodeEvent;
use Claroline\CoreBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\Library\Security\Collection\ResourceCollection;
use Claroline\CoreBundle\Serializer\Resource\ResourceNodeSerializer;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @DI\Service("claroline.manager.resource_node")
 */
class ResourceNodeManager
{
    /**
     * @var AuthorizationCheckerInterface
     */
    private $authorization;

    /**
     * @var StrictDispatcher
     */
    private $eventDispatcher;

    /**
     * @var ResourceNodeSerializer
     */
    private $serializer;

    /**
     * ResourceNodeManager constructor.
     *
     * @DI\InjectParams({
     *     "authorization"          = @DI\Inject("security.authorization_checker"),
     *     "eventDispatcher"        = @DI\Inject("claroline.event.event_dispatcher"),
     *     "resourceNodeSerializer" = @DI\Inject("claroline.serializer.resource_node")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param StrictDispatcher              $eventDispatcher
     * @param ResourceNodeSerializer        $resourceNodeSerializer
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        StrictDispatcher $eventDispatcher,
        ResourceNodeSerializer $resourceNodeSerializer)
    {
        $this->authorization = $authorization;
        $this->eventDispatcher = $eventDispatcher;
        $this->serializer = $resourceNodeSerializer;
    }

    /**
     * Serializes a ResourceNode entity for the JSON api.
     *
     * @param ResourceNode $resourceNode - the node to serialize
     *
     * @return array - the serialized representation of the node
     */
    public function serialize(ResourceNode $resourceNode)
    {
        return $this->serializer->serialize($resourceNode);
    }

    /**
     * Creates a new ResourceNode
     *
     * @return ResourceNode
     */
    public function create()
    {

    }
}
