<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Security\Voter;

use Claroline\CoreBundle\Security\AbstractVoter;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;

/**
 * @DI\Service
 * @DI\Tag("security.voter")
 */
class RoleVoter extends AbstractVoter
{
    public function checkPermission(TokenInterface $token, $object, array $attributes, array $options)
    {
        if (!$object->getWorkspace()) {
            return $this->hasAdminToolAccess($token, 'user_management') ?
            VoterInterface::ACCESS_GRANTED : VoterInterface::ACCESS_DENIED;
        }

        //if it's a workspace role, we must be able be granted the edit perm on the workspace users tool
        // and our right level to be less than the role we're trying to remove that way, a user cannot remove admins
        if ($this->isGranted(['users', 'edit'], $object->getWorkspace())) {
            $workspaceManager = $this->getContainer()->get('claroline.manager.workspace_manager');
            // If user is workspace manager then grant access
            if ($workspaceManager->isManager($object->getWorkspace(), $token)) {
                return VoterInterface::ACCESS_GRANTED;
            }
            // If role to be removed is not an administrate role then grant access
            $roleManager = $this->getContainer()->get('claroline.manager.role_manager');
            $wsRoles = $roleManager->getWorkspaceNonAdministrateRoles($object->getWorkspace());
            if (in_array($object, $wsRoles)) {
                return VoterInterface::ACCESS_GRANTED;
            }
        }

        return VoterInterface::ACCESS_DENIED;
    }

    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Role';
    }

    public function getSupportedActions()
    {
        return[self::CREATE, self::EDIT, self::DELETE, self::PATCH];
    }
}
