<?php

namespace Claroline\CoreBundle\Serializer\Resource;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Event\Resource\DecorateResourceNodeEvent;
use Claroline\CoreBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\Manager\BreadcrumbManager;
use Claroline\CoreBundle\Manager\MaskManager;
use Claroline\CoreBundle\Manager\Resource\ResourceMenuManager;
use Claroline\CoreBundle\Manager\RightsManager;
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
     *     "authorization"     = @DI\Inject("security.authorization_checker"),
     *     "eventDispatcher"   = @DI\Inject("claroline.event.event_dispatcher"),
     *     "maskManager"       = @DI\Inject("claroline.manager.mask_manager"),
     *     "rightsManager"     = @DI\Inject("claroline.manager.rights_manager"),
     *     "breadcrumbManager" = @DI\Inject("claroline.manager.breadcrumb_manager"),
     *     "menuManager"       = @DI\Inject("claroline.manager.resource_menu_manager")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param StrictDispatcher              $eventDispatcher
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        StrictDispatcher $eventDispatcher,
        MaskManager $maskManager,
        BreadcrumbManager $breadcrumbManager,
        ResourceMenuManager $menuManager,
        RightsManager $rightsManager
    ) {
        $this->authorization = $authorization;
        $this->eventDispatcher = $eventDispatcher;
        $this->maskManager = $maskManager;
        $this->breadcrumbManager = $breadcrumbManager;
        $this->rightsManager = $rightsManager;
        $this->menuManager = $menuManager;
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
            'workspace' => $resourceNode->getWorkspace() ? [
                'id' => $resourceNode->getWorkspace()->getGuid(),
                'name' => $resourceNode->getWorkspace()->getName(),
                'code' => $resourceNode->getWorkspace()->getCode(),
            ] : [],
            'meta' => $this->getMeta($resourceNode),
            'shortcuts' => $this->getShortcuts($resourceNode),
            'breadcrumb' => $this->breadcrumbManager->getBreadcrumb($resourceNode),
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
                array_keys($serializedNode),
            ]
        );

        return array_merge(
            $serializedNode,
            $event->getInjectedData()
        );
    }

    private function getMeta(ResourceNode $resourceNode)
    {
        return [
            'type' => $resourceNode->getResourceType()->getName(),
            'mimeType' => $resourceNode->getMimeType(),
            'path' => $this->breadcrumbManager->getBreadcrumb($resourceNode),
            'description' => null, // todo : add as ResourceNode prop and migrate custom descriptions (Path, Quiz, etc.)
            'created' => $resourceNode->getCreationDate()->format('Y-m-d\TH:i:s'),
            'updated' => $resourceNode->getModificationDate()->format('Y-m-d\TH:i:s'),
            'license' => $resourceNode->getLicense(),
            'authors' => $resourceNode->getAuthor(),
            'published' => $resourceNode->isPublished(),
            'portal' => $resourceNode->isPublishedToPortal(),
            'creator' => [
                'id' => $resourceNode->getCreator()->getGuid(),
                'name' => $resourceNode->getCreator()->getFullName(),
                'username' => $resourceNode->getCreator()->getUsername(),
            ],
            'parameters' => $this->getParameters($resourceNode),
            'actions' => $this->getActions($resourceNode),
            'rights' => [
                'all' => $this->getRights($resourceNode),
                'current' => $this->getCurrentPermissions($resourceNode),
            ],
        ];
    }

    private function getCurrentPermissions($resourceNode)
    {
        return $this->rightsManager->getCurrentPermissionArray($resourceNode);
    }

    private function getParameters(ResourceNode $resourceNode)
    {
        return [
            'accessibleFrom' => null,
            'accessibleUntil' => null,
            'fullscreen' => $resourceNode->isFullscreen(), // todo : migrate custom data (Scorm)
            'closable' => $resourceNode->isClosable(),

            // todo : add field and migrate custom data (Scorm)
            // values : 0 => ws / 1 => desktop. default = 0
            'closeTarget' => $resourceNode->getCloseTarget(),
        ];
    }

    private function getActions(ResourceNode $resourceNode)
    {
        //ResourceManager::isResourceActionImplemented(ResourceType $resourceType = null, $actionName)
        $actions = $this->menuManager->getMenus($resourceNode);
        $data = [];

        foreach ($actions as $action) {
            $data[$action->getName()] = [
            'name' => $action->getName(),
            'mask' => $action->getValue(),
            'group' => $action->getGroup(),
            'async' => $action->isAsync(),
            'custom' => $action->isCustom(),
            'form' => $action->isForm(),
            'class' => $action->getClass(),
          ];
        }

        return $data;
    }

    private function getRights(ResourceNode $resourceNode)
    {
        $decoders = $resourceNode->getResourceType()->getMaskDecoders()->toArray();
        $serializedDecoders = array_map(function ($decoder) {
            return [
            'name' => $decoder->getName(),
            'value' => $decoder->getValue(),
          ];
        }, $decoders);

        $rights = $resourceNode->getRights()->toArray();
        $serializedRights = [];

        foreach ($rights as $right) {
            $serializedRights[] = [
            'role' => [
              'id' => $right->getRole()->getId(),
              'name' => $right->getRole()->getName(),
              'key' => $right->getRole()->getTranslationKey(),
            ],
            'mask' => $right->getMask(),
            'id' => $right->getId(),
            'permissions' => array_merge(
              $this->maskManager->decodeMask($right->getMask(), $resourceNode->getResourceType()),
              ['create' => $this->rightsManager->getCreatableTypes([$right->getRole()->getName()], $resourceNode)]),

          ];
        }

        return ['decoders' => $serializedDecoders, 'permissions' => $serializedRights];
    }

    private function getShortcuts(ResourceNode $resourceNode)
    {
        $shortcuts = $resourceNode->getShortcuts()->toArray();

        return array_map(function ($shortcut) {
            $node = $this->getResourceFromNode($shortcut);

            return [
              'name' => $node->getName(),
              'workspace' => [
                'id' => $node->getWorkspace()->getId(),
                'name' => $node->getWorkspace()->getName(),
                'code' => $node->getWorkspace()->getCode(),
              ],
            ];
        }, $shortcuts);
    }
}
