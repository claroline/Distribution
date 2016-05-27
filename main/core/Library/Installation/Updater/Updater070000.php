<?php
/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Library\Installation\Updater;

use Claroline\CoreBundle\Entity\Content;
use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;

//I assume this will be the first updater to distribution bundle.
class Updater070000 extends Updater
{
    private $container;

    public function __construct(ContainerInterface $container, $logger)
    {
        $this->container = $container;
        $this->om = $container->get('claroline.persistence.object_manager');
        $this->logger = $logger;
    }

    public function postUpdate()
    {
        $pluginRepo = $this->om->getRepository('ClarolineCoreBundle:Plugin');
        $plugin = $pluginRepo->findOneBy(array('vendorName' => 'Claroline', 'bundleName' => 'VideoJsBundle'));

        if ($plugin) {
            $this->log('Removing VideoJsBundle plugin from database...');
            $this->om->remove($plugin);
            $this->om->flush();
        }
        $this->createMaintenanceMessage();
    }

    private function createMaintenanceMessage()
    {
        $this->log('Creating maintenance message...');
        $contentRepo = $this->om->getRepository('ClarolineCoreBundle:Content');
        $maintenanceContent = $contentRepo->findOneByType('claro_maintenance_message');

        if (is_null($maintenanceContent)) {
            $maintenanceMsg = '<p>Le site est temporairement en maintenance</p>';
            $maintenanceMsg .= '<p>The site is temporarily down for maintenance</p>';
            $maintenanceContent = new Content();
            $maintenanceContent->setContent($maintenanceMsg);
            $maintenanceContent->setType('claro_maintenance_message');
            $this->om->persist($maintenanceContent);
            $this->om->flush();
        }
    }
}
