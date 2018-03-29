<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Log\Log;
use Claroline\CoreBundle\Entity\Log\LogWidgetConfig;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Widget\WidgetInstance;
use Claroline\CoreBundle\Event\Log\LogCreateDelegateViewEvent;
use Claroline\CoreBundle\Event\Log\LogGenericEvent;
use Claroline\CoreBundle\Event\Log\LogWorkspaceEnterEvent;
use Claroline\CoreBundle\Form\DataTransformer\DateRangeToTextTransformer;
use Claroline\CoreBundle\Library\Utilities\ClaroUtilities;
use JMS\DiExtraBundle\Annotation as DI;
use Pagerfanta\Adapter\DoctrineORMAdapter;
use Pagerfanta\Adapter\FixedAdapter;
use Pagerfanta\Exception\NotValidCurrentPageException;
use Pagerfanta\Pagerfanta;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service("claroline.log.manager")
 */
class LogManager
{
    const LOG_PER_PAGE = 40;
    const CSV_LOG_BATCH = 100;

    private $container;

    /**
     * @var ObjectManager
     */
    private $om;

    /** @var \CLaroline\CoreBundle\Repository\Log\LogRepository $logRepository */
    private $logRepository;

    /** @var FinderProvider */
    private $finder;

    /** @var TranslatorInterface */
    private $translator;

    /** @var ClaroUtilities */
    private $ut;

    /**
     * @DI\InjectParams({
     *     "container"          = @DI\Inject("service_container"),
     *     "objectManager"      = @DI\Inject("claroline.persistence.object_manager"),
     *     "finder"             = @DI\Inject("claroline.api.finder"),
     *     "translator"         = @DI\Inject("translator"),
     *     "ut"                 = @DI\Inject("claroline.utilities.misc")
     * })
     *
     * @param $container
     * @param ObjectManager       $objectManager
     * @param FinderProvider      $finder
     * @param TranslatorInterface $translator
     */
    public function __construct(
        $container,
        ObjectManager $objectManager,
        FinderProvider $finder,
        TranslatorInterface $translator,
        ClaroUtilities $ut
    ) {
        $this->container = $container;
        $this->om = $objectManager;
        $this->logRepository = $objectManager->getRepository('ClarolineCoreBundle:Log\Log');
        $this->finder = $finder;
        $this->translator = $translator;
        $this->ut = $ut;
    }

    public function detach($obj)
    {
        $this->om->detach($obj);
    }

    // New api

    /**
     * Get log by id.
     *
     * @param $id
     *
     * @return null|object
     */
    public function getLog($id)
    {
        return $this->logRepository->findOneBy(['id' => $id]);
    }

    /**
     * Get chart data given a list/array of filters.
     *
     * @param array $finderParams filters for query
     *
     * @return array formatted data to use with chart functions
     */
    public function getChartData(array $finderParams = [])
    {
        // get filters
        $filters = FinderProvider::parseQueryParams($finderParams)['allFilters'];
        $data = $this->logRepository->fetchChartData($filters);
        $minDate = isset($filters['dateLog']) ? $filters['dateLog'] : null;
        $maxDate = isset($filters['toDate']) ? $filters['toDate'] : null;

        return $this->formatDataForChart($data, $minDate, $maxDate);
    }

    /**
     * Given a query params, it exports all logs to a CSV file.
     *
     * @param $query
     *
     * @return bool|resource
     */
    public function exportLogsToCsv($query)
    {
        // Initialize variables
        $query['limit'] = self::CSV_LOG_BATCH;
        $query['page'] = 0;
        $count = 0;
        $total = 0;

        // Prepare CSV file
        $handle = fopen('php://output', 'w+');
        fputcsv($handle, [
            $this->translator->trans('date', [], 'platform'),
            $this->translator->trans('action', [], 'platform'),
            $this->translator->trans('user', [], 'platform'),
            $this->translator->trans('description', [], 'platform'),
        ], ';', '"');

        // Get batched logs
        while ($count === 0 || $count < $total) {
            $logs = $logs = $this->finder->search('Claroline\CoreBundle\Entity\Log\Log', $query, []);
            $total = $logs['totalResults'];
            $count += self::CSV_LOG_BATCH;
            ++$query['page'];

            foreach ($logs['data'] as $log) {
                fputcsv($handle, [
                    $log['dateLog'],
                    $log['action'],
                    $log['doer'] ? $log['doer']['name'] : '',
                    $this->ut->html2Csv($log['description'], true),
                ], ';', '"');
            }

            $this->om->clear('Claroline\CoreBundle\Entity\Log\Log');
        }

        fclose($handle);

        return $handle;
    }

