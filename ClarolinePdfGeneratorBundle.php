<?php

namespace Claroline\PdfGeneratorBundle;

use Claroline\CoreBundle\Library\PluginBundle;
use Claroline\KernelBundle\Bundle\ConfigurationBuilder;
use Claroline\BundleBundle\Installation\AdditionalInstaller;
use Claroline\KernelBundle\Bundle\ConfigurationProviderInterface;
use Symfony\Component\HttpKernel\Bundle\Bundle;

/**
 * Bundle class.
 * Uncomment if necessary.
 */
class ClarolinePdfGeneratorBundle extends PluginBundle implements ConfigurationProviderInterface
{        
    public function getRequiredFixturesDirectory($env) 
    {
        return 'DataFixtures';
    }

    public function suggestConfigurationFor(Bundle $bundle, $environment)
    {
        $config = new ConfigurationBuilder();
        $config->addContainerResource($this->buildPath('knp_snappy'));
        
        return $config;
    }
    
    private function buildPath($file, $folder = 'suggested')
    {
        return __DIR__ . "/Resources/config/{$folder}/{$file}.yml";
    }


    public function hasMigrations()
    {
        return false;
    }
}
