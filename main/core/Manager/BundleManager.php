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

/**
 * @DI\Service("claroline.manager.bundle_manager")
 */
class BundleManager
{
    private $iniFileManager;
    private $kernelRootDir;
    private $om;
    private $pluginRepo;

    /**
     * @DI\InjectParams({
     *      "iniFileManager" = @DI\Inject("claroline.manager.ini_file_manager"),
     *      "kernelRootDir"  = @DI\Inject("%kernel.root_dir%"),
     *      "om"             = @DI\Inject("claroline.persistence.object_manager")
     * })
     */
    public function __construct(IniFileManager $iniFileManager, $kernelRootDir, ObjectManager $om)
    {
        $this->iniFileManager = $iniFileManager;
        $this->kernelRootDir  = $kernelRootDir;
        $this->om             = $om;
        $this->pluginRepo     = $om->getRepository('ClarolineCoreBundle:Plugin');
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

    public function enableAll()
    {
        $this->om->startFlushSuite();

        foreach ($this->getPlugins() as $plugin) {
            $plugin->enable();
            $this->om->persist($plugin);
        }

        $this->om->endFlushSuite();
    }

    public function enable(Plugin $plugin)
    {
        $plugin->enable();
        $this->om->persist($plugin);
        $this->om->flush();

        return $plugin;
    }

    public function disable(Plugin $plugin)
    {
        $plugin->disable();
        $this->om->persist($plugin);
        $this->om->flush();

        return $plugin;
    }
}