    /**
     * Returns users' actions with their corresponding chart data.
     *
     * @param array $finderParams
     *
     * @return array
     */
    public function getUserActionsList(array $finderParams = [])
    {
        $queryParams = FinderProvider::parseQueryParams($finderParams);
        $page = $queryParams['page'];
        $limit = $queryParams['limit'];
        $allFilters = $queryParams['allFilters'];
        $filters = $queryParams['filters'];
        $sortBy = $queryParams['sortBy'];
        $minDate = isset($filters['dateLog']) ? (new \DateTime($filters['dateLog']))->setTime(0, 0, 0, 0) : null;
        $maxDate = isset($filters['dateTo']) ? (new \DateTime($filters['dateTo']))->setTime(0, 0, 0, 0) : null;

        $totalUsers = intval($this->logRepository->fetchUserActionsList($allFilters, true));
        $userList = $this->logRepository->fetchUserActionsList($allFilters, false, $page, $limit, $sortBy);

        $userData = [];
        foreach ($userList as $userAction) {
            $id = $userAction['doerId'];
            $firstName = $userAction['doerFirstName'];
            $lastName = $userAction['doerLastName'];
            $date = $userAction['date'];
            $total = $userAction['total'];
            if (!isset($userData['u'.$id])) {
                $userData['u'.$id] = [
                    'id' => $id,
                    'doer' => [
                        'id' => $id,
                        'name' => $lastName.' '.$firstName,
                    ],
                    'chartData' => [],
                    'actions' => 0,
                ];
            }
            $userData['u'.$id]['chartData'][] = ['date' => $date, 'total' => floatval($total)];
            $userData['u'.$id]['actions'] += floatval($total);
            $minDate = $minDate === null || $minDate > $date ? clone $date : $minDate;
            $maxDate = $maxDate === null || $maxDate < $date ? clone $date : $maxDate;
        }

        $data = [];
        foreach ($userData as $line) {
            $line['chartData'] = $this->formatDataForChart($line['chartData'], $minDate, $maxDate);
            $data[] = $line;
        }
        usort($data, function ($a, $b) {
            return $a['actions'] - $b['actions'];
        });

        return FinderProvider::formatPaginatedData($data, $totalUsers, $page, $limit, $filters, $sortBy);
    }

    /**
     * Exports users' actions for a given query.
     *
     * @param array $finderParams
     *
     * @return bool|resource
     */
    public function exportUserActionToCsv(array $finderParams = [])
    {
        // Initialize variables
        $queryParams = FinderProvider::parseQueryParams($finderParams);
        $allFilters = $queryParams['allFilters'];
        $sortBy = $queryParams['sortBy'];
        $limit = self::CSV_LOG_BATCH;
        $page = 0;
        $count = 0;
        $total = intval($this->logRepository->fetchUserActionsList($allFilters, true));

        // Prepare CSV file
        $handle = fopen('php://output', 'w+');
        fputcsv($handle, [
            $this->translator->trans('user', [], 'platform'),
            $this->translator->trans('actions', [], 'platform'),
        ], ';', '"');

        // Get batched logs
        while ($count === 0 || $count < $total) {
            $logs = $logs = $this->logRepository->fetchUsersByActionsList($allFilters, false, $page, $limit, $sortBy);
            $count += self::CSV_LOG_BATCH;
            ++$page;

            foreach ($logs as $log) {
                fputcsv($handle, [
                    $log['doerLastName'].' '.$log['doerFirstName'],
                    $log['actions'],
                ], ';', '"');
            }
        }

        fclose($handle);

        return $handle;
    }

