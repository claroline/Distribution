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

use Claroline\CoreBundle\Manager\IPWhiteListManager;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;

/**
 * This voter grants access to admin users, whenever the attribute or the
 * class is. This means that administrators are seen by the AccessDecisionManager
 * as if they have all the possible roles and permissions on every object or class.
 */
class IPWhiteListVoter implements VoterInterface
{
    public function __construct(IPWhiteListManager $ipwlm)
    {
        $this->ipwlm = $ipwlm;
    }

    public function vote(TokenInterface $token, $object, array $attributes)
    {
        return $this->ipwlm->isWhiteListed() ? VoterInterface::ACCESS_GRANTED : VoterInterface::ACCESS_ABSTAIN;
    }

    public function supportsAttribute($attribute)
    {
        return true;
    }

    public function supportsClass($class)
    {
        return true;
    }
}
