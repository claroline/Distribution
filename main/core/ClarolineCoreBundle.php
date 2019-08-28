<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle;

use Bazinga\Bundle\JsTranslationBundle\BazingaJsTranslationBundle;
use Claroline\CoreBundle\DependencyInjection\Compiler\DoctrineEntityListenerPass;
use Claroline\CoreBundle\DependencyInjection\Compiler\DynamicConfigPass;
use Claroline\CoreBundle\DependencyInjection\Compiler\MailingConfigPass;
use Claroline\CoreBundle\DependencyInjection\Compiler\PlatformConfigPass;
use Claroline\CoreBundle\DependencyInjection\Compiler\RouterPass;
use Claroline\CoreBundle\DependencyInjection\Compiler\RuleConstraintsConfigPass;
use Claroline\CoreBundle\Library\DistributionPluginBundle;
use Claroline\CoreBundle\Library\Installation\AdditionalInstaller;
use Claroline\KernelBundle\Bundle\AutoConfigurableInterface;
use Claroline\KernelBundle\Bundle\ConfigurationBuilder;
use Claroline\KernelBundle\Bundle\ConfigurationProviderInterface;
use Symfony\Bundle\WebProfilerBundle\WebProfilerBundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class ClarolineCoreBundle extends DistributionPluginBundle implements AutoConfigurableInterface, ConfigurationProviderInterface
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->addCompilerPass(new PlatformConfigPass());
        $container->addCompilerPass(new DynamicConfigPass());
        $container->addCompilerPass(new DoctrineEntityListenerPass());
        $container->addCompilerPass(new RuleConstraintsConfigPass());
        $container->addCompilerPass(new RouterPass());
        $container->addCompilerPass(new MailingConfigPass());
    }

    public function supports($environment)
    {
        return in_array($environment, ['prod', 'dev', 'test', 'console']);
    }

    public function getConfiguration($environment)
    {
        $config = new ConfigurationBuilder();
        $configFile = 'test' === $environment ? 'config_test.yml' : 'config.yml';
        $routingFile = 'test' === $environment ? 'routing_test.yml' : 'routing.yml';

        return $config
            ->addContainerResource(__DIR__."/Resources/config/app/{$configFile}")
            ->addRoutingResource(__DIR__."/Resources/config/{$routingFile}");
    }

    public function suggestConfigurationFor(Bundle $bundle, $environment)
    {
        $bundleClass = get_class($bundle);
        $config = new ConfigurationBuilder();

        // no special configuration, work in any environment
        $emptyConfigs = [
            'Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle',
            'FOS\JsRoutingBundle\FOSJsRoutingBundle',
            'JMS\AopBundle\JMSAopBundle',
            'Claroline\MigrationBundle\ClarolineMigrationBundle',
            'Claroline\Bundle\FrontEndBundle\FrontEndBundle',
            'Cocur\Slugify\Bridge\Symfony\CocurSlugifyBundle',
        ];
        // simple container configuration, same for every environment
        $simpleConfigs = [
            'Symfony\Bundle\TwigBundle\TwigBundle' => 'twig',
            'JMS\DiExtraBundle\JMSDiExtraBundle' => 'jms_di_extra',
            'JMS\SecurityExtraBundle\JMSSecurityExtraBundle' => 'jms_security_extra',
            'Stof\DoctrineExtensionsBundle\StofDoctrineExtensionsBundle' => 'stof_doctrine_extensions',
            'Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle' => 'sensio_framework_extra',
        ];
        // one configuration file for every standard environment (prod, dev, test)
        $envConfigs = [
            'Symfony\Bundle\FrameworkBundle\FrameworkBundle' => 'framework',
            'Symfony\Bundle\SecurityBundle\SecurityBundle' => 'security',
            'Symfony\Bundle\MonologBundle\MonologBundle' => 'monolog',
            'Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle' => 'swiftmailer',
            'Doctrine\Bundle\DoctrineBundle\DoctrineBundle' => 'doctrine',
        ];

        if (in_array($bundleClass, $emptyConfigs)) {
            return $config;
        } elseif (isset($simpleConfigs[$bundleClass])) {
            return $config->addContainerResource($this->buildPath($simpleConfigs[$bundleClass]));
        } elseif (isset($envConfigs[$bundleClass])) {
            if (in_array($environment, ['prod', 'dev', 'test', 'console'])) {
                return $config->addContainerResource($this->buildPath("{$envConfigs[$bundleClass]}_{$environment}"));
            }
        } elseif ($bundle instanceof BazingaJsTranslationBundle) {
            return $config->addRoutingResource($this->buildPath('bazinga_routing'));
        } elseif (in_array($environment, ['dev', 'test'])) {
            if ($bundle instanceof WebProfilerBundle) {
                return $config
                    ->addContainerResource($this->buildPath('web_profiler'))
                    ->addRoutingResource($this->buildPath('web_profiler_routing'));
            }
        }

        return false;
    }

    public function getRequiredFixturesDirectory($environment)
    {
        return 'DataFixtures/Required';
    }

    public function getPostInstallFixturesDirectory($environment)
    {
        return 'DataFixtures/PostInstall';
    }

    public function getAdditionalInstaller()
    {
        return new AdditionalInstaller();
    }

    private function buildPath($file, $folder = 'suggested')
    {
        return __DIR__."/Resources/config/{$folder}/{$file}.yml";
    }
}
