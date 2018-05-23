<?php

namespace Claroline\LinkBundle\Installation;

use Claroline\InstallationBundle\Additional\AdditionalInstaller as BaseInstaller;
use Claroline\LinkBundle\Installation\Updater\Updater120000;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;

class AdditionalInstaller extends BaseInstaller implements ContainerAwareInterface
{
    /**
     * @param $currentVersion
     * @param $targetVersion
     */
    public function preUpdate($currentVersion, $targetVersion)
    {
        if (version_compare($currentVersion, '12.0.0', '<')) {
            $updater = new Updater120000($this->container);
            $updater->setLogger($this->logger);
            $updater->preUpdate();
        }
    }
}
