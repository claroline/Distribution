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
use JMS\SecurityExtraBundle\Annotation as SEC;

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
     * @SEC\PreAuthorize("hasRole('ROLE_ADMIN')")
     */
    public function getPlatformRolesAction()
    {
        return $this->roleManager->getAllPlatformRoles(false);
    }
}
