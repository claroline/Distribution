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
        // users ids
        if ($all) {
            // all user(s) belonging to the target workspace (manager and collaborators)... not in log !
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
            $selectAllEnterEventsOnThisWorkspace = 'SELECT date_log FROM claro_log WHERE workspace_id = '.$workspace->getId().' AND action = "workspace-enter" AND doer_id ='.$id.' ORDER BY date_log ASC';
            $selectAllEnterEventsOnThisWorkspaceStmt = $this->em->getConnection()->prepare($selectAllEnterEventsOnThisWorkspace);
            $selectAllEnterEventsOnThisWorkspaceStmt->execute();
            $enterOnThisWorksapceDatesResults = $selectAllEnterEventsOnThisWorkspaceStmt->fetchAll();
            $enterOnThisWorksapceDates = [];
            foreach ($enterOnThisWorksapceDatesResults as $resultDateTime) {
                $enterOnThisWorksapceDates[] = $resultDateTime['date_log'];
            }
            $time = 0; // final connection time in seconds
            // foreach enter on this workspace datetime
            $index = 0;
            foreach ($enterOnThisWorksapceDates as $dateTime) {
                // select the first next enter event on another workspace (ie WHERE date_log > $dateTime AND date_log < $nextDateTime order by date_log ASC LIMIT 1)
                if (isset($enterOnThisWorksapceDates[$index + 1])) {
                    $sql = 'SELECT date_log FROM claro_log WHERE workspace_id != '.$workspace->getId().' AND action = "workspace-enter" AND date_log > "'.$dateTime.'" AND date_log < "'.$enterOnThisWorksapceDates[$index + 1].'" AND doer_id = '.$id.' ORDER BY date_log ASC LIMIT 1';
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
                    }
                    ++$index;
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
