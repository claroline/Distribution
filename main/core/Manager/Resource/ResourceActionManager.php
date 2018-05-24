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
use Claroline\CoreBundle\Library\Security\Collection\ResourceCollection;
use Doctrine\Common\Persistence\ObjectRepository;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @DI\Service("claroline.manager.resource_action")
 */
class ResourceActionManager
{
    /** @var ObjectManager */
    private $om;

    /** @var AuthorizationCheckerInterface */
    private $authorization;

    /** @var StrictDispatcher */
    private $dispatcher;

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
     *     "authorization" = @DI\Inject("security.authorization_checker")
     * })
     *
     * @param ObjectManager                 $om
     * @param AuthorizationCheckerInterface $authorization
     */
    public function __construct(
        ObjectManager $om,
        AuthorizationCheckerInterface $authorization)
    {
        $this->om = $om;
        $this->authorization = $authorization;

        $this->repository = $this->om->getRepository('ClarolineCoreBundle:Resource\MenuAction');

        // preload the list of actions available for all resource types
        // it will avoid having to load it for each node
        // this is safe because the only way to change actions is through
        // the platform install/update process
        $this->genericActions = $this->repository->findBy(['resourceType' => null]);
    }

    public function support(ResourceNode $resourceNode, $actionName, $method)
    {
        // todo : implement
        $action = $this->get($resourceNode, $actionName);
        if (empty($action) || !in_array($method, $action->getApi()))

        // return $this->dispatcher->hasListeners($eventName);

        return true;
    }

    public function execute(ResourceNode $resourceNode, $actionName, array $options = [], array $content = null)
    {
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

        // only get the actions available for the current user
        return array_filter($actions, function (MenuAction $action) use ($resourceNode) {
            return $this->hasPermission($resourceNode, $action);
        });
    }

    /**
     * Checks if the current user can execute an action on a resource.
     *
     * @param ResourceNode $resourceNode
     * @param MenuAction   $action
     *
     * @return bool
     */
    private function hasPermission(ResourceNode $resourceNode, MenuAction $action)
    {
        return $this->authorization->isGranted($action->getDecoder(), new ResourceCollection([$resourceNode]));
    }

    /**
     * Generates the names for resource actions events.
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
