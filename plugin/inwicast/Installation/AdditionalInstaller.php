<?php
/**
 * This file is part of the Claroline Connect package
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * Author: Panagiotis TSAVDARIS
 * 
 * Date: 4/3/15
 */

namespace Inwicast\ClarolinePluginBundle\Installation;

use Claroline\InstallationBundle\Additional\AdditionalInstaller as BaseInstaller;
use Inwicast\ClarolinePluginBundle\Installation\Updater;

class AdditionalInstaller extends BaseInstaller
{
    public function postUpdate($currentVersion, $targetVersion)
    {
        if (version_compare($currentVersion, '1.0.2', '<=')) {
            $updater = new Updater\Updater010200($this->container->get('doctrine.orm.entity_manager'));
            $updater->postUpdate();
        }
    }
} 