    /**
     * Formats raw data to the appropriate charts format.
     *
     * @param array          $data
     * @param \DateTime|null $minDate
     * @param \DateTime|null $maxDate
     *
     * @return array
     */
    private function formatDataForChart(array $data, \DateTime $minDate = null, \DateTime $maxDate = null)
    {
        $prevDate = $minDate;
        $chartData = [];
        $idx = 0;
        foreach ($data as $value) {
            // Fill in with zeros from previous date till this date
            while ($prevDate !== null && $prevDate < $value['date']) {
                $chartData["c${idx}"] = ['xData' => $prevDate->format('Y-m-d\TH:i:s'), 'yData' => 0];
                $prevDate->add(new \DateInterval('P1D'));
                ++$idx;
            }
            $chartData["c${idx}"] = ['xData' => $value['date']->format('Y-m-d\TH:i:s'), 'yData' => floatval($value['total'])];
            $prevDate = $value['date']->add(new \DateInterval('P1D'));
            ++$idx;
        }
        // Fill in with zeros till maxDate
        while ($prevDate !== null && $maxDate !== null && $maxDate >= $prevDate) {
            $chartData["c${idx}"] = ['xData' => $prevDate->format('Y-m-d\TH:i:s'), 'yData' => 0];
            $prevDate->add(new \DateInterval('P1D'));
            ++$idx;
        }

        return $chartData;
    }

    // TODO: Clean old methods after refactoring. Old methods from here and below

    public function getDesktopWidgetList(WidgetInstance $instance)
    {
        $user = $this->container->get('security.token_storage')->getToken()->getUser();

        $hiddenConfigs = $this->om
            ->getRepository('ClarolineCoreBundle:Log\LogHiddenWorkspaceWidgetConfig')
            ->findBy(['user' => $user]);

        $workspaceIds = [];

        foreach ($hiddenConfigs as $hiddenConfig) {
            $workspaceIds[] = $hiddenConfig->getWorkspaceId();
        }

        // Get manager and collaborator workspaces config
        /** @var \Claroline\CoreBundle\Entity\Workspace\Workspace[] $workspaces */
        $workspaces = $this->om
            ->getRepository('ClarolineCoreBundle:Workspace\Workspace')
            ->findByUserAndRoleNamesNotIn($user, ['ROLE_WS_COLLABORATOR', 'ROLE_WS_MANAGER'], $workspaceIds);

        $configs = [];

        if (count($workspaces) > 0) {
            //add this method to the repository @see ligne 68
            $configs = $this->om
                ->getRepository('ClarolineCoreBundle:Log\LogWidgetConfig')->findByWorkspaces($workspaces);
        }

        $defaultInstance = $this->om
            ->getRepository('ClarolineCoreBundle:Widget\WidgetInstance')
            ->findOneBy(
            [
                'widget' => $instance->getWidget(),
                'isAdmin' => true,
                'workspace' => null,
                'user' => null,
                'isDesktop' => false,
            ]
        );

        $defaultConfig = $this->getLogConfig($defaultInstance);

        if ($defaultConfig === null) {
            $defaultConfig = new LogWidgetConfig();
            $defaultConfig->setRestrictions(
                $this->getDefaultWorkspaceConfigRestrictions()
            );
            $defaultConfig->setAmount(5);
        }

        // Complete missing configs
        foreach ($workspaces as $workspace) {
            $config = null;

            for ($i = 0, $countConfigs = count($configs); $i < $countConfigs && $config === null; ++$i) {
                $current = $configs[$i];
                if ($current->getWidgetInstance()->getWorkspace()->getId() === $workspace->getId()) {
                    $config = $current;
                }
            }

            if ($config === null) {
                $config = new LogWidgetConfig();
                $config->copy($defaultConfig);
                $widgetInstance = new WidgetInstance();
                $widgetInstance->setWorkspace($workspace);
                $config->setWidgetInstance($widgetInstance);
                $configs[] = $config;
            }
        }

        // Remove configs which hasAllRestriction
        $configsCleaned = [];
        $events = $this->container->get('claroline.event.manager')
            ->getEvents(LogGenericEvent::DISPLAYED_WORKSPACE);

        foreach ($configs as $config) {
            if ($config->hasAllRestriction($events) === false) {
                $configsCleaned[] = $config;
            }
        }

        $configs = $configsCleaned;

        if (count($configs) === 0) {
            return;
        }

        $desktopConfig = $this->getLogConfig($instance);
        $desktopConfig = $desktopConfig === null ? $defaultConfig : $desktopConfig;
        $query = $this->logRepository->findLogsThroughConfigs($configs, $desktopConfig->getAmount());
        $logs = $query->getResult();
        $chartData = $this->logRepository->countByDayThroughConfigs($configs, $this->getDefaultRange());

        //List item delegation
        $views = $this->renderLogs($logs);

        return [
            'logs' => $logs,
            'listItemViews' => $views,
            'chartData' => $chartData,
            'logAmount' => $desktopConfig->getAmount(),
            'isDesktop' => true,
            'title' => $this->translator->trans(
                'your_workspace_activity_overview',
                [],
                'platform'
            ),
        ];
    }

