<?php

namespace Claroline\CoreBundle\API\Serializer\Resource;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\File\PublicFileSerializer;
use Claroline\CoreBundle\API\Serializer\User\UserSerializer;
use Claroline\CoreBundle\Entity\File\PublicFile;
use Claroline\CoreBundle\Entity\Resource\MenuAction;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Event\Resource\DecorateResourceNodeEvent;
use Claroline\CoreBundle\Library\Normalizer\DateRangeNormalizer;
use Claroline\CoreBundle\Manager\Resource\MaskManager;
use Claroline\CoreBundle\Manager\Resource\ResourceActionManager;
use Claroline\CoreBundle\Manager\Resource\RightsManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.resource_node")
 * @DI\Tag("claroline.serializer")
 */
class ResourceNodeSerializer
{
    use SerializerTrait;

    /** @var ObjectManager */
    private $om;

    /** @var StrictDispatcher */
    private $eventDispatcher;

    /** @var PublicFileSerializer */
    private $fileSerializer;

    /** @var UserSerializer */
    private $userSerializer;

    /** @var MaskManager */
    private $maskManager;

    /** @var ResourceActionManager */
    private $actionManager;

    /** @var RightsManager */
    private $rightsManager;

    /**
     * ResourceNodeManager constructor.
     *
     * @DI\InjectParams({
     *     "om"                = @DI\Inject("claroline.persistence.object_manager"),
     *     "eventDispatcher"   = @DI\Inject("claroline.event.event_dispatcher"),
     *     "fileSerializer"    = @DI\Inject("claroline.serializer.public_file"),
     *     "userSerializer"    = @DI\Inject("claroline.serializer.user"),
     *     "maskManager"       = @DI\Inject("claroline.manager.mask_manager"),
     *     "actionManager"     = @DI\Inject("claroline.manager.resource_action"),
     *     "rightsManager"     = @DI\Inject("claroline.manager.rights_manager")
     * })
     *
     * @param ObjectManager         $om
     * @param StrictDispatcher      $eventDispatcher
     * @param PublicFileSerializer  $fileSerializer
     * @param UserSerializer        $userSerializer
     * @param MaskManager           $maskManager
     * @param ResourceActionManager $actionManager
     * @param RightsManager         $rightsManager
     */
    public function __construct(
        ObjectManager $om,
        StrictDispatcher $eventDispatcher,
        PublicFileSerializer $fileSerializer,
        UserSerializer $userSerializer,
        MaskManager $maskManager,
        ResourceActionManager $actionManager,
        RightsManager $rightsManager
    ) {
        $this->om = $om;
        $this->eventDispatcher = $eventDispatcher;
        $this->fileSerializer = $fileSerializer;
        $this->userSerializer = $userSerializer;
        $this->maskManager = $maskManager;
        $this->rightsManager = $rightsManager;
        $this->actionManager = $actionManager;
    }

    /**
     * Serializes a ResourceNode entity for the JSON api.
     *
     * @param ResourceNode $resourceNode - the node to serialize
     * @param array        $options
     *
     * @return array - the serialized representation of the node
     */
    public function serialize(ResourceNode $resourceNode, array $options = [])
    {
        $serializedNode = [
            'id' => $resourceNode->getUuid(),
            'autoId' => $resourceNode->getId(), // TODO : remove me
            'actualId' => $resourceNode->getId(), // TODO : remove me
            'name' => $resourceNode->getName(),
            'thumbnail' => $resourceNode->getThumbnail() ? $resourceNode->getThumbnail()->getRelativeUrl() : null,
            'actions' => array_map(function (MenuAction $resourceAction) {
                return [
                    'name' => $resourceAction->getName(),
                    'group' => $resourceAction->getGroup(),
                    'bulk' => $resourceAction->isBulk(),
                ];
            }, $this->actionManager->all($resourceNode)),
            'permissions' => $this->getCurrentPermissions($resourceNode),
        ];

        if (!in_array(Options::SERIALIZE_MINIMAL, $options)) {
            if (!empty($resourceNode->getWorkspace())) { // TODO : check if this is really required
                $serializedNode['workspace'] = [
                    'id' => $resourceNode->getWorkspace()->getUuid(),
                    'name' => $resourceNode->getWorkspace()->getName(),
                    'code' => $resourceNode->getWorkspace()->getCode(),
                ];
            }

            $serializedNode = array_merge($serializedNode, [
                'poster' => $this->serializePoster($resourceNode),
                'meta' => $this->serializeMeta($resourceNode),
                'display' => $this->serializeDisplay($resourceNode),
                'restrictions' => $this->getRestrictions($resourceNode),
                'rights' => $this->getRights($resourceNode),
            ]);
        }

        return $this->decorate($resourceNode, $serializedNode, $options);
    }

    /**
     * Dispatches an event to let plugins add some custom data to the serialized node.
     * For example, SocialMedia adds the number of likes.
     *
     * @param ResourceNode $resourceNode   - the original node entity
     * @param array        $serializedNode - the serialized version of the node
     * @param array        $options
     *
     * @return array - the decorated node
     */
    private function decorate(ResourceNode $resourceNode, array $serializedNode, array $options = [])
    {
        $unauthorizedKeys = array_keys($serializedNode);

        // 'poster' is a key that can be overridden by another plugin. For example: UrlBundle
        if (false !== ($key = array_search('thumbnail', $unauthorizedKeys))) {
            unset($unauthorizedKeys[$key]);
        }

        /** @var DecorateResourceNodeEvent $event */
        $event = $this->eventDispatcher->dispatch(
            'serialize_resource_node',
            'Resource\DecorateResourceNode',
            [
                $resourceNode,
                $unauthorizedKeys,
                $options,
            ]
        );

        return array_merge(
            $serializedNode,
            $event->getInjectedData()
        );
    }

