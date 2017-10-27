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

interface LogInterface
{
    const doerTypeAnonymous = 'anonymous';
    const doerTypeUser = 'user';
    const doerTypePlatform = 'platform';

    public function getId();
    public function setAction($action);
    public function getAction();
    public function setDateLog(\DateTime $date);
    public function getDateLog();
    public function setDetails($details);
    public function getDetails();
    public function setDoerType($doerType);
    public function getDoerType();
    public function setDoerIp($doerIp);
    public function getDoerIp();
    public function setDoerSessionId($doerSessionId);
    public function getDoerSessionId();
    public function setDoer(User $doer = null);
    public function getDoer();
    public function addDoerPlatformRole(Role $doerPlatformRoles);
    public function removeDoerPlatformRole(Role $doerPlatformRoles);
    public function getDoerPlatformRoles();
    public function addDoerWorkspaceRole(Role $doerWorkspaceRoles);
    public function removeDoerWorkspaceRole(Role $doerWorkspaceRoles);
    public function getDoerWorkspaceRoles();
    public function setReceiver(User $receiver = null);
    public function getReceiver();
    public function setReceiverGroup(Group $receiverGroup = null);
    public function getReceiverGroup();
    public function setOwner(User $owner = null);
    public function getOwner();
    public function setWorkspace(Workspace $workspace = null);
    public function getWorkspace();
    public function setResourceNode(ResourceNode $resourceNode = null);
    public function getResourceNode();
    public function setResourceType(ResourceType $resourceType = null);
    public function getResourceType();
    public function setRole(Role $role = null);
    public function getRole();
    public function setToolName($toolName);
    public function getToolName();
    public function setIsDisplayedInAdmin($isDisplayedInAdmin);
    public function isDisplayedInAdmin();
    public function setIsDisplayedInWorkspace($isDisplayedInWorkspace);
    public function isDisplayedInWorkspace();
    public function getOtherElementId();
    public function setOtherElementId($otherElementId);
}
