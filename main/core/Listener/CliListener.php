<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Listener;

use Claroline\CoreBundle\Library\Security\TokenUpdater;
use Claroline\CoreBundle\Manager\RoleManager;
use Claroline\CoreBundle\Manager\UserManager;
use Doctrine\DBAL\Exception\ConnectionException;
use Doctrine\ORM\EntityManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Console\Event\ConsoleCommandEvent;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @DI\Service
 */
class CliListener
{
    private $tokenStorage;
    private $authorization;
    private $roleManager;
    private $tokenUpdater;
    private $userManager;

    /**
     * @DI\InjectParams({
     *     "authorization" = @DI\Inject("security.authorization_checker"),
     *     "tokenStorage"  = @DI\Inject("security.token_storage"),
     *     "em"            = @DI\Inject("doctrine.orm.entity_manager"),
     *     "roleManager"   = @DI\Inject("claroline.manager.role_manager"),
     *     "tokenUpdater"  = @DI\Inject("claroline.security.token_updater"),
     *     "userManager"   = @DI\Inject("claroline.manager.user_manager")
     * })
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        AuthorizationCheckerInterface $authorization,
        EntityManager $em,
        UserManager $userManager,
        RoleManager $roleManager,
        TokenUpdater $tokenUpdater
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->authorization = $authorization;
        $this->em = $em;
        $this->roleManager = $roleManager;
        $this->tokenUpdater = $tokenUpdater;
        $this->userManager = $userManager;
    }

    /**
     * Sets claroline default admin for cli because it's very annoying otherwise to do it manually everytime.
     *
     * @DI\Observe("console.command", priority = 17)
     *
     * @param GetResponseEvent $event
     */
    public function setLocale(ConsoleCommandEvent $event)
    {
        try {
            $user = $this->userManager->getDefaultClarolineAdmin();
            $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
            $this->tokenStorage->setToken($token);
        } catch (ConnectionException $e) {
            //database does not exists yet
        }
    }
}
