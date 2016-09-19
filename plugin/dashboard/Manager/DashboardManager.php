<?php

namespace Claroline\DashboardBundle\Manager;

use Claroline\CoreBundle\Entity\Log;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\WorkspaceManager;
use Claroline\DashboardBundle\Entity\Dashboard;
use Doctrine\ORM\EntityManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.dashboard_manager")
 */
class DashboardManager
{
    protected $em;
    protected $workspaceManager;

    /**
     * @DI\InjectParams({
     *      "em"                 = @DI\Inject("doctrine.orm.entity_manager"),
     *      "workspaceManager"   = @DI\Inject("claroline.manager.workspace_manager")
     * })
     *
     * @param ContainerInterface $container
     * @param EntityManager      $em
     **/
    public function __construct(EntityManager $em, WorkspaceManager $workspaceManager)
    {
        $this->em = $em;
        $this->workspaceManager = $workspaceManager;
    }

    public function getRepository()
    {
        return $this->em->getRepository('ClarolineDashboardBundle:Dashboard');
    }

    public function getClaroLogRepository()
    {
        return $this->em->getRepository('ClarolineCoreBundle:Log\Log');
    }

    public function exportDashboard(Dashboard $dashboard)
    {
        return [
          'id' => $dashboard->getId(),
          'name' => $dashboard->getName(),
          'workspace' => $this->workspaceManager->exportWorkspace($dashboard->getWorkspace()),
      ];
    }

    public function create(User $user, $data)
    {
        $dashboard = new Dashboard();
        $dashboard->setCreator($user);
        $dashboard->setName($data['name']);
        $wId = $data['workspace']['id'];
        $dashboard->setWorkspace($this->workspaceManager->getWorkspaceById($wId));
        $this->em->persist($dashboard);
        $this->em->flush();

        return $this->exportDashboard($dashboard);
    }

    /**
     * Compute spent time for each user in a given workspace.
     */
    public function getDashboardWorkspaceSpentTimes(Workspace $workspace, User $user, $all = false)
    {
        $datas = [];
        $ids = [];
        // users ids
        if ($all) {
            // all user(s) belonging to the target workspace (manager and collaborators)...
            $selectUsersIds = 'SELECT DISTINCT cur.user_id FROM claro_user_role cur JOIN claro_role cr ON cr.id = cur.role_id  WHERE cr.workspace_id = '.$workspace->getId();
            $idStmt = $this->em->getConnection()->prepare($selectUsersIds);
            $idStmt->execute();
            $idResults = $idStmt->fetchAll();
            foreach ($idResults as $result) {
                $ids[] = $result['user_id'];
            }
        } else {
            // only the current user
            $ids[] = $user->getId();
        }

        // for each user (ie user ids) -> get 'workspace-enter' events for the given workspace order results by date ASC
        foreach ($ids as $id) {
            $userSqlSelect = 'SELECT first_name, last_name FROM claro_user WHERE id = '.$id;
            $userSqlSelectStmt = $this->em->getConnection()->prepare($userSqlSelect);
            $userSqlSelectStmt->execute();
            $userData = $userSqlSelectStmt->fetch();

            // select all "workspace-enter" actions for the given user and workspace
            $selectAllEnterEventsOnThisWorkspace = 'SELECT DISTINCT date_log FROM claro_log WHERE workspace_id = '.$workspace->getId().' AND action = "workspace-enter" AND doer_id ='.$id.' ORDER BY date_log ASC';
            $selectAllEnterEventsOnThisWorkspaceStmt = $this->em->getConnection()->prepare($selectAllEnterEventsOnThisWorkspace);
            $selectAllEnterEventsOnThisWorkspaceStmt->execute();
            $enterOnThisWorksapceDatesResults = $selectAllEnterEventsOnThisWorkspaceStmt->fetchAll();
            $enterOnThisWorksapceDates = [];
            foreach ($enterOnThisWorksapceDatesResults as $resultDateTime) {
                $enterOnThisWorksapceDates[] = $resultDateTime['date_log'];
            }

            $time = 0; // final connection time in seconds
            // foreach "enter on this workspace" datetime
            foreach ($enterOnThisWorksapceDates as $dateTime) {
                $countedEventsIds = [];
                // select the first next enter event on another workspace (ie WHERE date_log > $dateTime AND date_log < $nextDateTime order by date_log ASC LIMIT 1)
                $sql = 'SELECT id, date_log FROM claro_log WHERE action = "workspace-enter"';
                $sql .= ' AND date_log > "'.$dateTime.'" AND doer_id = '.$id;
                $countedEventIdsLength = count($countedEventsIds);
                if ($countedEventIdsLength > 0) {
                    $sql .= ' AND id NOT IN ( ';
                    for ($i = 0; $i < $countedEventIdsLength; ++$i) {
                        $sql .= $id;
                        if ($i < $countedEventIdsLength - 1) {
                            $sql .= ',';
                        }
                    }
                    $sql .= ' )';
                }

                $sql .= ' ORDER BY date_log ASC LIMIT 1';
                $stmt = $this->em->getConnection()->prepare($sql);
                $stmt->execute();
                $result = $stmt->fetchAll();

                if (count($result) > 0) {
                    $t1 = strtotime($dateTime);
                    $t2 = strtotime($result[0]['date_log']);
                    $seconds = $t2 - $t1;
                        // add time only if bewteen 30s and 2 hours <= totally arbitrary !
                        if ($seconds > 30 && ($seconds / 60) <= 120) {
                            $time += $seconds;
                        }
                    $countedEventsIds[] = $result[0]['id'];
                }
            }

            $datas[] = [
              'user' => [
                'id' => $id,
                'firstName' => $userData['first_name'],
                'lastName' => $userData['last_name'],
              ],
              'time' => $time,
            ];
        }

        return $datas;
    }

    public function getAll(User $user)
    {
        $result = [];
        $dashboards = $this->getRepository()->findBy(['creator' => $user]);
        foreach ($dashboards as $dashboard) {
            $result[] = $this->exportDashboard($dashboard);
        }

        return $result;
    }
}
