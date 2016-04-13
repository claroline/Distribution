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
    }

    public function getDistributionVersion()
    {
        $installedFile = $this->kernelRootDir . '/../vendor/composer/installed.json';
        $repo = new InstalledFilesystemRepository(new JsonFile($installedFile));
        $corePackage = $repo->findPackage('claroline/distribution', '*');

        return $corePackage->getPrettyVersion();
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
                'description' => $this->getBundle($plugin)->getDescription(),
                'is_loaded'   => $this->isLoaded($plugin),
                'version'     => $this->getVersion($plugin),
                'origin'      => $this->getOrigin($plugin),
                'is_ready'    => $this->isReady($plugin)
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

    public function getOrigin(Plugin $plugin)
    {
        return $this->getBundle($plugin)->getOrigin();
    }

    public function getVersion(Plugin $plugin)
    {
        return $this->getBundle($plugin)->getVersion();
    }

    public function getBundle(Plugin $plugin)
    {
        return $this->kernel->getBundle($plugin->getVendorName() . $plugin->getBundleName());
    }

    public function getMissingRequirements(Plugin $plugin)
    {
        $bundle = $this->getBundle($plugin);
        $requirements = $bundle->getRequirements();
        $errors = [];

        if ($requirements) {
            $errors['extension'] = $this->checkExtension($requirements['extension']);
        }

        return $errors;
    }

    public function isReady($plugin)
    {
        $errors = $this->getMissingRequirements($plugin);

        return count($errors['extension']) > 0 ? false: true;
    }

    private function checkExtension($extensions)
    {
        $errors = [];

        foreach ($extensions as $extension) {
            if (!extension_loaded($exension)) $errors[] = $extension;
        }

        return $errors;
    }
}
