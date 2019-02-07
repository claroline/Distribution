<?php

namespace Icap\PortfolioBundle\Installation;

use Claroline\InstallationBundle\Additional\AdditionalInstaller as BaseInstaller;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;

class AdditionalInstaller extends BaseInstaller implements ContainerAwareInterface
{
    public function postUpdate($currentVersion, $targetVersion)
    {
        if (version_compare($currentVersion, '0.1.3', '<')) {
            $updater = new Updater\Updater000103($this->container->get('doctrine.orm.entity_manager'));
            $updater->postUpdate();
        }
        if (version_compare($currentVersion, '1.0.0', '<=')) {
            $updater = new Updater\Updater010000($this->container->get('doctrine.orm.entity_manager'));
            $updater->postUpdate();
        }
        if (version_compare($currentVersion, '4.0.0', '<=')) {
            $updater = new Updater\Updater040000($this->container->get('doctrine.orm.entity_manager'));
            $updater->postUpdate();
        }
        if (version_compare($currentVersion, '4.2.1', '<=')) {
            $updater = new Updater\Updater040201($this->container->get('doctrine.orm.entity_manager'));
            $updater->setLogger($this->logger);
            $updater->postUpdate();
        }
        if (version_compare($currentVersion, '5.0.2', '<=')) {
            $updater = new Updater\Updater050002($this->container->get('doctrine.orm.entity_manager'),
                $this->container->get('doctrine.dbal.default_connection'));
            $updater->setLogger($this->logger);
            $updater->postUpdate();
        }

        if (version_compare($currentVersion, '6.2.0', '<=')) {
            $updater = new Updater\Updater060200();
            $updater->setLogger($this->logger);
            $updater->postUpdate($this->container->get('doctrine.dbal.default_connection'), $this->container->get('kernel'));
        }
    }
}
