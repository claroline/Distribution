<?php

namespace Claroline\AnalyticsBundle\Controller\Administration;

use Claroline\AnalyticsBundle\Manager\AnalyticsManager;
use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Controller\AbstractSecurityController;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\Log\LogGenericEvent;
use Claroline\CoreBundle\Manager\EventManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Role\Role;

/**
 * @EXT\Route("/tools/admin/analytics")
 */
class AnalyticsController extends AbstractSecurityController
{
    /** @var TokenStorageInterface */
    private $tokenStorage;

    /** @var AnalyticsManager */
    private $analyticsManager;

    /** @var EventManager */
    private $eventManager;

    /** @var User */
    private $loggedUser;

    /** @var SerializerProvider */
    private $serializer;

    /** @var FinderProvider */
    private $finder;

    /**
     * AnalyticsController constructor.
     *
     * @param TokenStorageInterface $tokenStorage
     * @param SerializerProvider    $serializer
     * @param FinderProvider        $finder
     * @param AnalyticsManager      $analyticsManager
     * @param EventManager          $eventManager
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        SerializerProvider $serializer,
        FinderProvider $finder,
        AnalyticsManager $analyticsManager,
        EventManager $eventManager
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->loggedUser = $tokenStorage->getToken()->getUser();
        $this->serializer = $serializer;
        $this->finder = $finder;
        $this->analyticsManager = $analyticsManager;
        $this->eventManager = $eventManager;
    }

    /**
     * @EXT\Route("", name="apiv2_admin_tool_analytics_overview")
     * @EXT\Method("GET")
     *
     * @return JsonResponse
     */
    public function overviewAction()
    {
        $this->canOpenAdminTool('dashboard');

        $query = $this->addOrganizationFilter([]);
        $query['limit'] = 5;
        $mostViewedWS = $this->analyticsManager->topWorkspaceByAction($query);
        $mostViewedMedia = $this->analyticsManager->topResourcesByAction($query, true);
        $query['filters']['action'] = 'resource-export';
        $mostDownloadedResources = $this->analyticsManager->topResourcesByAction($query);

        return new JsonResponse([
            'top' => [
                'workspace' => $mostViewedWS,
                'media' => $mostViewedMedia,
                'download' => $mostDownloadedResources,
            ],
        ]);
    }

    /**
     * @EXT\Route("/audience", name="apiv2_admin_tool_analytics_audience")
     * @EXT\Method("GET")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function audienceAction(Request $request)
    {
        $this->canOpenAdminTool('dashboard');
        $query = $this->addOrganizationFilter($request->query->all());
        $query['hiddenFilters']['action'] = 'user-login';
        $connections = $this->analyticsManager->getDailyActions($query);
        $totalConnections = array_sum(array_map(function ($item) {
            return $item['yData'];
        }, $connections));
        $activeUsersForPeriod = $this->analyticsManager->countActiveUsers($query, true);
        $activeUsers = $this->analyticsManager->countActiveUsers();
        $dates = array_column($connections, 'xData');

        return new JsonResponse([
            'activity' => [
                'daily' => $connections,
                'total' => $totalConnections,
            ],
            'users' => [
                'all' => $activeUsers,
                'period' => $activeUsersForPeriod,
            ],
            'filters' => [
                'dateLog' => $dates[0],
                'dateTo' => $dates[sizeof($connections) - 1],
                'unique' => isset($query['filters']['unique']) ?
                    filter_var($query['filters']['unique'], FILTER_VALIDATE_BOOLEAN) :
                    false,
            ],
        ]);
    }

    /**
     * @EXT\Route("/top", name="apiv2_admin_tool_analytics_top_actions")
     * @EXT\Method("GET")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function topActionsAction(Request $request)
    {
        $this->canOpenAdminTool('dashboard');
        $query = $this->addOrganizationFilter($request->query->all());

        return new JsonResponse($this->analyticsManager->getTopActions($query));
    }

    /**
     * @EXT\Route("/count", name="apiv2_admin_tool_analytics_ount")
     *
     * @return JsonResponse
     */
    public function countAction()
    {
        $this->canOpenAdminTool('dashboard');

        $organizations = $this->getLoggedUserOrganizations();
        $wsCount = $this->analyticsManager->countNonPersonalWorkspaces($organizations);

        // TODO : finish

        return new JsonResponse([
            'workspaces' => $wsCount,
            'resources' => 0,
            'users' => 0,
            'roles' => 0,
            'groups' => 0,
            'organizations' => 0,
        ]);
    }

