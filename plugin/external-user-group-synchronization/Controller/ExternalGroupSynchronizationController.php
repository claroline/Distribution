<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 4/12/17
 */

namespace Claroline\ExternalSynchronizationBundle\Controller;

use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\RoleManager;
use Claroline\ExternalSynchronizationBundle\Manager\ExternalSynchronizationGroupManager;
use Claroline\ExternalSynchronizationBundle\Manager\ExternalSynchronizationManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class ExternalGroupSynchronizationController extends Controller
{
    /**
     * @var ExternalSynchronizationManager
     * @DI\Inject("claroline.manager.external_user_group_sync_manager")
     */
    private $externalUserGroupSyncManager;

    /**
     * @var ExternalSynchronizationGroupManager
     * @DI\Inject("claroline.manager.external_user_group_sync_group_manager")
     */
    private $externalGroupSyncManager;

    /**
     * @var AuthorizationCheckerInterface
     * @DI\Inject("security.authorization_checker")
     */
    private $authorization;

    /** @var RoleManager
     *  @DI\Inject("claroline.manager.role_manager")
     */
    private $roleManager;

    /**
     * @EXT\Route("/workspace/{workspace}/page/{page}/max/{max}/order/{order}/direction/{direction}/search/{search}",
     *     name="claro_admin_external_user_sync_groups_list",
     *     defaults={"page"=1, "search"="", "max"=50, "order"="name", "direction"="ASC"},
     * )
     * @EXT\Template("ClarolineExternalSynchronizationBundle:Groups:list.html.twig")
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function externalGroupsListAction(Workspace $workspace, $page, $max, $order, $direction, $search)
    {
        $this->checkAccess($workspace);
        $canEdit = $this->hasEditionAccess($workspace);
        $wsRoles = $this->roleManager->getRolesByWorkspace($workspace);
        $pager = $this->externalGroupSyncManager->getExternalGroupsByRolesAndSearch(
            $wsRoles,
            $search,
            $page,
            $max,
            $order,
            $direction
        );

        return [
            'workspace' => $workspace,
            'pager' => $pager,
            'search' => $search,
            'wsRoles' => $wsRoles,
            'max' => $max,
            'order' => $order,
            'direction' => $direction,
            'canEdit' => $canEdit,
        ];
    }

    private function checkAccess(Workspace $workspace)
    {
        if (!$this->authorization->isGranted('users', $workspace)) {
            throw new AccessDeniedException();
        }
    }

    private function hasEditionAccess(Workspace $workspace)
    {
        return $this->authorization->isGranted(['users', 'edit'], $workspace);
    }
}
