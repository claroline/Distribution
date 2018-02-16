<?php
/**
 * Created by PhpStorm.
 * User: panos
 * Date: 9/12/17
 * Time: 3:30 PM.
 */

namespace Claroline\CoreBundle\Library\Installation\Updater;

use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Updater110201 extends Updater
{
    const BATCH_SIZE = 500;

    private $container;
    protected $logger;
    private $om;

    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->container = $container;
        $this->logger = $logger;
        $this->om = $container->get('claroline.persistence.object_manager');
    }

    public function postUpdate()
    {
        $users = $this->om->getRepository('ClarolineCoreBundle:User')->findAll();
        $i = 0;

        foreach ($users as $user) {
            ++$i;

            $administratedOrganizations = $user->getAdministratedOrganizations()->toArray();

            if (count($administratedOrganizations) > 0) {
                $user->setMainOrganization($administratedOrganizations[0]);
            } else {
                $organizations = $user->getOrganizations();
                $user->setMainOrganization($organizations[0]);
            }

            $this->om->persist($user);

            if (0 === $i % self::BATCH_SIZE) {
                $this->om->flush();
            }
        }
    }
}
