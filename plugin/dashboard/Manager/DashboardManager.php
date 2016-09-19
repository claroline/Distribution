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
     * here goes all the logic to compute the spent times
     * - true if we want to calculate time for all users in the workspace (except for the given USER)
     * - false if we only want the time spent in the worksapce for the given user.
     */
    public function getDashboardWorkspaceSpentTimes(Workspace $workspace, User $user, $all = false)
    {
        $datas = [];

        $ids = [];
        // get other users id
        if ($all) {
            $selectUsersIds = 'SELECT DISTINCT doer_id FROM claro_log WHERE workspace_id = '.$workspace->getId().' AND action = "workspace-enter"';
            $idStmt = $this->em->getConnection()->prepare($selectUsersIds);
            $idStmt->execute();
            $idResults = $idStmt->fetchAll();
            foreach ($idResults as $result) {
                $ids[] = $result['doer_id'];
            }
        } else {
            $ids[] = $user->getId();
        }

        // for each user (ie user ids) -> get 'workspace-enter' events for the given workspace order results by date ASC
        foreach ($ids as $id) {
            $userSqlSelect = 'SELECT first_name, last_name FROM claro_user WHERE id = '.$id;
            $userSqlSelectStmt = $this->em->getConnection()->prepare($userSqlSelect);
            $userSqlSelectStmt->execute();
            $userData = $userSqlSelectStmt->fetch();

            $sqlDates = 'SELECT DISTINCT short_date_log FROM claro_log WHERE workspace_id = '.$workspace->getId().' AND action = "workspace-enter" AND doer_id ='.$id.' ORDER BY date_log ASC';
            $datesStmt = $this->em->getConnection()->prepare($sqlDates);
            $datesStmt->execute();
            $datesResults = $datesStmt->fetchAll();

            $dates = [];
            foreach ($datesResults as $value) {
                $dates[] = $value['short_date_log'];
            }

            $time = 0;
            // now for each date
            foreach ($dates as $date) {
                // get the 'workspace-enter' events for this date for this user and for other workspace
                $sql = 'SELECT date_log FROM claro_log WHERE action = "workspace-enter" AND doer_id ='.$id.' AND short_date_log = "'.$date.'" ORDER BY date_log DESC';

                $stmt = $this->em->getConnection()->prepare($sql);
                $stmt->execute();
                $results = $stmt->fetchAll();

                $datesLogs = [];
                foreach ($results as $result) {
                    $datesLogs[] = $result['date_log'];
                }
                $length = count($datesLogs);
                if ($length > 1) {
                    for ($index = 0; $index < $length; ++$index) {
                        // compute time diff between current and next (if defined)
                      if (isset($datesLogs[$index + 1])) {
                          $t1 = strtotime($datesLogs[$index]);
                          $t2 = strtotime($datesLogs[$index + 1]);
                          $seconds = $t1 - $t2;
                          // add time only if bewteen 5s and 2 hours
                          if ($seconds > 5 && ($seconds / 60) < 120) {
                              $time += $seconds;
                          }
                      }
                    }
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
