<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager\Resource;

use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\MenuAction;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Event\Resource\ResourceActionEvent;
use Doctrine\Common\Persistence\ObjectRepository;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.resource_action")
 */
class ResourceActionManager
{
    /** @var ObjectManager */
    private $om;

    /** @var StrictDispatcher */
    private $dispatcher;

    /** @var MaskManager */
    private $maskManager;

    /** @var RightsManager */
    private $rightsManager;

    /** @var ObjectRepository */
    private $repository;

    /**
     * @var MenuAction[]
     */
    private $genericActions = [];

    /**
     * ResourceMenuManager constructor.
     *
     * @DI\InjectParams({
     *     "om"            = @DI\Inject("claroline.persistence.object_manager"),
     *     "maskManager"   = @DI\Inject("claroline.manager.mask_manager"),
     *     "rightsManager" = @DI\Inject("claroline.manager.rights_manager")
     * })
     *
     * @param ObjectManager $om
     * @param MaskManager $maskManager
     * @param RightsManager $rightsManager
     */
    public function __construct(
        ObjectManager $om,
        MaskManager $maskManager,
        RightsManager $rightsManager)
    {
        $this->om = $om;
        $this->maskManager = $maskManager;
        $this->rightsManager = $rightsManager;

        $this->repository = $this->om->getRepository('ClarolineCoreBundle:Resource\MenuAction');

        // preload the list of actions available for all resource types
        // it will avoid to have to load it for each not
        // this is safe to do it because the only way to change action is through
        // the platform install/update process
        $this->genericActions = $this->repository->findBy(['resourceType' => null]);
    }

    public function support(ResourceNode $resourceNode, $actionName, $method)
    {
        // todo : implement

        // return $this->dispatcher->hasListeners($eventName);

        return true;
    }

    public function execute(ResourceNode $resourceNode, $actionName, array $options = [], array $content = null)
    {
        // todo : implement
        $resourceAction = $this->get($resourceNode, $actionName);

        /** @var ResourceActionEvent $event */
        $event = $this->dispatcher->dispatch(
            static::eventName($actionName, $resourceAction->getResourceType()),
            ResourceActionEvent::class,
            [$options, $content] // todo : pass current resource
        );

        return $event->getResponse();
    }

    /**
     * @param ResourceNode $resourceNode
     * @param string       $actionName
     *
     * @return MenuAction
     */
    public function get(ResourceNode $resourceNode, $actionName)
    {
        // todo : implement
    }

    /**
     * Gets all actions available for a resource.
     *
     * @param ResourceNode $resourceNode
     *
     * @return MenuAction[]
     */
    public function all(ResourceNode $resourceNode)
    {
        $resourceType = $resourceNode->getResourceType();

        /** @var MenuAction[] $actions */
        $actions = array_merge(
            $resourceType->getActions()->toArray(),
            $this->genericActions
        );

        // TODO : find a way to move permission checks elsewhere
        $currentPerms = $this->rightsManager->getCurrentPermissionArray($resourceNode);
        $currentMask = $this->maskManager->encodeMask($currentPerms, $resourceType);

        $available = [];
        foreach ($actions as $action) {
            if ($action->getMask() & $currentMask) {
                // The user has the right to access the action
                $available[] = $action;
            }
        }

        return $available;
    }

    /**
     * Generates the names for dispatched events.
     *
     * @param string       $actionName
     * @param ResourceType $resourceType
     *
     * @return string
     */
    private static function eventName($actionName, ResourceType $resourceType = null)
    {
        if (!empty($resourceType)) {
            // This is an action only available for the current type
            return 'resource.'.$resourceType->getName().'.'.$actionName;;
        }

        // This is an action available for all resource types
        return 'resource.'.$actionName;
    }
}