    /**
     * Serialize the resource poster.
     *
     * @param ResourceNode $resourceNode
     *
     * @return array|null
     */
    private function serializePoster(ResourceNode $resourceNode)
    {
        if (!empty($resourceNode->getPoster())) {
            /** @var PublicFile $file */
            $file = $this->om
                ->getRepository('Claroline\CoreBundle\Entity\File\PublicFile')
                ->findOneBy(['url' => $resourceNode->getPoster()]);

            if ($file) {
                return $this->fileSerializer->serialize($file);
            }
        }

        return null;
    }

    private function serializeMeta(ResourceNode $resourceNode)
    {
        return [
            'type' => $resourceNode->getResourceType()->getName(), // todo : must be available in MINIMAL mode
            'mimeType' => $resourceNode->getMimeType(), // todo : maybe too
            'description' => $resourceNode->getDescription(),
            'created' => $resourceNode->getCreationDate()->format('Y-m-d\TH:i:s'),
            'updated' => $resourceNode->getModificationDate()->format('Y-m-d\TH:i:s'),
            'license' => $resourceNode->getLicense(),
            'authors' => $resourceNode->getAuthor(),
            'published' => $resourceNode->isPublished(),
            'portal' => $resourceNode->isPublishedToPortal(),
            'isManager' => $this->rightsManager->isManager($resourceNode), // todo : data about current user should not be here (should be in `rights` section)
            'creator' => $resourceNode->getCreator() ? $this->userSerializer->serialize($resourceNode->getCreator()) : null,
            'views' => $resourceNode->getViewsCount(),
            'icon' => $resourceNode->getIcon() ? '/'.$resourceNode->getIcon()->getRelativeUrl() : null, // todo : remove me
        ];
    }

    private function getCurrentPermissions($resourceNode)
    {
        return $this->rightsManager->getCurrentPermissionArray($resourceNode);
    }

    private function serializeDisplay(ResourceNode $resourceNode)
    {
        return [
            'fullscreen' => $resourceNode->isFullscreen(),
            'showIcon' => $resourceNode->getShowIcon(),
            'closable' => $resourceNode->isClosable(),
            'closeTarget' => $resourceNode->getCloseTarget(),
        ];
    }

    private function getRestrictions(ResourceNode $resourceNode)
    {
        return [
            'hidden' => $resourceNode->isHidden(),
            'dates' => DateRangeNormalizer::normalize(
                $resourceNode->getAccessibleFrom(),
                $resourceNode->getAccessibleUntil()
            ),
            'code' => $resourceNode->getAccessCode(),
            'allowedIps' => $resourceNode->getAllowedIps(),
        ];
    }

    private function getRights(ResourceNode $resourceNode)
    {
        $serializedRights = [];
        $rights = $resourceNode->getRights();
        foreach ($rights as $right) {
            $role = $right->getRole();
            $serializedRights[$right->getRole()->getName()] = [
                'name' => $role->getName(),
                'translationKey' => $role->getTranslationKey(),
                'permissions' => array_merge(
                    $this->maskManager->decodeMask($right->getMask(), $resourceNode->getResourceType()),
                    ['create' => $this->rightsManager->getCreatableTypes([$role->getName()], $resourceNode)]
                ),
            ];
        }

        return $serializedRights;
    }

    public function deserialize(array $data, ResourceNode $resourceNode)
    {
        $this->sipe('name', 'setName', $data, $resourceNode);
        $this->sipe('poster', 'setPoster', $data, $resourceNode);

        // meta
        if (empty($resourceNode->getResourceType())) {
            /** @var ResourceType $resourceType */
            $resourceType = $this->om
                ->getRepository('ClarolineCoreBundle:Resource\ResourceType')
                ->findOneBy(['name' => $data['meta']['type']]);

            $resourceNode->setResourceType($resourceType);
        }

        if (empty($resourceNode->getMimeType())) {
            if (isset($data['meta']) && !empty($data['meta']['mimeType'])) {
                $mimeType = $data['meta']['mimeType'];
            } else {
                $mimeType = 'custom/'.$resourceNode->getResourceType()->getName();
            }

            $resourceNode->setMimeType($mimeType);
        }

        $this->sipe('meta.published', 'setPublished', $data, $resourceNode);
        $this->sipe('meta.description', 'setDescription', $data, $resourceNode);
        $this->sipe('meta.portal', 'setPublishedToPortal', $data, $resourceNode);
        $this->sipe('meta.license', 'setLicense', $data, $resourceNode);
        $this->sipe('meta.authors', 'setAuthor', $data, $resourceNode);

        // display
        $this->sipe('display.fullscreen', 'setFullscreen', $data, $resourceNode);
        $this->sipe('display.showIcon', 'setShowIcon', $data, $resourceNode);
        $this->sipe('display.closable', 'setClosable', $data, $resourceNode);
        $this->sipe('display.closeTarget', 'setCloseTarget', $data, $resourceNode);

        // restrictions
        $this->sipe('restrictions.code', 'setAccessCode', $data, $resourceNode);
        $this->sipe('restrictions.ips', 'setAllowedIps', $data, $resourceNode);

        if (isset($restrictions['dates'])) {
            $dateRange = DateRangeNormalizer::denormalize($restrictions['dates']);

            $resourceNode->setAccessibleFrom($dateRange[0]);
            $resourceNode->setAccessibleUntil($dateRange[1]);
        }
    }
}
