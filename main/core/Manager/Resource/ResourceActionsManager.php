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

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\MenuAction;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Manager\MaskManager;
use Claroline\CoreBundle\Manager\RightsManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.resource_actions")
 */
class ResourceActionsManager
{
    /** @var ObjectManager */
    private $om;

    /** @var MaskManager */
    private $maskManager;

    /** @var RightsManager */
    private $rightsManager;

    /**
     * ResourceMenuManager constructor.
     *
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager"),
     *     "maskManager"       = @DI\Inject("claroline.manager.mask_manager"),
     *     "rightsManager"     = @DI\Inject("claroline.manager.rights_manager")
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
    }

    public function hasAction(ResourceNode $resourceNode, $actionName)
    {
        // todo : implement

        return true;
    }

    /**
     * @param ResourceNode $resourceNode
     * @param string       $actionName
     *
     * @return MenuAction
     */
    public function getAction(ResourceNode $resourceNode, $actionName)
    {
        // todo : implement
    }

    /**
     * @param ResourceNode $resourceNode
     *
     * @return MenuAction[]
     */
    public function getAvailableActions(ResourceNode $resourceNode)
    {
        //ResourceManager::isResourceActionImplemented(ResourceType $resourceType = null, $actionName)
        $actions = $this->getMenus($resourceNode);

        $currentPerms = $this->rightsManager->getCurrentPermissionArray($resourceNode);
        $currentMask = $this->maskManager->encodeMask($currentPerms, $resourceNode->getResourceType());

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
     * @param ResourceNode $resourceNode
     *
     * @return MenuAction[]
     *
     * @deprecated
     */
    public function getMenus(ResourceNode $resourceNode)
    {
        $specificMenus = $resourceNode->getResourceType()->getActions();

        return array_merge(
            $specificMenus->toArray(),
            $this->om->getRepository('ClarolineCoreBundle:Resource\MenuAction')->findBy(['resourceType' => null])
        );
    }

    public function getByResourceType(ResourceType $resourceType = null)
    {
        return $this
            ->om
            ->getRepository('ClarolineCoreBundle:Resource\MenuAction')
            ->findBy(['resourceType' => $resourceType]);
    }
}
