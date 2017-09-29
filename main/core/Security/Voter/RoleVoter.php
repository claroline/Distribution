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

use Claroline\CoreBundle\Security\PlatformRoles;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;
use Claroline\CoreBundle\Security\ObjectCollection;
use Claroline\CoreBundle\Security\AbstractVoter;
use Claroline\CoreBundle\Entity\Role;

/**
 * This voter grants access to admin users, whenever the attribute or the
 * class is. This means that administrators are seen by the AccessDecisionManager
 * as if they have all the possible roles and permissions on every object or class.
 *
 * @DI\Service
 * @DI\Tag("security.voter")
 */
class RoleVoter extends AbstractVoter
{
    public function checkPermission(TokenInterface $token, $object, array $attributes, array $options)
    {
        $action = $attributes[0];

        switch ($action) {
            case self::CREATE: return $this->checkCreation($token, $object);
            case self::EDIT:   return $this->checkEdit($token, $object);
            case self::DELETE: return $this->checkDelete($token, $object);
        }

        return VoterInterface::ACCESS_ABSTAIN;
    }

    private function checkCreation(TokenInterface $token, Role $role)
    {
        if (!$role->getWorkspace()) {
            return $this->hasAdminToolAccess($token, 'user_management') ?
              VoterInterface::ACCESS_GRANTED: VoterInterface::ACCESS_DENIED;
        }

        //not used in workspaces yet so no implementation
        return VoterInterface::ACCESS_ABSTAIN;
    }

    private function checkEdit(TokenInterface $token, Role $object)
    {
        if (!$role->getWorkspace()) {
            return $this->hasAdminToolAccess($token, 'user_management') ?
            VoterInterface::ACCESS_GRANTED: VoterInterface::ACCESS_DENIED;
        }

        //not used in workspaces yet so no implementation
        return VoterInterface::ACCESS_ABSTAIN;
    }

    private function checkDelete(TokenInterface $token, Role $object)
    {
        if (!$role->getWorkspace()) {
            return $this->hasAdminToolAccess($token, 'user_management') ?
            VoterInterface::ACCESS_GRANTED: VoterInterface::ACCESS_DENIED;
        }

        //not used in workspaces yet so no implementation
        return VoterInterface::ACCESS_ABSTAIN;
    }

    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Role';
    }
}
