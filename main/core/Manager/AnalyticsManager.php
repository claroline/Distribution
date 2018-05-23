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

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Event\Log\LogResourceExportEvent;
use Claroline\CoreBundle\Event\Log\LogResourceReadEvent;
use Claroline\CoreBundle\Event\Log\LogUserLoginEvent;
use Claroline\CoreBundle\Event\Log\LogWorkspaceToolReadEvent;
use Claroline\CoreBundle\Repository\Log\LogRepository;
use Claroline\CoreBundle\Repository\ResourceNodeRepository;
use Claroline\CoreBundle\Repository\ResourceTypeRepository;
use Claroline\CoreBundle\Repository\UserRepository;
use Claroline\CoreBundle\Repository\WorkspaceRepository;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.analytics_manager")
 */
class AnalyticsManager
{
    /** @var ResourceNodeRepository */
    private $resourceRepo;
    /** @var ResourceTypeRepository */
    private $resourceTypeRepo;
    /** @var UserRepository */
    private $userRepo;
    /** @var WorkspaceRepository */
    private $workspaceRepo;
    /** @var LogRepository */
    private $logRepository;
    /** @var LogManager */
    private $logManager;

    /**
     * @DI\InjectParams({
     *     "objectManager"  = @DI\Inject("claroline.persistence.object_manager"),
     *     "logManager"     = @DI\Inject("claroline.log.manager")
     * })
     */
    public function __construct(
        ObjectManager $objectManager,
        LogManager $logManager
    ) {
        $this->om = $objectManager;
        $this->logManager = $logManager;
        $this->resourceRepo = $objectManager->getRepository('ClarolineCoreBundle:Resource\ResourceNode');
        $this->resourceTypeRepo = $objectManager->getRepository('ClarolineCoreBundle:Resource\ResourceType');
        $this->userRepo = $objectManager->getRepository('ClarolineCoreBundle:User');
        $this->workspaceRepo = $objectManager->getRepository('ClarolineCoreBundle:Workspace\Workspace');
        $this->logRepository = $objectManager->getRepository('ClarolineCoreBundle:Log\Log');
    }

    public function getDefaultRange()
    {
        //By default last thirty days :
        $startDate = new \DateTime('now');
        $startDate->setTime(0, 0, 0);
        $startDate->sub(new \DateInterval('P30D')); // P29D means a period of 29 days

        $endDate = new \DateTime('now');
        $endDate->setTime(23, 59, 59);

        return [$startDate->getTimestamp(), $endDate->getTimestamp()];
    }

    public function getYesterdayRange()
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

    public function getWorkspaceResourceTypesCount(Workspace $workspace)
    {
        $resourceTypes = $this->resourceTypeRepo->countResourcesByType($workspace);
        $chartData = [];
        foreach ($resourceTypes as $type) {
            $chartData[] = [
                'xData' => $type['name'],
                'yData' => $type['total'],
            ];
        }

        return $chartData;
    }

    public function getDailyActions(array $finderParams = [])
    {
        return $this->logManager->getChartData($this->formatQueryParams($finderParams));
    }

    private function formatQueryParams(array $finderParams = [])
    {
        $filters = isset($finderParams['filters']) ? $finderParams['filters'] : [];
        $hiddenFilters = isset($finderParams['hiddenFilters']) ? $finderParams['hiddenFilters'] : [];
        // Default 30 days analytics
        if (!isset($filters['dateLog'])) {
            $date = new \DateTime('now');
            $date->setTime(0, 0, 0);
            $date->sub(new \DateInterval('P30D'));
            $filters['dateLog'] = clone $date;
        }

        if (!isset($filters['dateTo'])) {
            $date = clone $filters['dateLog'];
            $date->add(new \DateInterval('P30D'));
            $filters['dateTo'] = clone $date;
        }

        return [
            'filters' => $filters,
            'hiddenFilters' => $hiddenFilters,
        ];
    }

