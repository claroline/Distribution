<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AuthenticationBundle;

use Claroline\AuthenticationBundle\DependencyInjection\Compiler\OauthConfigPass;
use Claroline\AuthenticationBundle\DependencyInjection\Compiler\SamlConfigPass;
use Claroline\CoreBundle\Library\DistributionPluginBundle;
use Claroline\KernelBundle\Bundle\AutoConfigurableInterface;
use Claroline\KernelBundle\Bundle\ConfigurationBuilder;
use Claroline\KernelBundle\Bundle\ConfigurationProviderInterface;
use Symfony\Component\DependencyInjection\Compiler\PassConfig;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class ClarolineAuthenticationBundle extends DistributionPluginBundle implements ConfigurationProviderInterface, AutoConfigurableInterface
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->addCompilerPass(new OauthConfigPass());
        $container->addCompilerPass(new SamlConfigPass(), PassConfig::TYPE_AFTER_REMOVING);
    }

    public function suggestConfigurationFor(Bundle $bundle, $environment)
    {
        $config = new ConfigurationBuilder();
        $bundleClass = get_class($bundle);
        $emptyConfigs = [
            'LightSaml\SpBundle\LightSamlSpBundle'
        ];
        $simpleConfigs = [
            'HWI\Bundle\OAuthBundle\HWIOAuthBundle' => 'hwi_oauth',
            'LightSaml\SymfonyBridgeBundle\LightSamlSymfonyBridgeBundle' => 'light_saml_symfony_bridge',
        ];

        if (in_array($bundleClass, $emptyConfigs)) {
            return $config;
        } else if (isset($simpleConfigs[$bundleClass])) {
            return $config->addContainerResource($this->buildPath($simpleConfigs[$bundleClass]));
        }

        return false;
    }

    private function buildPath($file, $folder = 'suggested')
    {
        return __DIR__."/Resources/config/{$folder}/{$file}.yml";
    }
}
