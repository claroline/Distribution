<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AgendaBundle\Security\Voter;

use Claroline\AgendaBundle\Entity\Event;
use Claroline\CoreBundle\Security\Voter\AbstractVoter;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;

class EventVoter extends AbstractVoter
{
    public function checkPermission(TokenInterface $token, $object, array $attributes, array $options)
    {
        switch ($attributes[0]) {
            case self::CREATE: return $this->checkEdit($token, $object);
            case self::EDIT:   return $this->checkEdit($token, $object);
            case self::DELETE: return $this->checkEdit($token, $object);
        }

        return VoterInterface::ACCESS_ABSTAIN;
    }

    public function checkEdit(TokenInterface $token, $object)
    {
        $workspace = $object->getWorkspace();

        if ($workspace) {
            $perm = $this->getWorkspaceToolPerm($workspace, 'agenda', $token);

            return $perm & 2 ? VoterInterface::ACCESS_GRANTED : VoterInterface::ACCESS_DENIED;
        } else {
            $currentUser = $token->getUser();
            $user = $object->getUser();

            return 'anon.' !== $currentUser && (!$user || $currentUser->getUuid() === $user->getUuid()) ?
                VoterInterface::ACCESS_GRANTED :
                VoterInterface::ACCESS_DENIED;
        }
    }

    public function getClass()
    {
        return Event::class;
    }

    public function getSupportedActions()
    {
        return[self::OPEN, self::VIEW, self::CREATE, self::EDIT, self::DELETE, self::PATCH];
    }
}
