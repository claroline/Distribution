<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Security\Voter;

use Claroline\CoreBundle\Entity\Tool\OrderedTool;
use Claroline\CoreBundle\Repository\Tool\OrderedToolRepository;
use Claroline\CoreBundle\Security\Voter\AbstractVoter;
use Claroline\CursusBundle\Entity\SessionEvent;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;

class SessionEventVoter extends AbstractVoter
{
    /**
     * @param TokenInterface $token
     * @param SessionEvent   $object
     * @param array          $attributes
     * @param array          $options
     *
     * @return int
     */
    public function checkPermission(TokenInterface $token, $object, array $attributes, array $options)
    {
        /** @var OrderedToolRepository $orderedToolRepo */
        $orderedToolRepo = $this->getObjectManager()->getRepository(OrderedTool::class);

        if ($object->getSession() && $object->getSession()->getWorkspace()) {
            $trainingsTool = $orderedToolRepo->findOneByNameAndWorkspace('trainings', $object->getSession()->getWorkspace());
        } else {
            $trainingsTool = $orderedToolRepo->findOneByNameAndDesktop('trainings');
        }

        $toolEdit = $this->isGranted('EDIT', $trainingsTool);

        switch ($attributes[0]) {
            case self::CREATE: // EDIT right on tool
                if ($toolEdit) {
                    return VoterInterface::ACCESS_GRANTED;
                }

                return VoterInterface::ACCESS_DENIED;

            case self::EDIT:
            case self::DELETE:
            case self::PATCH:
                if ($toolEdit || ($object->getSession() && $this->isGranted('EDIT', $object->getSession()))) {
                    return VoterInterface::ACCESS_GRANTED;
                }

                return VoterInterface::ACCESS_DENIED;
            case self::OPEN:
            case self::VIEW:
                if ($this->isGranted('OPEN', $trainingsTool) || ($object->getSession() && $this->isGranted('OPEN', $object->getSession()))) {
                    return VoterInterface::ACCESS_GRANTED;
                }

                return VoterInterface::ACCESS_DENIED;
        }

        return VoterInterface::ACCESS_ABSTAIN;
    }

    public function getClass()
    {
        return SessionEvent::class;
    }
}
