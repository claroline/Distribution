<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\TeamBundle\Controller\API;

use Claroline\AppBundle\Annotations\ApiMeta;
use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\TeamBundle\Entity\Team;
use Claroline\TeamBundle\Manager\TeamManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @ApiMeta(
 *     class="Claroline\TeamBundle\Entity\Team",
 *     ignore={"exist", "copyBulk", "schema", "find", "list"}
 * )
 * @EXT\Route("/team")
 */
class TeamController extends AbstractCrudController
{
    /** @var AuthorizationCheckerInterface */
    protected $authorization;

    /** @var FinderProvider */
    protected $finder;

    /** @var TeamManager */
    protected $teamManager;

    /**
     * TeamController constructor.
     *
     * @DI\InjectParams({
     *     "authorization" = @DI\Inject("security.authorization_checker"),
     *     "finder"        = @DI\Inject("claroline.api.finder"),
     *     "teamManager"   = @DI\Inject("claroline.manager.team_manager")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param FinderProvider                $finder
     * @param TeamManager                   $teamManager
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        FinderProvider $finder,
        TeamManager $teamManager
    ) {
        $this->authorization = $authorization;
        $this->finder = $finder;
        $this->teamManager = $teamManager;
    }

    public function getName()
    {
        return 'team';
    }

    /**
     * @param Request $request
     * @param string  $class
     *
     * @return JsonResponse
     */
    public function deleteBulkAction(Request $request, $class)
    {
        $teams = parent::decodeIdsString($request, 'Claroline\TeamBundle\Entity\Team');
        $workspace = 0 < count($teams) ? $teams[0]->getWorkspace() : null;

        $this->teamManager->deleteTeams($teams);

        return new JsonResponse(null, 204);
    }

    /**
     * @EXT\Route(
     *     "/workspace/{workspace}/teams/list",
     *     name="apiv2_team_list"
     * )
     * @EXT\ParamConverter(
     *     "workspace",
     *     class="ClarolineCoreBundle:Workspace\Workspace",
     *     options={"mapping": {"workspace": "uuid"}}
     * )
     *
     * @param Workspace $workspace
     * @param Request   $request
     *
     * @return JsonResponse
     */
    public function teamsListAction(Workspace $workspace, Request $request)
    {
        $params = $request->query->all();

        if (!isset($params['hiddenFilters'])) {
            $params['hiddenFilters'] = [];
        }
        $params['hiddenFilters']['workspace'] = $workspace->getId();
        $data = $this->finder->search('Claroline\TeamBundle\Entity\Team', $params);

        return new JsonResponse($data, 200);
    }

    /**
     * @EXT\Route(
     *     "/team/{team}/register",
     *     name="apiv2_team_register"
     * )
     * @EXT\ParamConverter(
     *     "team",
     *     class="ClarolineTeamBundle:Team",
     *     options={"mapping": {"team": "uuid"}}
     * )
     *
     * @param Team    $team
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function teamRegisterAction(Team $team, Request $request)
    {
        $users = parent::decodeIdsString($request, 'Claroline\CoreBundle\Entity\User');
        $this->teamManager->registerUsersToTeam($team, $users);

        return new JsonResponse(null, 200);
    }

    /**
     * @EXT\Route(
     *     "/team/{team}/unregister",
     *     name="apiv2_team_unregister"
     * )
     * @EXT\ParamConverter(
     *     "team",
     *     class="ClarolineTeamBundle:Team",
     *     options={"mapping": {"team": "uuid"}}
     * )
     *
     * @param Team    $team
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function teamUnregisterAction(Team $team, Request $request)
    {
        $users = parent::decodeIdsString($request, 'Claroline\CoreBundle\Entity\User');
        $this->teamManager->unregisterUsersFromTeam($team, $users);

        return new JsonResponse(null, 200);
    }
}
