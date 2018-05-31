<?php

namespace Claroline\ScormBundle\Library\Installation;

use Claroline\InstallationBundle\Additional\AdditionalInstaller as BaseInstaller;
use Claroline\ScormBundle\Library\Installation\Updater\Updater100000;
use Claroline\ScormBundle\Library\Installation\Updater\Updater120000;

class AdditionalInstaller extends BaseInstaller
{
    public function postUpdate($currentVersion, $targetVersion)
    {
        if (version_compare($currentVersion, '10.0.0', '<')) {
            $updater = new Updater100000($this->container, $this->logger);
            $updater->setLogger($this->logger);
            $updater->postUpdate();
        }

        if (version_compare($currentVersion, '12.0.0', '<')) {
            $updater = new Updater120000($this->container);
            $updater->setLogger($this->logger);
            $updater->postUpdate();
        }
    }
}
