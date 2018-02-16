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

class Updater110200 extends Updater
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
        $count = count($users);
        $i = 0;

        $this->log('Setting user main organization...');

        foreach ($users as $user) {
            ++$i;

            $administratedOrganizations = $user->getAdministratedOrganizations()->toArray();

            if (!$user->getMainOrganization()) {
                $this->log("Set {$user->getUsername()} main organization {$i}/{$count}");

                if (count($administratedOrganizations) > 0) {
                    $user->setMainOrganization($administratedOrganizations[0]);
                } else {
                    $organizations = $user->getOrganizations();
                    $user->setMainOrganization($organizations[0]);
                }

                $this->om->persist($user);
            }

            if (0 === $i % self::BATCH_SIZE) {
                $this->log('Flushing...');
                $this->om->flush();
            }
        }

        $this->log('Flushing...');
        $this->om->flush();
    }
}
