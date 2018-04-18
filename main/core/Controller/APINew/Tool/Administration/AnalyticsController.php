<?php

namespace Claroline\CoreBundle\Controller\APINew\Tool\Administration;

use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\Manager\AnalyticsManager;
use Claroline\CoreBundle\Manager\LogManager;
use Claroline\CoreBundle\Manager\UserManager;
use Claroline\CoreBundle\Manager\WidgetManager;
use Claroline\CoreBundle\Manager\WorkspaceManager;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route("/tools/admin/analytics", name="admin_tool_analytics")
 * @SEC\PreAuthorize("canOpenAdminTool('platform_analytics')")
 */
class AnalyticsController
{
    /** @var LogManager */
    private $logManager;

    /** @var AnalyticsManager */
    private $analyticsManager;

    /** @var WorkspaceManager */
    private $workspaceManager;

    /** @var UserManager */
    private $userManager;

    /** @var WidgetManager */
    private $widgetManager;

    /** @var StrictDispatcher */
    private $dispatcher;

    /**
     * @DI\InjectParams({
     *     "logManager"             = @DI\Inject("claroline.log.manager"),
     *     "analyticsManager"       = @DI\Inject("claroline.manager.analytics_manager"),
     *     "workspaceManager"       = @DI\Inject("claroline.manager.workspace_manager"),
     *     "userManager"            = @DI\Inject("claroline.manager.user_manager"),
     *     "widgetManager"          = @DI\Inject("claroline.manager.widget_manager"),
     *     "dispatcher"             = @DI\Inject("claroline.event.event_dispatcher")
     * })
     *
     * LogController constructor.
     *
     * @param LogManager       $logManager
     * @param AnalyticsManager $analyticsManager
     */
    public function __construct(
        LogManager $logManager,
        AnalyticsManager $analyticsManager,
        WorkspaceManager $workspaceManager,
        UserManager $userManager,
        WidgetManager $widgetManager,
        StrictDispatcher $dispatcher
    ) {
        $this->logManager = $logManager;
        $this->analyticsManager = $analyticsManager;
        $this->workspaceManager = $workspaceManager;
        $this->userManager = $userManager;
        $this->widgetManager = $widgetManager;
        $this->dispatcher = $dispatcher;
    }

    /**
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/", name="apiv2_admin_tool_analytics_overview")
     * @Method("GET")
     */
    public function overviewAction()
    {
        $lastMonthActions = $this->analyticsManager->getDailyActions();
        $mostViewedWS = $this->analyticsManager->topWorkspaceByAction(['limit' => 5]);
        $mostViewedMedia = $this->analyticsManager->topResourcesByAction(['limit' => 5], true);
        $mostDownloadedResources = $this->analyticsManager->topResourcesByAction([
            'limit' => 5,
            'filters' => [
                'action' => 'resource-export',
            ],
        ]);
        $usersCount = $this->userManager->countUsersForPlatformRoles();

        return new JsonResponse([
            'activity' => $lastMonthActions,
            'top' => [
                'workspace' => $mostViewedWS,
                'media' => $mostViewedMedia,
                'download' => $mostDownloadedResources,
            ],
            'users' => $usersCount,
        ]);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/audience", name="apiv2_admin_tool_analytics_audience")
     * @Method("GET")
     */
    public function audienceAction()
    {
        $actionsForRange = $this->analyticsManager
            ->getDailyActionNumberForDateRange($this->analyticsManager->getDefaultRange(), 'user_login', false);

        $activeUsersForDateRange = $this->analyticsManager
            ->getActiveUsersForDateRange($this->analyticsManager->getDefaultRange());

        $connections = $actionsForRange;
        $countConnectionsForDateRange = array_sum(array_map(function ($item) {
            return $item[1];
        }, $connections));
        $activeUsers = $this->analyticsManager->getActiveUsers();

        return new JsonResponse([
            'activity' => [
                'daily' => $connections,
                'total' => $countConnectionsForDateRange,
            ],
            'users' => [
                'all' => $activeUsers,
                'period' => $activeUsersForDateRange,
            ],
        ]);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/resources", name="apiv2_admin_tool_analytics_resources")
     * @Method("GET")
     */
    public function resourcesAction()
    {
        $wsCount = $this->workspaceManager->getNbNonPersonalWorkspaces();
        $resourceCount = $this->analyticsManager->getResourceTypesCount();

        /** @var \Claroline\CoreBundle\Event\Analytics\PlatformContentItemEvent $event */
        $event = $this->dispatcher->dispatch(
            'administration_analytics_platform_content_item_add',
            'Analytics\PlatformContentItem'
        );

        return new JsonResponse([
            'resources' => $resourceCount,
            'workspaces' => $wsCount,
            'other' => $event->getItems(),
        ]);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/widgets", name="apiv2_admin_tool_analytics_widgets")
     * @Method("GET")
     */
    public function widgetsAction()
    {
        $wiCount = $this->widgetManager->getNbWidgetInstances();
        $wiwCount = $this->widgetManager->getNbWorkspaceWidgetInstances();
        $widCount = $this->widgetManager->getNbDesktopWidgetInstances();
        $wList = $this->widgetManager->countWidgetsByType();

        return new JsonResponse([
            'all' => $wiCount,
            'workspace' => $wiwCount,
            'desktop' => $widCount,
            'list' => $wList,
        ]);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/top", name="apiv2_admin_tool_analytics_top_actions")
     * @Method("GET")
     */
    public function topActionsAction(Request $request)
    {
        $range = $this->analyticsManager->getDefaultRange();
        $topType = $request->query->get('type');
        $max = $request->query->get('max');

        $listData = $this->analyticsManager->getTopByCriteria($range, $topType, $max);

        return new JsonResponse($listData);
    }
}
