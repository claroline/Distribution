<?php

/*
 * This file is part of the Inwicast plugin for Claroline Connect.
 *
 * (c) INWICAST <dev@inwicast.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Inwicast\ClarolinePluginBundle;

use Claroline\CoreBundle\Library\DistributionPluginBundle;
use Claroline\KernelBundle\Bundle\ConfigurationBuilder;
use Inwicast\ClarolinePluginBundle\Installation\AdditionalInstaller;

class InwicastClarolinePluginBundle extends DistributionPluginBundle
{
    public function getConfiguration($environment)
    {
        $config = new ConfigurationBuilder();

        return $config->addRoutingResource(__DIR__ . '/Resources/config/routing.yml', null, 'inwicast_claroline_plugin');
    }

    public function getAdditionalInstaller()
    {
        return new AdditionalInstaller();
    }
}