    public function getWorkspaceWidgetList(WidgetInstance $instance)
    {
        $workspace = $instance->getWorkspace();

        if (!$this->isAllowedToViewLogs($workspace)) {
            return;
        }

        $config = $this->getLogConfig($instance);

        if ($config === null) {
            $defaultConfig = $this->om->getRepository('ClarolineCoreBundle:Widget\WidgetInstance')
                ->findOneBy(['isDesktop' => false, 'isAdmin' => true]);

            $config = new LogWidgetConfig();

            if ($defaultConfig !== null) {
                $config->copy($this->getLogConfig($defaultConfig));
            }

            $config->setRestrictions(
                $this->getDefaultWorkspaceConfigRestrictions()
            );
            $widgetInstance = new WidgetInstance();
            $widgetInstance->setWorkspace($workspace);
            $config->setWidgetInstance($widgetInstance);
        }

        /** @var \Claroline\CoreBundle\Manager\EventManager $eventManager */
        $eventManager = $this->container->get('claroline.event.manager');

        if ($config->hasNoRestriction()) {
            return;
        }

        $query = $this->logRepository->findLogsThroughConfigs([$config], $config->getAmount());
        $logs = $query->getResult();
        $chartData = $this->logRepository->countByDayThroughConfigs([$config], $this->getDefaultRange());

        //List item delegation
        $views = $this->renderLogs($logs);

        $workspaceEvents = $eventManager->getEvents(LogGenericEvent::DISPLAYED_WORKSPACE);

        if ($config->hasAllRestriction(count($workspaceEvents))) {
            $title = $this->translator->trans(
                'recent_all_workspace_activities_overview',
                ['%workspaceName%' => $workspace->getName()],
                'platform'
            );
        } else {
            $title = $this->translator->trans(
                'Overview of recent activities in %workspaceName%',
                ['%workspaceName%' => $workspace->getName()],
                'platform'
            );
        }

        return [
            'logs' => $logs,
            'listItemViews' => $views,
            'chartData' => $chartData,
            'workspace' => $workspace,
            'logAmount' => $config->getAmount(),
            'title' => $title,
            'isDesktop' => false,
        ];
    }

    public function getAdminList($page, $maxResult = -1)
    {
        return $this->getList(
            $page,
            'admin',
            $this->container->get('claroline.form.adminLogFilter'),
            null,
            $maxResult
        );
    }

    public function getWorkspaceList($workspace, $page = null, $maxResult = -1)
    {
        if ($workspace === null) {
            $workspaceIds = $this->getAdminOrCollaboratorWorkspaceIds();
        } else {
            $workspaceIds = [$workspace->getId()];
        }

        $params = $this->getList(
            $page,
            'workspace',
            $this->container->get('claroline.form.workspaceLogFilter'),
            $workspaceIds,
            $maxResult,
            null,
            null
        );
        if ($page !== null) {
            $params['workspace'] = $workspace;
        }

        return $params;
    }

    public function getResourceList($resource, $page = null, $maxResult = -1)
    {
        $resourceNodeIds = [$resource->getResourceNode()->getId()];

        $params = $this->getList(
            $page,
            'workspace',
            $this->container->get('claroline.form.resourceLogFilter'),
            null,
            $maxResult,
            $resourceNodeIds,
            get_class($resource)
        );
        if ($page !== null) {
            $params['_resource'] = $resource;
        }

        return $params;
    }

