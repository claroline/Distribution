<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Document;

use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Model\LogInterface;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\Document
 */
class Log implements LogInterface
{
    /**
     * @MongoDB\Id
     */
    protected $id;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $action;

    /**
     * @MongoDB\Field(type="date")
     */
    protected $dateLog;

    /**
     * @MongoDB\Field(type="date")
     */
    protected $shortDateLog;

    /**
     * @MongoDB\Field(type="raw")
     */
    protected $details;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $doer;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $doerType;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $doerIp;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $doerSessionId;

    /**
     * @MongoDB\Field(type="raw")
     */
    protected $doerPlatformRoles;

    /**
     * @MongoDB\Field(type="raw")
     */
    protected $doerWorkspaceRoles;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $receiver;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $receiverGroup;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $owner;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $workspace;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $toolName;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $resourceNode;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $resourceType;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $role;

    /**
     * @MongoDB\Field(type="boolean")
     */
    protected $isDisplayedInAdmin = false;

    /**
     * @MongoDB\Field(type="boolean")
     */
    protected $isDisplayedInWorkspace = false;

    /**
     * @MongoDB\Field(type="integer")
     */
    protected $otherElementId;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->doerPlatformRoles = [];
        $this->doerWorkspaceRoles = [];
    }

    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set action.
     *
     * @param string $action
     *
     * @return Log
     */
    public function setAction($action)
    {
        $this->action = $action;

        return $this;
    }

    /**
     * Get action.
     *
     * @return string
     */
    public function getAction()
    {
        return $this->action;
    }

    /**
     * Sets the log creation date.
     *
     * NOTE : creation date is already handled by the timestamp listener; this
     *        setter exists mainly for testing purposes.
     *
     * @param \DateTime $date
     */
    public function setDateLog(\DateTime $date)
    {
        $this->dateLog = $date;
        $this->shortDateLog = $date;
    }

    /**
     * Get dateLog.
     *
     * @return \DateTime
     */
    public function getDateLog()
    {
        return $this->dateLog;
    }

    /**
     * Set details.
     *
     * @param array $details
     *
     * @return Log
     */
    public function setDetails($details)
    {
        $this->details = $details;

        return $this;
    }

    /**
     * Get details.
     *
     * @return array
     */
    public function getDetails()
    {
        return $this->details;
    }

    /**
     * Set doerType.
     *
     * @param string $doerType
     *
     * @return Log
     */
    public function setDoerType($doerType)
    {
        $this->doerType = $doerType;

        return $this;
    }

    /**
     * Get doerType.
     *
     * @return string
     */
    public function getDoerType()
    {
        return $this->doerType;
    }

    /**
     * Set doerIp.
     *
     * @param string $doerIp
     *
     * @return Log
     */
    public function setDoerIp($doerIp)
    {
        $this->doerIp = $doerIp;

        return $this;
    }

    /**
     * Get doerIp.
     *
     * @return string
     */
    public function getDoerIp()
    {
        return $this->doerIp;
    }

    /**
     * Set doerSessionId.
     *
     * @param string $doerSessionId
     *
     * @return Log
     */
    public function setDoerSessionId($doerSessionId)
    {
        $this->doerSessionId = $doerSessionId;

        return $this;
    }

    /**
     * Get doerSessionId.
     *
     * @return string
     */
    public function getDoerSessionId()
    {
        return $this->doerSessionId;
    }

    /**
     * Set doer.
     *
     * @param User $doer
     *
     * @return Log
     */
    public function setDoer(User $doer = null)
    {
        $this->doer = $this->getIdentifier($doer);

        return $this;
    }

    /**
     * Get doer.
     *
     * @return User
     */
    public function getDoer()
    {
        return $this->doer;
    }

    /**
     * Add doerPlatformRoles.
     *
     * @param Role $doerPlatformRoles
     *
     * @return Log
     */
    public function addDoerPlatformRole(Role $doerPlatformRole)
    {
        $this->doerPlatformRoles[] = $this->getIdentifier($doerPlatformRole);

        return $this;
    }

    /**
     * Remove doerPlatformRoles.
     *
     * @param Role $doerPlatformRoles
     */
    public function removeDoerPlatformRole(Role $doerPlatformRole)
    {
        unset($this->doerPlatformRoles[array_search($this->getIdentifier($doerPlatformRole), $this->doerPlatformRoles)]);

        return $this;
    }

    /**
     * Get doerPlatformRoles.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getDoerPlatformRoles()
    {
        return $this->doerPlatformRoles;
    }

    /**
     * Add doerWorkspaceRoles.
     *
     * @param Role $doerWorkspaceRoles
     *
     * @return Log
     */
    public function addDoerWorkspaceRole(Role $doerWorkspaceRole)
    {
        $this->doerWorkspaceRoles[] = $this->getIdentifier($doerWorkspaceRole);

        return $this;
    }

    /**
     * Remove doerWorkspaceRoles.
     *
     * @param Role $doerWorkspaceRoles
     */
    public function removeDoerWorkspaceRole(Role $doerWorkspaceRole)
    {
        unset($this->doerWorkspaceRoles[array_search($this->getIdentifier($doerWorkspaceRole), $this->doerWorkspaceRoles)]);

        return $this;
    }

    /**
     * Get doerWorkspaceRoles.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getDoerWorkspaceRoles()
    {
        return $this->doerWorkspaceRoles;
    }

    /**
     * Set receiver.
     *
     * @param User $receiver
     *
     * @return Log
     */
    public function setReceiver(User $receiver = null)
    {
        $this->receiver = $this->getIdentifier($receiver);

        return $this;
    }

    /**
     * Get receiver.
     *
     * @return User
     */
    public function getReceiver()
    {
        return $this->receiver;
    }

    /**
     * Set receiverGroup.
     *
     * @param Group $receiverGroup
     *
     * @return Log
     */
    public function setReceiverGroup(Group $receiverGroup = null)
    {
        $this->receiverGroup = $this->getIdentifier($receiverGroup);

        return $this;
    }

    /**
     * Get receiverGroup.
     *
     * @return Group
     */
    public function getReceiverGroup()
    {
        return $this->receiverGroup;
    }

    /**
     * Set owner.
     *
     * @param User $owner
     *
     * @return Log
     */
    public function setOwner(User $owner = null)
    {
        $this->owner = $this->getIdentifier($owner);

        return $this;
    }

    /**
     * Get owner.
     *
     * @return User
     */
    public function getOwner()
    {
        return $this->owner;
    }

    /**
     * Set workspace.
     *
     * @param Workspace $workspace
     *
     * @return Log
     */
    public function setWorkspace(Workspace $workspace = null)
    {
        $this->workspace = $this->getIdentifier($workspace);

        return $this;
    }

    /**
     * Get workspace.
     *
     * @return Workspace
     */
    public function getWorkspace()
    {
        return $this->workspace;
    }

    /**
     * Set resource.
     *
     * @param ResourceNode $resourceNode
     *
     * @return Log
     */
    public function setResourceNode(ResourceNode $resourceNode = null)
    {
        $this->resourceNode = $this->getIdentifier($resourceNode);

        return $this;
    }

    /**
     * Get resource.
     *
     * @return ResourceNode
     */
    public function getResourceNode()
    {
        return $this->resourceNode;
    }

    /**
     * Set resourceType.
     *
     * @param ResourceType $resourceType
     *
     * @return Log
     */
    public function setResourceType(ResourceType $resourceType = null)
    {
        $this->resourceType = $this->getIdentifier($resourceType);

        return $this;
    }

    /**
     * Get resourceType.
     *
     * @return ResourceType
     */
    public function getResourceType()
    {
        return $this->resourceType;
    }

    /**
     * Set role.
     *
     * @param Role $role
     *
     * @return Log
     */
    public function setRole(Role $role = null)
    {
        $this->role = $this->getIdentifier($role);

        return $this;
    }

    /**
     * Get role.
     *
     * @return Role
     */
    public function getRole()
    {
        return $this->role;
    }

    /**
     * Set toolName.
     *
     * @param string $toolName
     *
     * @return Log
     */
    public function setToolName($toolName)
    {
        $this->toolName = $toolName;

        return $this;
    }

    /**
     * Get toolName.
     *
     * @return string
     */
    public function getToolName()
    {
        return $this->toolName;
    }

    /**
     * @param mixed $isDisplayedInAdmin
     *
     * @return Log
     */
    public function setIsDisplayedInAdmin($isDisplayedInAdmin)
    {
        $this->isDisplayedInAdmin = $isDisplayedInAdmin;

        return $this;
    }

    /**
     * @return bool
     */
    public function isDisplayedInAdmin()
    {
        return $this->isDisplayedInAdmin;
    }

    /**
     * @param bool $isDisplayedInWorkspace
     *
     * @return Log
     */
    public function setIsDisplayedInWorkspace($isDisplayedInWorkspace)
    {
        $this->isDisplayedInWorkspace = $isDisplayedInWorkspace;

        return $this;
    }

    /**
     * @return bool
     */
    public function isDisplayedInWorkspace()
    {
        return $this->isDisplayedInWorkspace;
    }

    /**
     * @return int
     */
    public function getOtherElementId()
    {
        return $this->otherElementId;
    }

    /**
     * @param int $otherElementId
     *
     * @return Log
     */
    public function setOtherElementId($otherElementId)
    {
        $this->otherElementId = $otherElementId;

        return $this;
    }

    private function getIdentifier($object)
    {
        if (!$object) {
            return null;
        }

        if (method_exists($object, 'getUuid')) {
            return $object->getUuid();
        }

        if (method_exists($object, 'getGuid')) {
            return $object->getGuid();
        }

        return $object->getId();
    }

    /*
        private function serializeRole(Role $role)
        {
            return [
                'uuid' => $role->getUuid(),
                'translationKey' => $role->getTranslationKey(),
                'name' => $role->getName()
            ];
        }*/
}
