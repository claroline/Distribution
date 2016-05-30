<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\API\User;

use JMS\DiExtraBundle\Annotation as DI;
use FOS\RestBundle\Controller\FOSRestController;
use Claroline\CoreBundle\Manager\RoleManager;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use FOS\RestBundle\Controller\Annotations\Get;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @NamePrefix("api_")
 */
class RoleController extends FOSRestController
{
    /**
     * @DI\InjectParams({
     *     "roleManager"   = @DI\Inject("claroline.manager.role_manager"),
     *     "authorization" = @DI\Inject("security.authorization_checker")
     * })
     */
    public function __construct(
        RoleManager $roleManager,
        AuthorizationCheckerInterface $authorization
    ) {
        $this->roleManager = $roleManager;
        $this->authorization = $authorization;
    }

    /**
     * @View(serializerGroups={"api_role"})
     * @Get("/roles/platform", name="get_platform_roles", options={ "method_prefix" = false })
     */
    public function getPlatformRolesAction()
    {
        $this->throwsExceptionIfNotAdmin();

        return $this->roleManager->getAllPlatformRoles();
    }

    private function isAdmin()
    {
        return $this->authorization->isGranted('ROLE_ADMIN');
    }

    private function throwsExceptionIfNotAdmin()
    {
        if (!$this->isAdmin()) {
            throw new AccessDeniedException('This action can only be done by the administrator');
        }
    }
}