    public function getList(
        $page,
        $actionsRestriction,
        $logFilterFormType,
        $workspaceIds = null,
        $maxResult = -1,
        $resourceNodeIds = null,
        $resourceClass = null
    ) {
        $dateRangeToTextTransformer = new DateRangeToTextTransformer($this->translator);
        $data = $this->processFormData(
            $actionsRestriction,
            $logFilterFormType,
            $workspaceIds,
            $resourceClass,
            $dateRangeToTextTransformer
        );
        $range = $data['range'];

        $filterForm = $this->container->get('form.factory')->create($logFilterFormType, $data);

        $data['range'] = $dateRangeToTextTransformer->transform($range);
        $filter = urlencode(json_encode($data));

        //Find if action refers to an resource type
        $actionData = $this->getResourceTypeFromAction($data['action']);
        $actionString = $actionData['action'];
        $resourceType = $actionData['resourceType'];

        $query = $this->logRepository->findFilteredLogsQuery(
            $actionString,
            $range,
            $data['user'],
            $actionsRestriction,
            $workspaceIds,
            $maxResult,
            $resourceType,
            $resourceNodeIds,
            $data['group']
        );

        if ($page === null) {
            // Return all results for export
            return [
                'results' => $query->getResult(),
                'listItemViews' => $this->renderLogs($query->getResult()),
            ];
        } else {
            // Return paged results

            // Return paged object for on-screen display
            $adapter = new DoctrineORMAdapter($query);
            $pager = new PagerFanta($adapter);
            $pager->setMaxPerPage(self::LOG_PER_PAGE);

            try {
                $pager->setCurrentPage($page);
            } catch (NotValidCurrentPageException $e) {
                throw new NotFoundHttpException();
            }

            $chartData = $this->logRepository->countByDayFilteredLogs(
                $actionString,
                $range,
                $data['user'],
                $actionsRestriction,
                $workspaceIds,
                false,
                $resourceType,
                $resourceNodeIds,
                $data['group']
            );

            //List item delegation
            $views = $this->renderLogs($pager->getCurrentPageResults());

            return [
                'pager' => $pager,
                'listItemViews' => $views,
                'filter' => $filter,
                'filterForCSV' => $data,
                'filterForm' => $filterForm->createView(),
                'chartData' => $chartData,
                'actionName' => $actionString,
            ];
        }
    }

    public function countByUserListForCSV(
        $actionsRestriction,
        $workspace = null,
        $resource = null
    ) {
        $workspaceIds = ($workspace === null) ? null : [$workspace->getId()];
        $resourceNodeIds = ($resource === null) ? null : [$resource->getResourceNode()->getId()];
        if ($workspaceIds === null && $resourceNodeIds === null) {
            $workspaceIds = $this->getAdminOrCollaboratorWorkspaceIds();
        }
        if ($workspaceIds !== null) {
            $logFilterFormType = $this->container->get('claroline.form.workspaceLogFilter');
            $resourceClass = null;
        } else {
            $logFilterFormType = $this->container->get('claroline.form.resourceLogFilter');
            $resourceClass = get_class($resource);
        }
        $dateRangeToTextTransformer = new DateRangeToTextTransformer($this->translator);
        $data = $this->processFormData($actionsRestriction, $logFilterFormType, $workspaceIds, $resourceClass, $dateRangeToTextTransformer);

        $action = $data['action'];

        $orderBy = 'name';
        if (!empty($data['orderBy'])) {
            $orderBy = $data['orderBy'];
        }
        $order = 'ASC';
        if (!empty($data['order'])) {
            $order = $data['order'];
        }

        //Find if action refers to an resource type
        $actionData = $this->getResourceTypeFromAction($action);
        $actionString = $actionData['action'];
        $resourceType = $actionData['resourceType'];

        $topUsers = $this->logRepository->topUsersByActionQuery(
            $actionString,
            $data['range'],
            $data['user'],
            $actionsRestriction,
            $workspaceIds,
            -1,
            $resourceType,
            $resourceNodeIds,
            false,
            null,
            $orderBy,
            $order
        )->iterate();

        return $topUsers;
    }

