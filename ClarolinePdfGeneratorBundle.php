<?php

namespace Claroline\PdfGeneratorBundle;

use Claroline\CoreBundle\Library\PluginBundle;
use Claroline\KernelBundle\Bundle\ConfigurationBuilder;
use Claroline\BundleBundle\Installation\AdditionalInstaller;
use Claroline\KernelBundle\Bundle\ConfigurationProviderInterface;

/**
 * Bundle class.
 * Uncomment if necessary.
 */
class ClarolinePdfGeneratorBundle extends PluginBundle implements ConfigurationProviderInterface
{
    public function getConfiguration($environment)
    {

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

    /*
    public function getAdditionalInstaller()
    {
        return new AdditionalInstaller();
    }
    */

    public function hasMigrations()
    {
        return false;
    }
}
