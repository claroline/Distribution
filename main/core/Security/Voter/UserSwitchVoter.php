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

use Claroline\CoreBundle\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;

// TODO : to be tested. I'm not sure this is functional.
class UserSwitchVoter extends Voter
{
    protected function supports($attribute, $subject)
    {
        return in_array($attribute, ['ROLE_ALLOWED_TO_SWITCH'])
            && $subject instanceof User;
    }

    /**
     * @param mixed $object
     * @param array $attributes
     *
     * @return int
     */
    public function voteOnAttribute($attribute, $subject, TokenInterface $token)
    {
        return $this->isOrganizationManager($token, $subject) ? VoterInterface::ACCESS_GRANTED : VoterInterface::ACCESS_DENIED;
    }

    /**
     * Copied from the AbstractVoter.
     *
     * @param User $object
     *
     * @return bool
     */
    protected function isOrganizationManager(TokenInterface $token, $object)
    {
        $adminOrganizations = $token->getUser()->getAdministratedOrganizations();
        $objectOrganizations = $object->getOrganizations();

        foreach ($adminOrganizations as $adminOrganization) {
            foreach ($objectOrganizations as $objectOrganization) {
                if ($objectOrganization === $adminOrganization) {
                    return true;
                }
            }
        }

        return false;
    }
}