    public function countByUserWorkspaceList($workspace, $page)
    {
        if ($workspace === null) {
            $workspaceIds = $this->getAdminOrCollaboratorWorkspaceIds();
        } else {
            $workspaceIds = [$workspace->getId()];
        }

        $params = $this->countByUser(
            $page,
            'workspace',
            $this->container->get('claroline.form.workspaceLogFilter'),
            $workspaceIds,
            null,
            null
        );
        $params['workspace'] = $workspace;

        return $params;
    }

    public function countByUserResourceList($resource, $page)
    {
        $resourceNodeIds = [$resource->getResourceNode()->getId()];

        $params = $this->countByUser(
            $page,
            'workspace',
            $this->container->get('claroline.form.resourceLogFilter'),
            null,
            $resourceNodeIds,
            get_class($resource)
        );
        $params['_resource'] = $resource;

        return $params;
    }

    public function countByUser(
        $page,
        $actionsRestriction,
        $logFilterFormType,
        $workspaceIds = null,
        $resourceNodeIds = null,
        $resourceClass = null
    ) {
        $page = max(1, $page);
        $dateRangeToTextTransformer = new DateRangeToTextTransformer($this->translator);
        $data = $this->processFormData(
            $actionsRestriction,
            $logFilterFormType,
            $workspaceIds,
            $resourceClass,
            $dateRangeToTextTransformer
        );
        $range = $data['range'];
        $orderBy = 'name';
        if (isset($data['orderBy'])) {
            $orderBy = $data['orderBy'];
        }
        $order = 'ASC';
        if (isset($data['order'])) {
            $order = $data['order'];
        }

        $filterForm = $this->container->get('form.factory')->create($logFilterFormType, $data);

        $data['range'] = $dateRangeToTextTransformer->transform($range);

        //Find if action refers to an resource type
        $actionData = $this->getResourceTypeFromAction($data['action']);
        $actionString = $actionData['action'];
        $resourceType = $actionData['resourceType'];

        $nbUsers = $this->logRepository->countTopUsersByAction(
            $actionString,
            $range,
            $data['user'],
            $actionsRestriction,
            $workspaceIds,
            $resourceType,
            $resourceNodeIds,
            false
        );

        $maxResult = self::LOG_PER_PAGE;
        if (($page - 1) * $maxResult > $nbUsers) {
            throw new NotFoundHttpException();
        }

        $topUsers = $this->logRepository->topUsersByActionQuery(
            $actionString,
            $range,
            $data['user'],
            $actionsRestriction,
            $workspaceIds,
            $maxResult,
            $resourceType,
            $resourceNodeIds,
            false,
            $page,
            $orderBy,
            $order
        )->getResult();

        $formatedData = $this->formatTopUserDataArray($topUsers);
        $resultUserList = null;
        if (!empty($formatedData)) {
            $userActionsByDay = $this->logRepository->findUserActionsByDay(
                $actionString,
                $range,
                $actionsRestriction,
                $workspaceIds,
                $resourceType,
                $resourceNodeIds,
                $formatedData['ids']
            );
            $userActionsByDay[] = null;
            $resultUserList = $formatedData['userData'];
            $currentUserId = null;
            $userActionsArray = [];
            foreach ($userActionsByDay as $userAction) {
                if ($userAction === null || ($currentUserId !== null && $currentUserId !== $userAction['id'])) {
                    $resultUserList[$currentUserId]['stats'] = $this
                        ->logRepository
                        ->extractChartData($userActionsArray, $range);
                    $resultUserList[$currentUserId]['maxValue'] = max(array_column($userActionsArray, 'total'));
                    $userActionsArray = [];
                }
                if ($userAction !== null) {
                    $currentUserId = $userAction['id'];
                    $userActionsArray[] = $userAction;
                }
            }
        }
        $adapter = new FixedAdapter($nbUsers, $resultUserList);
        $pager = new PagerFanta($adapter);
        $pager->setMaxPerPage(self::LOG_PER_PAGE);
        $pager->setCurrentPage($page);

        return [
            'pager' => $pager,
            'filter' => $data,
            'filterForm' => $filterForm->createView(),
            'actionName' => $actionString,
            'orderBy' => $orderBy,
            'order' => $order,
        ];
    }