    // TODO Remove any old methods not required after refactoring

    public function getDailyActionNumberForDateRange(
        $range = null,
        $action = null,
        $unique = false,
        $workspaceIds = null
    ) {
        if (null === $action) {
            $action = '';
        }

        if (null === $range) {
            $range = $this->getDefaultRange();
        }

        $userSearch = null;
        $actionRestriction = null;
        $chartData = $this->logRepository->countByDayFilteredLogs(
            $action,
            $range,
            $userSearch,
            $actionRestriction,
            $workspaceIds,
            $unique
        );

        return $chartData;
    }

    public function getTopByCriteria($range = null, $topType = null, $max = 30)
    {
        if (null === $topType) {
            $topType = 'top_users_connections';
        }
        $listData = [];

        switch ($topType) {
            case 'top_extension':
                $listData = $this->resourceRepo->findMimeTypesWithMostResources($max);
                break;
            case 'top_workspaces_resources':
                $listData = $this->workspaceRepo->findWorkspacesWithMostResources($max);
                break;
            case 'top_workspaces_connections':
                $listData = $this->topWSByAction($range, LogWorkspaceToolReadEvent::ACTION, $max);
                break;
            case 'top_resources_views':
                $listData = $this->topResourcesByAction($range, LogResourceReadEvent::ACTION, $max);
                break;
            case 'top_resources_downloads':
                $listData = $this->topResourcesByAction($range, LogResourceExportEvent::ACTION, $max);
                break;
            case 'top_users_connections':
                $listData = $this->topUsersByAction($range, LogUserLoginEvent::ACTION, $max);
                break;
            case 'top_users_workspaces_enrolled':
                $listData = $this->userRepo->findUsersEnrolledInMostWorkspaces($max);
                break;
            case 'top_users_workspaces_owners':
                $listData = $this->userRepo->findUsersOwnersOfMostWorkspaces($max);
                break;
            case 'top_media_views':
                $listData = $this->topMediaByAction($range, LogResourceReadEvent::ACTION, $max);
                break;
        }

        return $listData;
    }

    public function topWSByAction($range = null, $action = null, $max = -1)
    {
        if (null === $range) {
            $range = $this->getYesterdayRange();
        }

        if (null === $action) {
            $action = LogWorkspaceToolReadEvent::ACTION;
        }

        $resultData = $this->logRepository->topWSByAction($range, $action, $max);

        return $resultData;
    }

    public function topMediaByAction($range = null, $action = null, $max = -1)
    {
        if (null === $range) {
            $range = $this->getYesterdayRange();
        }

        if (null === $action) {
            $action = LogResourceReadEvent::ACTION;
        }

        $resultData = $this->logRepository->topMediaByAction($range, $action, $max);

        return $resultData;
    }

    public function topResourcesByAction($range = null, $action = null, $max = -1)
    {
        if (null === $range) {
            $range = $this->getYesterdayRange();
        }

        if (null === $action) {
            $action = LogResourceReadEvent::ACTION;
        }

        $resultData = $this->logRepository->topResourcesByAction($range, $action, $max);

        return $resultData;
    }

    public function topUsersByAction($range = null, $action = null, $max = -1)
    {
        if (null === $range) {
            $range = $this->getYesterdayRange();
        }

        if (null === $action) {
            $action = LogUserLoginEvent::ACTION;
        }

        $resultData = $this->logRepository->topUsersByAction($range, $action, $max);

        return $resultData;
    }

    /**
     * Retrieve user who connected at least one time on the application.
     *
     * @return mixed
     */
    public function getActiveUsers()
    {
        $resultData = $this->logRepository->activeUsers();

        return $resultData;
    }

    /**
     * Retrieve users who connected at least one time on the application in the given time frame.
     */
    public function getActiveUsersForDateRange($range)
    {
        $resultData = $this->logRepository->activeUsersByDateRange($range);

        return $resultData;
    }
}
