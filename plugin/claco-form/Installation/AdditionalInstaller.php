<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ClacoFormBundle\Installation;

use Claroline\InstallationBundle\Additional\AdditionalInstaller as BaseInstaller;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;

class AdditionalInstaller extends BaseInstaller implements ContainerAwareInterface
{
    public function postUpdate($currentVersion, $targetVersion)
    {
        switch (true) {
            case version_compare($currentVersion, '10.0.0', '<'):
                $updater = new Updater\Updater100000($this->container, $this->logger);
                $updater->setLogger($this->logger);
                $updater->postUpdate();
                // no break
            case version_compare($currentVersion, '10.6.0', '<'):
                $updater = new Updater\Updater100600($this->container, $this->logger);
                $updater->setLogger($this->logger);
                $updater->postUpdate();
                // no break
            case version_compare($currentVersion, '11.3.0', '<'):
                $updater = new Updater\Updater110300($this->container, $this->logger);
                $updater->setLogger($this->logger);
                $updater->postUpdate();
        }
    }
}
