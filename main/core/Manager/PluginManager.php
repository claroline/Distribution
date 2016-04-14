<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager;

use Composer\Json\JsonFile;
use Composer\Repository\InstalledFilesystemRepository;
use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Plugin;
use Claroline\CoreBundle\Library\Utilities\FileSystem;
use Symfony\Component\HttpKernel\KernelInterface;
use Claroline\KernelBundle\Manager\BundleManager;

/**
 * @DI\Service("claroline.manager.plugin_manager")
 */
class PluginManager
{
    private $iniFileManager;
    private $kernelRootDir;
    private $om;
    private $pluginRepo;
    private $kernel;
    private $bundleManager;

    /**
     * @DI\InjectParams({
     *      "iniFileManager" = @DI\Inject("claroline.manager.ini_file_manager"),
     *      "kernelRootDir"  = @DI\Inject("%kernel.root_dir%"),
     *      "om"             = @DI\Inject("claroline.persistence.object_manager"),
     *      "kernel"         = @DI\Inject("kernel")
     * })
     */
    public function __construct(
        IniFileManager $iniFileManager,
        $kernelRootDir,
        ObjectManager $om,
        KernelInterface $kernel
    )
    {
        $this->iniFileManager = $iniFileManager;
        $this->kernelRootDir  = $kernelRootDir;
        $this->om             = $om;
        $this->pluginRepo     = $om->getRepository('ClarolineCoreBundle:Plugin');
        $this->iniFile        = $this->kernelRootDir . '/config/bundles.ini';
        $this->kernel         = $kernel;
        BundleManager::initialize($kernel, $this->iniFile);
        $this->bundleManager = BundleManager::getInstance();
    }

    public function getDistributionVersion()
    {
        return $this->getVersion('ClarolineCoreBundle');
    }

    public function updateIniFile($vendor, $bundle)
    {
        $iniFile = $this->kernelRootDir . '/config/bundles.ini';

        //update ini file
        $this->iniFileManager
            ->updateKey(
                $vendor . '\\' . $bundle . 'Bundle\\' . $vendor . $bundle . 'Bundle',
                true,
                $iniFile
            );
    }

    public function updateAutoload($ivendor, $ibundle, $vname, $bname)
    {
        //update namespace file
        $namespaces = $this->kernelRootDir . '/../vendor/composer/autoload_namespaces.php';
        $content = file_get_contents($namespaces);
        $lineToAdd = "\n    '{$ivendor}\\\\{$ibundle}Bundle' => array(\$vendorDir . '/{$vname}/{$bname}'),";

        if (!strpos($content, $lineToAdd)) {
            //add the correct line after corebundle...
            $content = str_replace(
                "/core-bundle'),",
                "/core-bundle'), {$lineToAdd}",
                $content
            );

            file_put_contents($namespaces, $content);
        }
    }

    public function getPlugins()
    {
        return $this->pluginRepo->findAll();
    }

    public function getPluginsData()
    {
        $plugins = $this->pluginRepo->findAll();
        $datas = [];

        foreach ($plugins as $plugin) {
            $datas[] = array(
                'id'          => $plugin->getId(),
                'name'        => $plugin->getVendorName() . $plugin->getBundleName(),
                'has_options' => $plugin->hasOptions(),
                'description' => $this->getDescription($plugin),
                'is_loaded'   => $this->isLoaded($plugin),
                'version'     => $this->getVersion($plugin),
                'origin'      => $this->getOrigin($plugin),
                'is_ready'    => $this->isReady($plugin),
                'require'     => $this->getRequirements($plugin)
            );
        }

        return $datas;
    }

    public function enable(Plugin $plugin)
    {
        $this->iniFileManager
            ->updateKey(
                $plugin->getBundleFQCN(),
                true,
                $this->kernelRootDir . '/config/bundles.ini'
            );

        return $plugin;
    }

    public function disable(Plugin $plugin)
    {
        $this->iniFileManager
            ->updateKey(
                $plugin->getBundleFQCN(),
                false,
                $this->kernelRootDir . '/config/bundles.ini'
            );

        return $plugin;
    }

    public function getEnabled($shortName = false)
    {
        $bundles = parse_ini_file($this->iniFile);
        $enabledBundles = [];

        foreach ($bundles as $bundle => $enabled) {
            if ($enabled) {
                if ($shortName) {
                    $parts = explode('\\', $bundle);
                    $enabledBundles[] = $parts[2];
                } else {
                    $enabledBundles[] = $bundles;
                }
            }
        }

        //maybe only keep plugins that are in the database ? but it's one more request
        //we could also parse composer.json and so on...

        return $enabledBundles;
    }

    public function getPluginByShortName($name)
    {
        return $this->pluginRepo->findPluginByShortName($name);
    }

    public function isLoaded(Plugin $plugin)
    {
        $bundles = parse_ini_file($this->getIniFile());

        foreach ($bundles as $bundle => $isEnabled) {
            if ($bundle === $plugin->getBundleFQCN() && $isEnabled) return true;
        }

        return false;
    }

    public function getIniFile()
    {
        return $this->iniFile;
    }

    public function getDescription($plugin)
    {
        return $this->getBundle($plugin)->getOrigin();
    }

    public function getOrigin($plugin)
    {
        return $this->getBundle($plugin)->getOrigin();
    }

    public function getVersion($plugin)
    {
        return $this->getBundle($plugin)->getVersion();
    }

    public function getBundle($plugin)
    {
        $bundles = $this->bundleManager->getActiveBundles(true);
        $shortName = $plugin instanceof Plugin ?
            $plugin->getVendorName() . $plugin->getBundleName():
            $plugin;

        foreach ($bundles as $bundle) {
            if ($bundle['instance']->getName() === $shortName) return $bundle['instance'];
        }
    }

    public function getRequirements(Plugin $plugin)
    {
        $requirements = [];
        $bundle = $this->getBundle($plugin);

        if (count($extensions = $bundle->getRequiredPhpExtensions()) > 0) $requirements['extension'] = $extensions;
        if (count($extensions = $bundle->getRequiredPlugins()) > 0)       $requirements['plugin'] = $extensions;

        return $requirements;
    }

    public function getMissingRequirements(Plugin $plugin)
    {
        $requirements = $this->getRequirements($plugin);
        $errors = [];

        if ($requirements) {
            if (array_key_exists('extension', $requirements)) $errors['extension'] = $this->checkExtension($requirements['extension']);
            if (array_key_exists('plugin', $requirements))    $errors['plugin']    = $this->checkPlugins($requirements['plugin']);
        }

        return $errors;
    }

    public function isReady($plugin)
    {
        $errors = $this->getMissingRequirements($plugin);

        return count($errors) > 0 ? false: true;
    }

    private function checkExtension($extensions)
    {
        $errors = [];

        foreach ($extensions as $extension) {
            if (!extension_loaded($extension)) $errors[] = $extension;
        }

        return $errors;
    }

    private function checkPlugins($plugins)
    {
        $errors = [];

        foreach ($plugins as $fqcn) {
            try {
                $this->getBundle($fqcn);
            } catch (\Exception $e) {
                $plugin = $this->getPluginByShortName($fqcn);
                $errors[] = $plugin->getVendorName() . $plugin->getBundleName();
            }
        }

        return $errors;
    }
}
