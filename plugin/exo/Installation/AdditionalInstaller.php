<?php

namespace UJM\ExoBundle\Installation;

use Claroline\InstallationBundle\Additional\AdditionalInstaller as BaseInstaller;
use UJM\ExoBundle\Installation\Updater\Updater060000;
use UJM\ExoBundle\Installation\Updater\Updater060001;
use UJM\ExoBundle\Installation\Updater\Updater060200;
use UJM\ExoBundle\Installation\Updater\Updater070000;
use UJM\ExoBundle\Installation\Updater\Updater080000;

class AdditionalInstaller extends BaseInstaller
{
    public function preUpdate($currentVersion, $targetVersion)
    {
        if (version_compare($currentVersion, '6.0.0', '<=')) {
            $updater = new Updater060000($this->container);
            $updater->setLogger($this->logger);
            $updater->preUpdate();
        }

        if (version_compare($currentVersion, '6.0.0', '=')) {
            $updater = new Updater060001($this->container);
            $updater->setLogger($this->logger);
            $updater->preUpdate();
        }

        if (version_compare($currentVersion, '6.2.0', '<')) {
            $updater = new Updater060200($this->container);
            $updater->setLogger($this->logger);
            $updater->preUpdate();
        }

        if (version_compare($currentVersion, '7.0.0', '<=')) {
            $updater = new Updater070000($this->container);
            $updater->setLogger($this->logger);
            $updater->preUpdate();
        }
    }

    public function postUpdate($currentVersion, $targetVersion)
    {
        if (version_compare($currentVersion, '6.0.0', '<=')) {
            $updater = new Updater060000($this->container);
            $updater->setLogger($this->logger);
            $updater->postUpdate();
        }

        if (version_compare($currentVersion, '6.2.0', '<')) {
            $updater = new Updater060200($this->container);
            $updater->setLogger($this->logger);
            $updater->postUpdate();
        }

        if (version_compare($currentVersion, '8.0.0', '<')) {
            $updater = new Updater080000($this->container);
            $updater->setLogger($this->logger);
            $updater->postUpdate();
        }
    }
}
