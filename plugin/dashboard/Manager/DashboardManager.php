<?php

namespace Claroline\DashboardBundle\Manager;

use Claroline\CoreBundle\Entity\User;
use Claroline\DashboardBundle\Entity\Dashboard;
use Doctrine\ORM\EntityManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.dashboard_manager")
 */
class DashboardManager
{
    protected $em;

    /**
     * @DI\InjectParams({
     *      "em"          = @DI\Inject("doctrine.orm.entity_manager")
     * })
     *
     * @param ContainerInterface $container
     * @param EntityManager      $em
     **/
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    public function getRepository()
    {
        return $this->em->getRepository('ClarolineDashboardBundle:Dashboard');
    }

    public function getOne($id)
    {
        return [
        ['title' => 'dashboard1'],
      ];
    }

    public function getAll(User $user)
    {
        return [
          ['id' => 1, 'title' => 'dashboard1'],
          ['id' => 2, 'title' => 'dashboard2'],
        ];
        /*$audio = $this->getRepository()->findOneBy(['mediaResource' => $mr, 'type' => 'audio']);

        return $audio->getUrl();*/
    }
}
