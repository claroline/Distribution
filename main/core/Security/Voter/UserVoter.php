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
use Claroline\CoreBundle\Security\AbstractVoter;
use Claroline\CoreBundle\Security\ObjectCollection;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\VoterInterface;

/**
 * @DI\Service
 * @DI\Tag("security.voter")
 */
class UserVoter extends AbstractVoter
{
    /**
     * @param TokenInterface $token
     * @param mixed          $object
     * @param array          $attributes
     * @param array          $options
     *
     * @return int
     */
    public function checkPermission(TokenInterface $token, $object, array $attributes, array $options)
    {
        switch ($attributes[0]) {
            case self::VIEW:   return $this->checkView($token, $object);
            case self::CREATE: return $this->checkCreation();
            case self::EDIT:   return $this->checkEdit($token, $object);
            case self::DELETE: return $this->checkDelete($token, $object);
            case self::PATCH:  return $this->checkPatch($token, $object, $options['collection']);
        }

        return VoterInterface::ACCESS_ABSTAIN;
    }

    /**
     * @return int
     */
    private function checkCreation()
    {
        /** @var \Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler */
        $handler = $this->getContainer()->get('claroline.config.platform_config_handler');

        return $handler->getParameter('allow_self_registration') ?
             VoterInterface::ACCESS_GRANTED : VoterInterface::ACCESS_ABSTAIN;
    }

    /**
     * We currently check this manually inside the Controller. This should change and be checked here.
     *
     * @param TokenInterface $token
     * @param User           $user
     *
     * @return int
     */
    private function checkEdit(TokenInterface $token, User $user)
    {
        return $this->isOrganizationManager($token, $user) ?
            VoterInterface::ACCESS_GRANTED : VoterInterface::ACCESS_DENIED;
    }

    /**
     * We currently check this manually inside the Controller. This should change and be checked here.
     *
     * @param TokenInterface $token
     * @param User           $user
     *
     * @return int
     */
    private function checkView(TokenInterface $token, User $user)
    {
        return $this->isOrganizationManager($token, $user) ?
              VoterInterface::ACCESS_GRANTED : VoterInterface::ACCESS_DENIED;
    }

    /**
     * @param TokenInterface $token
     * @param User           $user
     *
     * @return int
     */
    private function checkDelete(TokenInterface $token, User $user)
    {
        return $this->isOrganizationManager($token, $user) ?
              VoterInterface::ACCESS_GRANTED : VoterInterface::ACCESS_DENIED;
    }

    /**
     * This is not done yet but later a user might be able to edit its roles/groups himself
     * and it should be checked here.
     *
     * @param TokenInterface   $token
     * @param User             $user
     * @param ObjectCollection $collection
     *
     * @return int
     */
    private function checkPatch(TokenInterface $token, User $user, ObjectCollection $collection)
    {
        if ($this->isOrganizationManager($token, $user)) {
            return VoterInterface::ACCESS_GRANTED;
        }

        //maybe do something more complicated later
        return $this->isGranted(self::EDIT, $collection) ?
            VoterInterface::ACCESS_GRANTED : VoterInterface::ACCESS_DENIED;
    }

    /**
     * @return string
     */
    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\User';
    }

    /**
     * @return array
     */
    public function getSupportedActions()
    {
        return[self::CREATE, self::EDIT, self::DELETE, self::PATCH];
    }
}