    /**
     * @EXT\Route("/activity", name="apiv2_admin_tool_analytics_activity")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function activityAction(Request $request)
    {
        $this->canOpenAdminTool('dashboard');

        $query = $this->addOrganizationFilter($request->query->all());

        return new JsonResponse([
            'actions' => $this->analyticsManager->getDailyActions($query),
            'visitors' => $this->analyticsManager->getDailyActions(array_merge_recursive($query, [
                'hiddenFilters' => [
                    'action' => 'user-login',
                    'unique' => true,
                ],
            ])),
        ]);
    }

    /**
     * @EXT\Route("/actions", name="apiv2_admin_tool_analytics_actions")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function actionsAction(Request $request)
    {
        $this->canOpenAdminTool('dashboard');

        $query = $this->addOrganizationFilter($request->query->all());

        return new JsonResponse([
            'types' => $this->eventManager->getEventsForApiFilter(LogGenericEvent::DISPLAYED_ADMIN),
            'actions' => $this->analyticsManager->getDailyActions($query),
        ]);
    }

    /**
     * @EXT\Route("/time", name="apiv2_admin_tool_analytics_time")
     *
     * @return JsonResponse
     */
    public function connectionTimeAction()
    {
        $this->canOpenAdminTool('dashboard');

        return new JsonResponse([
            'total' => [],
            'average' => [],
        ]);
    }

    /**
     * @EXT\Route("/resources", name="apiv2_admin_tool_analytics_resources")
     *
     * @return JsonResponse
     */
    public function resourcesAction()
    {
        $this->canOpenAdminTool('dashboard');

        return new JsonResponse(
            $this->analyticsManager->getResourceTypesCount(null, $this->getLoggedUserOrganizations())
        );
    }

    /**
     * @EXT\Route("/resources/top", name="apiv2_admin_tool_analytics_top_resources")
     *
     * @return JsonResponse
     */
    public function topResourcesAction()
    {
        $this->canOpenAdminTool('dashboard');

        $options = [
            'page' => 0,
            'limit' => 10,
            'sortBy' => '-viewsCount',
            'hiddenFilters' => [
                'published' => true,
                'resourceTypeBlacklist' => ['directory'],
            ],
        ];

        $roles = array_map(function (Role $role) {
            return $role->getRole();
        }, $this->tokenStorage->getToken()->getRoles());

        if (!in_array('ROLE_ADMIN', $roles)) {
            $options['hiddenFilters']['roles'] = $roles;
        }

        return new JsonResponse(
            $this->finder->search(ResourceNode::class, $options)['data']
        );
    }

    /**
     * @EXT\Route("/users", name="apiv2_admin_tool_analytics_users")
     *
     * @return JsonResponse
     */
    public function usersAction()
    {
        $this->canOpenAdminTool('dashboard');

        return new JsonResponse(
            $this->analyticsManager->userRolesData($this->getLoggedUserOrganizations())
        );
    }

    /**
     * @EXT\Route("/users/top", name="apiv2_admin_tool_analytics_top_users")
     *
     * @return JsonResponse
     */
    public function topUsersAction()
    {
        $this->canOpenAdminTool('dashboard');

        return new JsonResponse([]);
    }

    /**
     * @EXT\Route("/latest", name="apiv2_admin_tool_analytics_latest")
     *
     * @return JsonResponse
     */
    public function latestActionsAction()
    {
        return new JsonResponse([]);
    }

    private function addOrganizationFilter($query)
    {
        $this->canOpenAdminTool('dashboard');

        $organizations = $this->getLoggedUserOrganizations();
        if (null !== $organizations) {
            $query['hiddenFilters']['organization'] = $this->loggedUser->getAdministratedOrganizations();
        }

        return $query;
    }

    private function getLoggedUserOrganizations()
    {
        if (!$this->loggedUser->hasRole('ROLE_ADMIN')) {
            return $this->loggedUser->getAdministratedOrganizations();
        }

        return null;
    }
}
