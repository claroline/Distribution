<?php

namespace Claroline\CoreBundle\Manager\Resource;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\Library\Validation\Exception\InvalidDataException;
use Claroline\CoreBundle\Manager\ResourceManager;
use Claroline\CoreBundle\Persistence\ObjectManager;
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
     * @var ObjectManager
     */
    private $om;

    /**
     * @var ResourceNodeSerializer
     */
    private $serializer;

    /**
     * @var ResourceManager
     */
    private $resourceManager;

    /**
     * ResourceNodeManager constructor.
     *
     * @DI\InjectParams({
     *     "authorization"          = @DI\Inject("security.authorization_checker"),
     *     "om"                     = @DI\Inject("claroline.persistence.object_manager"),
     *     "eventDispatcher"        = @DI\Inject("claroline.event.event_dispatcher"),
     *     "resourceNodeSerializer" = @DI\Inject("claroline.serializer.resource_node"),
     *     "resourceManager"        = @DI\Inject("claroline.manager.resource_manager"),
     *     "resourceNodeSerializer" = @DI\Inject("claroline.serializer.resource_node")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param ObjectManager                 $om
     * @param StrictDispatcher              $eventDispatcher
     * @param ResourceNodeSerializer        $resourceNodeSerializer
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        StrictDispatcher $eventDispatcher,
        ObjectManager $om,
        ResourceNodeSerializer $resourceNodeSerializer,
        ResourceManager $resourceManager)
    {
        $this->authorization = $authorization;
        $this->eventDispatcher = $eventDispatcher;
        $this->om = $om;
        $this->serializer = $resourceNodeSerializer;
        $this->resourceManager = $resourceManager;
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

    /* Plus tard
    public function create()
    {
        $node = new ResourceNode();

        $node->setResourceType($resourceType);
        $node->setPublished($isPublished);

        $mimeType = ($resource->getMimeType() === null) ?
            'custom/'.$resourceType->getName() :
            $resource->getMimeType();

        $node->setMimeType($mimeType);
        $node->setName($resource->getName());
        $node->setCreator($creator);

        if (!$workspace && $parent) {
            if ($parent->getWorkspace()) {
                $workspace = $parent->getWorkspace();
            }
        }

        if ($workspace) {
            $node->setWorkspace($workspace);
        }

        $node->setParent($parent);
        $node->setName($this->getUniqueName($node, $parent));
        $node->setClass(get_class($resource));

        if ($parent) {
            $this->setLastIndex($parent, $node);
        }

        if (!is_null($parent)) {
            $node->setAccessibleFrom($parent->getAccessibleFrom());
            $node->setAccessibleUntil($parent->getAccessibleUntil());
        }

        $resource->setResourceNode($node);

        if ($createRights) {
            $this->setRights($node, $parent, $rights);
        }
        $this->om->persist($node);
        $this->om->persist($resource);

        if (empty($icon)) {
            $icon = $this->iconManager->getIcon($resource, $workspace);
        }

        $parentPath = '';

        if ($parent) {
            $parentPath .= $parent->getPathForDisplay().' / ';
        }

        $node->setPathForCreationLog($parentPath.$node->getName());
        $node->setIcon($icon);
    }*/

    /**
     * Updates a ResourceNode entity.
     *
     * @param array        $data
     * @param ResourceNode $resourceNode
     *
     * @return ResourceNode
     *
     * @throws InvalidDataException
     */
    public function update(array $data, ResourceNode $resourceNode)
    {
        $errors = $this->validate($data);

        if (count($errors) > 0) {
            throw new InvalidDataException('ResourceNode data are invalid.', $errors);
        }

        $this->resourceManager->setPublishedStatus([$resourceNode], $resourceNode->isPublished());
        $this->resourceManager->rename($resourceNode, $resourceNode->getName());

        $this->om->persist($resourceNode);
        $this->om->flush();

        return $resourceNode;
    }

    /**
     * Validates data sent by API.
     *
     * @param array $data
     *
     * @return array
     */
    public function validate(array $data)
    {
        //json-schema ? à discuter
        $errors = [];

        return $errors;
    }

    public function publish(ResourceNode $resourceNode)
    {
        if (!$resourceNode->isPublished()) {
            $this->resourceManager->setPublishedStatus([$resourceNode], true);
        }

        return $resourceNode;
    }

    public function unpublish(ResourceNode $resourceNode)
    {
        if ($resourceNode->isPublished()) {
            $this->resourceManager->setPublishedStatus([$resourceNode], false);
        }

        return $resourceNode;
    }

    public function delete(ResourceNode $resourceNode)
    {
        $this->resourceManager->delete($resourceNode);
    }
}
