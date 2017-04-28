<?php

namespace Claroline\CoreBundle\Serializer\Resource;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Event\Resource\DecorateResourceNodeEvent;
use Claroline\CoreBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\Library\Security\Collection\ResourceCollection;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @DI\Service("claroline.serializer.resource_node")
 */
class ResourceNodeSerializer
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
     * ResourceNodeManager constructor.
     *
     * @DI\InjectParams({
     *     "authorization"   = @DI\Inject("security.authorization_checker"),
     *     "eventDispatcher" = @DI\Inject("claroline.event.event_dispatcher")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param StrictDispatcher              $eventDispatcher
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        StrictDispatcher $eventDispatcher)
    {
        $this->authorization = $authorization;
        $this->eventDispatcher = $eventDispatcher;
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
        $serializedNode = [
            'id' => $resourceNode->getGuid(),
            'name' => $resourceNode->getName(),
            'poster' => null, // todo : add as ResourceNode prop
            'thumbnail' => null,
            'workspace' => [
                'id' => $resourceNode->getWorkspace()->getGuid(),
                'name' => $resourceNode->getWorkspace()->getName(),
                'code' => $resourceNode->getWorkspace()->getCode(),
            ],
            'meta' => $this->getMeta($resourceNode),
            'parameters' => $this->getParameters($resourceNode),
            'rights' => $this->getRights($resourceNode),
            'shortcuts' => $this->getShortcuts($resourceNode),
            'actions' => $this->getActions($resourceNode),
        ];

        return $this->decorate($resourceNode, $serializedNode);
    }

    /**
     * Dispatches an event to let plugins add some custom data to the serialized node.
     * For example, SocialMedia adds the number of likes.
     *
     * @param ResourceNode $resourceNode   - the original node entity
     * @param array        $serializedNode - the serialized version of the node
     *
     * @return array - the decorated node
     */
    private function decorate(ResourceNode $resourceNode, array $serializedNode)
    {
        /** @var DecorateResourceNodeEvent $event */
        $event = $this->eventDispatcher->dispatch(
            'serialize_resource_node',
            'Resource\DecorateResourceNode', [
                $resourceNode,
                array_keys($serializedNode)
            ]
        );

        return array_merge(
            $serializedNode,
            $event->getInjectedData()
        );
    }

    private function getMeta(ResourceNode $resourceNode)
    {
        $collection = new ResourceCollection([$resourceNode]);

        return [
            'type'        => $resourceNode->getResourceType()->getName(),
            'mimeType'    => $resourceNode->getMimeType(),
            'path'        => $this->getPath($resourceNode),
            'description' => null, // todo : add as ResourceNode prop and migrate custom descriptions (Path, Quiz, etc.)
            'created'     => $resourceNode->getCreationDate()->format('Y-m-d\TH:i:s'),
            'updated'     => $resourceNode->getModificationDate()->format('Y-m-d\TH:i:s'),
            'license'     => $resourceNode->getLicense(),
            'authors'     => $resourceNode->getAuthor(),
            'published'   => $resourceNode->isPublished(),
            'portal'      => $resourceNode->isPublishedToPortal(),
            'creator' => [
                'id'       => $resourceNode->getCreator()->getGuid(),
                'name'     => $resourceNode->getCreator()->getFullName(),
                'username' => $resourceNode->getCreator()->getUsername(),
            ],

            // it can be deduced from the presence (or not) of the action
            'exportable' => $this->authorization->isGranted('EXPORT', $collection) && $resourceNode->getResourceType()->isExportable(),
            'editable'   => $this->authorization->isGranted('ADMINISTRATE', $collection),
            'deletable'  => $this->authorization->isGranted('DELETE', $collection),
        ];
    }

    private function getPath(ResourceNode $resourceNode)
    {
        return [

        ];
    }

    private function getParameters(ResourceNode $resourceNode)
    {
        return [
            'accessibleFrom' => null,
            'accessibleUntil' => null,
            'fullscreen' => false, // todo : add field and migrate custom data (Scorm)
            'closable' => false, // todo : add field

            // todo : add field and migrate custom data (Scorm)
            // values : 0 => ws / 1 => desktop. default = 0
            'closeTarget' => 0,
        ];
    }

    private function getActions(ResourceNode $resourceNode)
    {
        //ResourceManager::isResourceActionImplemented(ResourceType $resourceType = null, $actionName)
        return [
            'resourceType' => [

            ],
            'management' => [

            ],
            // actions that come from plugins
        ];
    }

    private function getRights(ResourceNode $resourceNode)
    {
        return [

        ];
    }

    private function getShortcuts(ResourceNode $resourceNode)
    {
        return [

        ];
    }
}
