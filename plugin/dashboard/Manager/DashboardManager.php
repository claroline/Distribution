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
     * here will go all the logic to calculate the spent times
     * Workspace
     * User
     * $all
     * - true if we want to calculate time for all users in the workspace (except for the given USER)
     * - false if we only want the time spent in the worksapce for the given user.
     */
    public function getDashboardWorkspaceSpentTimes(Workspace $workspace, User $user, $all = false)
    {
        $by = ['action' => 'workspace-enter', 'workspace' => $workspace];
        if ($all === false) {
            $by['doer'] = $user;
        }
        $repository = $this->getClaroLogRepository();

        /*
        $query = $repository->createQueryBuilder('l')
                            ->where('l.workspace = :workspaceId')
                            ->andWhere('l.action = :action')
                            ->setParameter('workspaceId', $workspace->getId())
                            ->setParameter('action', 'workspace-enter')
                            ->getQuery();
        $results = $query->getResult();
        echo $query->getSql();
        echo '<hr>';
        $nb = count($results);
        echo $nb;
        die();
        */

        /*$qb = $repository->createQueryBuilder('l');

        $qb->where('l.workspace = :workspaceId')->andWhere('l.action = :action');
        if ($all === false) {
            $qb->andWhere('l.doer = :doer');
        }

        $qb->setParameter('workspaceId', $workspace->getId())
        ->setParameter('action', 'workspace-enter');
        if ($all === false) {
            $qb->setParameter('doer', $user);
        }
        $query = $qb->getQuery();
        $results = $query->getResult();
        echo $query->getSql();
        echo '<hr>';
        $nb = count($results);
        echo $nb;
        die();
*/
        $qb = $repository->createQueryBuilder('l');
        $qb->leftJoin('Claroline\CoreBundle\Entity\User', 'u', \Doctrine\ORM\Query\Expr\Join::WITH, 'l.doer = u.id');

        /*
        ->leftJoin(
                    'User\Entity\User',
                    'u',
                    \Doctrine\ORM\Query\Expr\Join::WITH,
                    'a.user = u.id'
                )
        */

        $qb->where('l.workspace = :workspaceId')->andWhere('l.action = :action');
        if ($all === false) {
            $qb->andWhere('l.doer = :doer');
        }
        //u.Phonenumbers
        //http://docs.doctrine-project.org/projects/doctrine-orm/en/latest/reference/query-builder.html

        $qb->setParameter('workspaceId', $workspace->getId())
        ->setParameter('action', 'workspace-enter');
        if ($all === false) {
            $qb->setParameter('doer', $user);
        }
        $query = $qb->getQuery();
        $results = $query->getResult();
        echo $query->getSql();
        echo '<hr>';
        $nb = count($results);
        var_dump($results);
        echo $nb;
        die();

        //$test = $this->getClaroLogRepository()->findBy(['action' => 'workspace-enter', 'workspace' => $workspace]);
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
