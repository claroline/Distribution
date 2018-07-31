<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\TeamBundle\Controller;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Library\Security\Token\ViewAsToken;
use Claroline\TeamBundle\Entity\Team;
use Claroline\TeamBundle\Entity\WorkspaceTeamParameters;
use Claroline\TeamBundle\Form\MultipleTeamsType;
use Claroline\TeamBundle\Form\TeamEditType;
use Claroline\TeamBundle\Form\TeamParamsType;
use Claroline\TeamBundle\Form\TeamType;
use Claroline\TeamBundle\Manager\TeamManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class TeamController extends Controller
{
    private $formFactory;
    private $httpKernel;
    private $request;
    private $router;
    private $authorization;
    private $teamManager;
    private $tokenStorage;

    /**
     * @DI\InjectParams({
     *     "formFactory"     = @DI\Inject("form.factory"),
     *     "httpKernel"      = @DI\Inject("http_kernel"),
     *     "requestStack"    = @DI\Inject("request_stack"),
     *     "router"          = @DI\Inject("router"),
     *     "authorization"   = @DI\Inject("security.authorization_checker"),
     *     "teamManager"     = @DI\Inject("claroline.manager.team_manager"),
     *     "tokenStorage"    = @DI\Inject("security.token_storage")
     * })
     */
    public function __construct(
        FormFactory $formFactory,
        HttpKernelInterface $httpKernel,
        RequestStack $requestStack,
        UrlGeneratorInterface $router,
        AuthorizationCheckerInterface $authorization,
        TeamManager $teamManager,
        TokenStorageInterface $tokenStorage
    ) {
        $this->formFactory = $formFactory;
        $this->httpKernel = $httpKernel;
        $this->request = $requestStack->getCurrentRequest();
        $this->router = $router;
        $this->authorization = $authorization;
        $this->teamManager = $teamManager;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @EXT\Route(
     *     "/workspace/{workspace}/team/manager/menu/ordered/by/{orderedBy}/order/{order}",
     *     name="claro_team_manager_menu",
     *     defaults={"orderedBy"="name","order"="ASC"}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template()
     *
     * @param Workspace $workspace
     * @param User      $user
     */
    public function managerMenuAction(Workspace $workspace, User $user, $orderedBy = 'name', $order = 'ASC')
    {
        $this->checkWorkspaceManager($workspace, $user);
        $params = $this->teamManager->getParametersByWorkspace($workspace);

        if (is_null($params)) {
            $params = $this->teamManager->createWorkspaceTeamParameters($workspace);
        }
        $teams = $this->teamManager->getTeamsByWorkspace($workspace, $orderedBy, $order);
        $teamsWithUsers = $this->teamManager->getTeamsWithUsersByWorkspace($workspace);
        $nbUsers = [];

        foreach ($teamsWithUsers as $teamWithUsers) {
            $nbUsers[$teamWithUsers['team']->getId()] = $teamWithUsers['nb_users'];
        }

        return [
            'workspace' => $workspace,
            'user' => $user,
            'teams' => $teams,
            'orderedBy' => $orderedBy,
            'order' => $order,
            'nbUsers' => $nbUsers,
            'params' => $params,
        ];
    }

    /**
     * @EXT\Route(
     *     "/workspace/{workspace}/team/user/menu/ordered/by/{orderedBy}/order/{order}",
     *     name="claro_team_user_menu",
     *     defaults={"orderedBy"="name","order"="ASC"},
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template()
     *
     * @param Workspace $workspace
     * @param User      $user
     */
    public function userMenuAction(Workspace $workspace, User $user, $orderedBy = 'name', $order = 'ASC')
    {
        $this->checkToolAccess($workspace);
        $params = $this->teamManager->getParametersByWorkspace($workspace);

        if (is_null($params)) {
            $params = $this->teamManager->createWorkspaceTeamParameters($workspace);
        }
        $userTeams = $this->teamManager->getTeamsByUserAndWorkspace($user, $workspace);
        $teams = $this->teamManager->getTeamsWithExclusionsByWorkspace(
            $workspace,
            $userTeams,
            $orderedBy,
            $order
        );
        $teamsWithUsers = $this->teamManager->getTeamsWithUsersByWorkspace($workspace);
        $nbUsers = [];

        foreach ($teamsWithUsers as $teamWithUsers) {
            $nbUsers[$teamWithUsers['team']->getId()] = $teamWithUsers['nb_users'];
        }

        return [
            'workspace' => $workspace,
            'user' => $user,
            'userTeams' => $userTeams,
            'teams' => $teams,
            'orderedBy' => $orderedBy,
            'order' => $order,
            'nbUsers' => $nbUsers,
            'params' => $params,
            'nbTeams' => count($userTeams),
        ];
    }

    /**
     * @EXT\Route(
     *     "/team/{team}/self/register/user",
     *     name="claro_team_self_register_user",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function selfRegisterUserToTeamAction(Team $team, User $user)
    {
        $workspace = $team->getWorkspace();
        $this->checkToolAccess($workspace);
        $params = $this->teamManager->getParametersByWorkspace($workspace);
        $maxUsers = $team->getMaxUsers();
        $full = !is_null($maxUsers) && (count($team->getUsers()->toArray()) >= $maxUsers);
        $nbAllowedTeams = $params->getMaxTeams();
        $userTeams = $this->teamManager->getTeamsByUserAndWorkspace($user, $workspace);
        $nbTeams = count($userTeams);
        $nbAllowed = is_null($nbAllowedTeams) || ($nbTeams < $nbAllowedTeams);

        if ($team->isSelfRegistration() && !$full && $nbAllowed) {
            $this->teamManager->registerUserToTeam($team, $user);
            $token = new UsernamePasswordToken($user, $user->getPassword(), 'main', $user->getRoles());
            $this->tokenStorage->setToken($token);
        }

        return new Response('success', 200);
    }

    private function checkToolAccess(Workspace $workspace)
    {
        if (!$this->authorization->isGranted('claroline_team_tool', $workspace)) {
            throw new AccessDeniedException();
        }
    }
}