    public function getWorkspaceVisibilityForDesktopWidget(User $user, array $workspaces)
    {
        $workspacesVisibility = [];

        foreach ($workspaces as $workspace) {
            $workspacesVisibility[$workspace->getId()] = true;
        }

        $hiddenWorkspaceConfigs = $this->om
            ->getRepository('ClarolineCoreBundle:Log\LogHiddenWorkspaceWidgetConfig')
            ->findBy(['user' => $user]);

        foreach ($hiddenWorkspaceConfigs as $config) {
            if ($workspacesVisibility[$config->getWorkspaceId()] !== null) {
                $workspacesVisibility[$config->getWorkspaceId()] = false;
            }
        }

        return $workspacesVisibility;
    }

    /**
     * @param null $domain
     *
     * @return array
     */
    public function getDefaultConfigRestrictions($domain = null)
    {
        return $this->container->get('claroline.event.manager')->getEvents($domain);
    }

    /**
     * @return array
     */
    public function getDefaultWorkspaceConfigRestrictions()
    {
        return $this->getDefaultConfigRestrictions(LogGenericEvent::DISPLAYED_WORKSPACE);
    }

    public function getLogConfig(WidgetInstance $config = null)
    {
        return $this->om
            ->getRepository('ClarolineCoreBundle:Log\LogWidgetConfig')
            ->findOneBy(['widgetInstance' => $config]);
    }

    protected function getResourceTypeFromAction($action)
    {
        //Find if action refers to an resource type
        $actionString = $action;
        $resourceType = null;
        preg_match('/\[\[([^\]]+)\]\]/', $action, $matches);
        if (!empty($matches)) {
            $resourceType = $matches[1];
            $actionString = preg_replace('/\[\[([^\]]+)\]\]/', '', $action);
            $actionString = trim($actionString);
        }

        return ['action' => $actionString, 'resourceType' => $resourceType];
    }

    protected function processFormData(
        $actionsRestriction,
        $logFilterFormType,
        $workspaceIds,
        $resourceClass,
        $dateRangeToTextTransformer
    ) {
        $request = $this->container->get('request');
        $data = $request->query->all();

        $action = null;
        $range = null;
        $userSearch = null;

        if (array_key_exists('filter', $data)) {
            $decodeFilter = json_decode(urldecode($data['filter']), true);
            if ($decodeFilter !== null) {
                $action = $decodeFilter['action'];
                $range = $dateRangeToTextTransformer->reverseTransform($decodeFilter['range']);
                $userSearch = $decodeFilter['user'];
                if (!empty($decodeFilter['orderBy'])) {
                    $orderBy = $decodeFilter['orderBy'];
                    $order = $decodeFilter['order'];
                }
                $groupSearch = $decodeFilter['group'];
            }
        } else {
            $dataClass['resourceClass'] = $resourceClass ? $resourceClass : null;
            $tmpForm = $this->container->get('form.factory')->create($logFilterFormType, $dataClass);
            $tmpForm->submit($request);
            $formData = $tmpForm->getData();
            $action = isset($formData['action']) ? $formData['action'] : null;
            if (empty($action) && !empty($request->get('action'))) {
                $action = $request->get('action');
            }
            $range = isset($formData['range']) ? $formData['range'] : null;
            $userSearch = isset($formData['user']) ? $formData['user'] : null;
            $groupSearch = isset($formData['group']) ? $formData['group'] : null;

            if (!empty($data['orderBy'])) {
                $orderBy = $data['orderBy'];
                $order = $data['order'];
            }
        }

        if ($range === null) {
            $range = $this->getDefaultRange();
        }

        if ($action === null && $actionsRestriction === 'workspace' && $workspaceIds !== null) {
            $action = LogWorkspaceEnterEvent::ACTION;
        }

        $data = [];
        $data['action'] = $action;
        $data['range'] = $range;
        $data['user'] = $userSearch;
        $data['group'] = $groupSearch;

        if (isset($orderBy) && isset($order)) {
            $data['orderBy'] = $orderBy;
            $data['order'] = $order;
        }

        if ($resourceClass !== null) {
            $data['resourceClass'] = $resourceClass;
        }

        return $data;
    }

