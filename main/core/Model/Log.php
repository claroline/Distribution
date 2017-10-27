<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Model;

use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Doctrine\Common\Collections\ArrayCollection;

class Log implements LogInterface
{
    protected $id = null;
    protected $action;
    protected $dateLog;
    protected $shortDateLog;
    protected $details = [];
    protected $doer = null;
    protected $doerType;
    protected $doerIp = null;
    protected $doerSessionId = null;
    protected $doerPlatformRoles = [];
    protected $doerWorkspaceRoles = [];
    protected $receiver = null;
    protected $receiverGroup = null;
    protected $owner = null;
    protected $workspace = null;
    protected $toolName = null;
    protected $resourceNode = null;
    protected $resourceType = null;
    private $role = null;
    private $isDisplayedInAdmin = false;
    private $isDisplayedInWorkspace = false;
    private $otherElementId = null;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->doerPlatformRoles = new ArrayCollection();
        $this->doerWorkspaceRoles = new ArrayCollection();
        $this->dateLog = new \DateTime();
        $this->shortDateLog = new \DateTime();
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
        $this->doer = $doer;

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
    public function addDoerPlatformRole(Role $doerPlatformRoles)
    {
        $this->doerPlatformRoles[] = $doerPlatformRoles;

        return $this;
    }

    /**
     * Remove doerPlatformRoles.
     *
     * @param Role $doerPlatformRoles
     */
    public function removeDoerPlatformRole(Role $doerPlatformRoles)
    {
        $this->doerPlatformRoles->removeElement($doerPlatformRoles);
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
    public function addDoerWorkspaceRole(Role $doerWorkspaceRoles)
    {
        $this->doerWorkspaceRoles[] = $doerWorkspaceRoles;

        return $this;
    }

    /**
     * Remove doerWorkspaceRoles.
     *
     * @param Role $doerWorkspaceRoles
     */
    public function removeDoerWorkspaceRole(Role $doerWorkspaceRoles)
    {
        $this->doerWorkspaceRoles->removeElement($doerWorkspaceRoles);
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
        $this->receiver = $receiver;

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
        $this->receiverGroup = $receiverGroup;

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
        $this->owner = $owner;

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
        $this->workspace = $workspace;

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
        $this->resourceNode = $resourceNode;

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
        $this->resourceType = $resourceType;

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
        $this->role = $role;

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
}
