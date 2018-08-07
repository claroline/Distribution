<?php

namespace Claroline\CoreBundle\Listener\Resource;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Event\Resource\ResourceActionEvent;
use Claroline\CoreBundle\Exception\ResourceAccessException;
use Claroline\CoreBundle\Manager\Resource\ResourceLifecycleManager;
use Claroline\CoreBundle\Manager\Resource\RightsManager;
use Claroline\CoreBundle\Manager\ResourceManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @DI\Service()
 */
class ResourceListener
{
    /** @var TokenStorageInterface */
    private $tokenStorage;

    /** @var Crud */
    private $crud;

    /** @var SerializerProvider */
    private $serializer;

    /** @var ResourceManager */
    private $resourceManager;

    /** @var ResourceLifecycleManager */
    private $resourceLifecycleManager;

    /** @var RightsManager */
    private $resourceRightsManager;

    /**
     * ResourceListener constructor.
     *
     * @DI\InjectParams({
     *     "tokenStorage"             = @DI\Inject("security.token_storage"),
     *     "crud"                     = @DI\Inject("claroline.api.crud"),
     *     "serializer"               = @DI\Inject("claroline.api.serializer"),
     *     "resourceManager"          = @DI\Inject("claroline.manager.resource_manager"),
     *     "resourceLifecycleManager" = @DI\Inject("claroline.manager.resource_lifecycle"),
     *     "resourceRightsManager"    = @DI\Inject("claroline.manager.rights_manager")
     * })
     *
     * @param TokenStorageInterface    $tokenStorage
     * @param Crud                     $crud
     * @param SerializerProvider       $serializer
     * @param ResourceManager          $resourceManager
     * @param ResourceLifecycleManager $resourceLifecycleManager
     * @param RightsManager            $resourceRightsManager
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        Crud $crud,
        SerializerProvider $serializer,
        ResourceManager $resourceManager,
        ResourceLifecycleManager $resourceLifecycleManager,
        RightsManager $resourceRightsManager
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->crud = $crud;
        $this->serializer = $serializer;
        $this->resourceManager = $resourceManager;
        $this->resourceLifecycleManager = $resourceLifecycleManager;
        $this->resourceRightsManager = $resourceRightsManager;
    }

    /**
     * @DI\Observe("resource.rights")
     *
     * @param ResourceActionEvent $event
     */
    public function onRights(ResourceActionEvent $event)
    {
        // forward to the resource type
        $data = $event->getData();
        $this->crud->update(ResourceNode::class, $data);
        $this->resourceLifecycleManager->rights($event->getResourceNode(), $event->getData());

        $event->setResponse(new JsonResponse(
            $this->serializer->serialize($event->getResourceNode())
        ));
    }

    /**
     * @DI\Observe("resource.create")
     *
     * @param ResourceActionEvent $event
     */
    public function onCreate(ResourceActionEvent $event)
    {
        // forward to the resource type
        $this->resourceLifecycleManager->create($event->getResourceNode());
    }

    /**
     * @DI\Observe("resource.open")
     *
     * @param ResourceActionEvent $event
     */
    public function onOpen(ResourceActionEvent $event)
    {
        // forward to the resource type
        $this->resourceLifecycleManager->open($event->getResourceNode());
    }

    /**
     * @DI\Observe("resource.about")
     *
     * @param ResourceActionEvent $event
     */
    public function onAbout(ResourceActionEvent $event)
    {
        // todo return the full serialized version of the resource node
    }

    /**
     * @DI\Observe("resource.configure")
     *
     * @param ResourceActionEvent $event
     */
    public function onConfigure(ResourceActionEvent $event)
    {
        $data = $event->getData();
        $this->crud->update(ResourceNode::class, $data);

        $event->setResponse(new JsonResponse($data));
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("resource.edit")
     *
     * @param ResourceActionEvent $event
     */
    public function onEdit(ResourceActionEvent $event)
    {
        $this->resourceLifecycleManager->edit($event->getResourceNode());
    }

    /**
     * @DI\Observe("resource.publish")
     *
     * @param ResourceActionEvent $event
     */
    public function onPublish(ResourceActionEvent $event)
    {
        $this->resourceManager->setPublishedStatus([$event->getResourceNode()], true);

        $event->setResponse(
            new JsonResponse($this->serializer->serialize($event->getResourceNode()))
        );
    }

    /**
     * @DI\Observe("resource.unpublish")
     *
     * @param ResourceActionEvent $event
     */
    public function onUnpublish(ResourceActionEvent $event)
    {
        $this->resourceManager->setPublishedStatus([$event->getResourceNode()], false);

        $event->setResponse(
            new JsonResponse($this->serializer->serialize($event->getResourceNode()))
        );
    }

    /**
     * @DI\Observe("resource.export")
     *
     * @param ResourceActionEvent $event
     */
    public function onExport(ResourceActionEvent $event)
    {
        $this->resourceLifecycleManager->export($event->getResourceNode());
    }

    /**
     * @DI\Observe("resource.delete")
     *
     * @param ResourceActionEvent $event
     */
    public function onDelete(ResourceActionEvent $event)
    {
        $this->resourceManager->delete($event->getResourceNode());
        //$this->resourceLifecycleManager->delete($event->getResourceNode());

        $event->setResponse(
            new JsonResponse(null, 204)
        );
    }

    /**
     * @DI\Observe("resource.copy")
     *
     * @param ResourceActionEvent $event
     */
    public function onCopy(ResourceActionEvent $event)
    {
        $resourceNode = $event->getResourceNode();
        $data = $event->getData();
        $parent = isset($data['destination']['autoId']) && isset($data['destination']['meta']['type']) && 'directory' === $data['destination']['meta']['type'] ?
            $this->resourceManager->getById($data['destination']['autoId']) :
            null;
        $user = $this->tokenStorage->getToken()->getUser();

        if (!empty($parent) && 'anon.' !== $user) {
            $newResource = $this->resourceManager->copy($resourceNode, $parent, $user);
            $event->setResponse(
                new JsonResponse($this->serializer->serialize($newResource->getResourceNode()))
            );
        } else {
            $event->setResponse(
                new JsonResponse(null, 500)
            );
        }
    }

    /**
     * @DI\Observe("resource.move")
     *
     * @param ResourceActionEvent $event
     */
    public function onMove(ResourceActionEvent $event)
    {
        $resourceNode = $event->getResourceNode();
        $data = $event->getData();
        $parent = isset($data['destination']['autoId']) && isset($data['destination']['meta']['type']) && 'directory' === $data['destination']['meta']['type'] ?
            $this->resourceManager->getById($data['destination']['autoId']) :
            null;

        if (!empty($parent)) {
            $movedResource = $this->resourceManager->move($resourceNode, $parent);
            $event->setResponse(
                new JsonResponse($this->serializer->serialize($movedResource), 200)
            );
        } else {
            $event->setResponse(
                new JsonResponse(null, 500)
            );
        }
    }
}
