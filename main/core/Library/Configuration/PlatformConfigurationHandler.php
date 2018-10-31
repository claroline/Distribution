<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *A
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Library\Configuration;

use Claroline\AppBundle\API\Utils\ArrayUtils;
use JMS\DiExtraBundle\Annotation as DI;
use RuntimeException;
use Symfony\Component\Yaml\Yaml;

/**
 * @DI\Service("claroline.config.platform_config_handler")
 *
 * Service used for accessing or modifying the platform configuration parameters.
 */
class PlatformConfigurationHandler
{
    private $configFile;
    private $parameters;
    private $lockedParameters;

    /**
     * PlatformConfigurationHandler constructor.
     *
     * @DI\InjectParams({
     *     "configFile"       = @DI\Inject("%claroline.param.platform_options_file%"),
     *     "lockedConfigFile" = @DI\Inject("%claroline.param.locked_platform_options_file%")
     * })
     *
     * @param string $configFile
     * @param string $lockedConfigFile
     */
    public function __construct($configFile, $lockedConfigFile)
    {
        $this->parameters = [];
        $this->defaultConfigs = [];
        $this->configFile = $configFile;
        $this->parameters = $this->mergeParameters();
        $this->lockedParameters = $this->generateLockedParameters($lockedConfigFile);
        $this->arrayUtils = new ArrayUtils();
    }

    public function hasParameter($parameter)
    {
        return $this->arrayUtils->has($this->parameters, $parameter);
    }

    /**
     * @param string $parameter
     *
     * @return mixed
     */
    public function getParameter($parameter)
    {
        if ($this->hasParameter($parameter)) {
            return $this->arrayUtils->get($this->parameters, $parameter);
        }

        return null;
    }

    public function getParameters()
    {
        return $this->parameters;
    }

    public function getDefaultsConfigs()
    {
        return $this->defaultConfigs;
    }

    public function setParameter($parameter, $value)
    {
        $this->arrayUtils->set($this->parameters, $parameter);
        $this->saveParameters();
    }

    public function removeParameter($parameter)
    {
        unset($this->parameters[$parameter]);
        $this->saveParameters();
    }

    /**
     * @param PlatformConfiguration|array $newParameters
     */
    public function setParameters($newParameters)
    {
        if (is_array($newParameters)) {
            $parameters = $newParameters;
        } else {
            $parameters = $newParameters->getParameters();
        }

        $toMerge = [];
        foreach ($parameters as $key => $value) {
            if (!isset($this->lockedParameters[$key])) {
                $toMerge[$key] = $value;
            }
        }
        $this->parameters = array_merge($this->parameters, $toMerge);
        $this->saveParameters();
    }

    public function isRedirectOption($option)
    {
        return $this->parameters['redirect_after_login_option'] === $option;
    }

    public function addDefaultParameters(ParameterProviderInterface $config)
    {
        $newDefault = $config->getDefaultParameters();
        $newDefaultClass = get_class($config);

        //check if the parameter already exists to avoid overriding stuff by mistake
        foreach ($this->defaultConfigs as $defaultConfig) {
            $duplicates = array_intersect_key($defaultConfig, $newDefault);

            if (count($duplicates) > 0) {
                throw new \RuntimeException(
                    "The following duplicate key(s) were found in the {$newDefaultClass} configuration file: ".implode(', ', array_keys($duplicates))
                );
            }
        }

        $this->defaultConfigs[$newDefaultClass] = $newDefault;
        $this->parameters = array_merge($newDefault, $this->parameters);
    }

    public function getPlatformConfig()
    {
        return new PlatformConfiguration($this->parameters);
    }

    public function setPlatformConfig(PlatformConfiguration $config)
    {
        $this->setParameters($config->getParameters());
    }

    protected function mergeParameters()
    {
        if (!file_exists($this->configFile) && false === @touch($this->configFile)) {
            throw new \Exception(
                "Configuration file '{$this->configFile}' does not exits and cannot be created"
            );
        }

        $configParameters = Yaml::parse(file_get_contents($this->configFile)) ?: [];

        foreach ($configParameters as $parameter => $value) {
            $this->parameters[$parameter] = $value;
        }

        return $this->parameters;
    }

    protected function saveParameters()
    {
        if (!is_writable($this->configFile)) {
            $exception = new UnwritableException();
            $exception->setPath($this->configFile);

            throw $exception;
        }

        ksort($this->parameters);
        $parameters = Yaml::dump($this->parameters);
        file_put_contents($this->configFile, $parameters);
    }

    protected function checkParameter($parameter)
    {
        if (!$this->hasParameter($parameter)) {
            throw new RuntimeException(
                "'{$parameter}' is not a parameter of the current platform configuration."
            );
        }
    }

    public function getLockedParameters()
    {
        return $this->lockedParameters;
    }

    public function getDefaultParameters()
    {
        return $this->parameters;
    }

    protected function generateLockedParameters($lockedConfigFile)
    {
        $lockedParameters = [];

        if (file_exists($lockedConfigFile)) {
            $lockedConfigParameters = Yaml::parse(file_get_contents($lockedConfigFile)) ?: [];

            foreach ($lockedConfigParameters as $parameter => $value) {
                $lockedParameters[$parameter] = $value;
            }
        }

        return $lockedParameters;
    }
}