    protected function isAllowedToViewLogs($workspace)
    {
        $security = $this->container->get('security.authorization_checker');

        return $security->isGranted('ROLE_WS_COLLABORATOR_'.$workspace->getGuid())
            || $security->isGranted('ROLE_WS_MANAGER_'.$workspace->getGuid());
    }

    protected function renderLogs($logs)
    {
        //List item delegation
        $views = [];
        foreach ($logs as $log) {
            $eventName = 'create_log_list_item_'.$log->getAction();
            $event = new LogCreateDelegateViewEvent($log);

            /** @var EventDispatcher $eventDispatcher */
            $eventDispatcher = $this->container->get('event_dispatcher');

            if ($eventDispatcher->hasListeners($eventName)) {
                $event = $eventDispatcher->dispatch($eventName, $event);

                $views[$log->getId().''] = $event->getResponseContent();
            }
        }

        return $views;
    }

    protected function getDefaultRange()
    {
        //By default last thirty days :
        $startDate = new \DateTime('now');
        $startDate->setTime(0, 0, 0);
        $startDate->sub(new \DateInterval('P29D')); // P29D means a period of 29 days

        $endDate = new \DateTime('now');
        $endDate->setTime(23, 59, 59);

        return [$startDate->getTimestamp(), $endDate->getTimestamp()];
    }

    protected function getYesterdayRange()
    {
        //By default last thirty days :
        $startDate = new \DateTime('now');
        $startDate->setTime(0, 0, 0);
        $startDate->sub(new \DateInterval('P1D')); // P1D means a period of 1 days

        $endDate = new \DateTime('now');
        $endDate->setTime(23, 59, 59);
        $endDate->sub(new \DateInterval('P1D')); // P1D means a period of 1 days

        return [$startDate->getTimestamp(), $endDate->getTimestamp()];
    }

    protected function getAdminOrCollaboratorWorkspaceIds()
    {
        $workspaceIds = [];
        $loggedUser = $this->container->get('security.token_storage')->getToken()->getUser();
        $workspaceIdsResult = $this->om
            ->getRepository('ClarolineCoreBundle:Workspace\Workspace')
            ->findIdsByUserAndRoleNames($loggedUser, ['ROLE_WS_COLLABORATOR', 'ROLE_WS_MANAGER']);

        foreach ($workspaceIdsResult as $line) {
            $workspaceIds[] = $line['id'];
        }

        return $workspaceIds;
    }

    protected function formatTopUserDataArray($topUsers)
    {
        if ($topUsers === null || count($topUsers) === 0) {
            return [];
        }

        $topUsersFormatedArray = [];
        $topUsersIdList = [];
        foreach ($topUsers as $topUser) {
            $id = $topUser['id'];
            $topUser['stats'] = [];
            $topUsersFormatedArray[$id] = $topUser;
            $topUsersIdList[] = $id;
        }

        return ['ids' => $topUsersIdList, 'userData' => $topUsersFormatedArray];
    }

    public function getDetails(Log $log)
    {
        $details = $log->getDetails();
        $receiverUser = isset($details['receiverUser']) ? $details['receiverUser']['firstName'].' '.$details['receiverUser']['lastName'] : null;
        $receiverGroup = isset($details['receiverGroup']) ? $details['receiverGroup']['name'] : null;
        $role = isset($details['role']) ? $details['role']['name'] : null;
        $workspace = isset($details['workspace']) ? $details['workspace']['name'] : null;
        $resource = $log->getResourceNode() ? $details['resource']['path'] : null;

        return $this->translator->trans(
          'log_'.$log->getAction().'_sentence',
          [
            '%resource%' => $resource,
            '%receiver_user%' => $receiverUser,
            '%receiver_group%' => $receiverGroup,
            '%role%' => $role,
            '%workspace%' => $workspace,
            '%tool%' => $this->translator->trans($log->getToolName(), [], 'tool'),
          ],
          'log'
        );
    }
}
