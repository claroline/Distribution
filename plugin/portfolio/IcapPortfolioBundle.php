<?php

namespace Icap\PortfolioBundle;

use Claroline\CoreBundle\Library\PluginBundle;
use Claroline\KernelBundle\Bundle\ConfigurationBuilder;
use Icap\PortfolioBundle\Installation\AdditionalInstaller;

class IcapPortfolioBundle extends PluginBundle
{
    public function getConfiguration($environment)
    {
        $config = new ConfigurationBuilder();

        if (file_exists($routingFile = $this->getPath().'/Resources/config/routing.yml')) {
            $config->addRoutingResource($routingFile);
        }

        return $config;
    }

    public function getRequiredFixturesDirectory($environment)
    {
        return 'DataFixtures/Required';
    }

    public function getRequiredPlugins()
    {
        return ['Claroline\\TeamBundle\\ClarolineTeamBundle'];
    }

    public function getAdditionalInstaller()
    {
        return new AdditionalInstaller();
    }
}
