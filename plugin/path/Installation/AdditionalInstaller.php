<?php

namespace Innova\PathBundle\Installation;

use Claroline\InstallationBundle\Additional\AdditionalInstaller as BaseInstaller;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;

/**
 * Executes correct action when PathBundle is installed or updated.
 */
class AdditionalInstaller extends BaseInstaller implements ContainerAwareInterface
{
    public function preUpdate($currentVersion, $targetVersion)
    {
        if (version_compare($currentVersion, '12.0.0', '<')) {
            $updater120000 = new Updater\Updater120000($this->container);
            $updater120000->setLogger($this->logger);
            $updater120000->preUpdate();
        }
    }

    /**
     * Action to perform after Bundle update
     * Load default allowed types for the non digital resources if the previous bundle version is less than 1.1.
     *
     * @param string $currentVersion - The current version of the bundle
     * @param string $targetVersion  - The version of the bundle which will be installed instead
     *
     * @return \Innova\PathBundle\Installation\AdditionalInstaller
     */
    public function postUpdate($currentVersion, $targetVersion)
    {
        if (version_compare($currentVersion, '1.2.9', '<') && version_compare($targetVersion, '1.2.9', '>=')) {
            $updater010209 = new Updater\Updater010209($this->container);
            $updater010209->setLogger($this->logger);
            $updater010209->postUpdate();
        }

        if (version_compare($currentVersion, '5.1.0', '<') && version_compare($targetVersion, '5.1.0', '>=')) {
            $updater050100 = new Updater\Updater050100($this->container);
            $updater050100->setLogger($this->logger);
            $updater050100->postUpdate();
        }

        if (version_compare($currentVersion, '7.1.0', '<')) {
            $updater080000 = new Updater\Updater070100($this->container);
            $updater080000->setLogger($this->logger);
            $updater080000->postUpdate();
        }

        if (version_compare($currentVersion, '11.0.0', '<')) {
            $updater080000 = new Updater\Updater110000($this->container);
            $updater080000->setLogger($this->logger);
            $updater080000->postUpdate();
        }

        if (version_compare($currentVersion, '11.2.10', '<')) {
            $updater110200 = new Updater\Updater110200($this->container);
            $updater110200->setLogger($this->logger);
            $updater110200->postUpdate();
        }

        if (version_compare($currentVersion, '12.0.0', '<')) {
            $updater120000 = new Updater\Updater120000($this->container);
            $updater120000->setLogger($this->logger);
            $updater120000->postUpdate();
        }

        if (version_compare($currentVersion, '12.5.3', '<')) {
            $updater120503 = new Updater\Updater120503($this->container);
            $updater120503->setLogger($this->logger);
            $updater120503->postUpdate();
        }

        if (version_compare($currentVersion, '12.5.48', '<')) {
            $updater120503 = new Updater\Updater120548($this->container);
            $updater120503->setLogger($this->logger);
            $updater120503->postUpdate();
        }

        return $this;
    }
}
