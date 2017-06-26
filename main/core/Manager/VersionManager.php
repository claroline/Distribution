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

use Claroline\BundleRecorder\Log\LoggableTrait;
use Claroline\CoreBundle\Entity\Update\UpdaterExecuted;
use Claroline\CoreBundle\Entity\Update\Version;
use Claroline\CoreBundle\Library\PluginBundleInterface;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\InstallationBundle\Bundle\InstallableInterface;
use Composer\Json\JsonFile;
use Composer\Repository\InstalledFilesystemRepository;
use FOS\RestBundle\View\View;
use JMS\DiExtraBundle\Annotation as DI;
use Psr\Log\LoggerInterface;
use Psr\Log\LogLevel;

/**
 * @DI\Service("claroline.manager.version_manager")
 */
class VersionManager
{
    use LoggableTrait;

    /**
     * @DI\InjectParams({
     *     "om"           = @DI\Inject("claroline.persistence.object_manager"),
     *     "container"    = @DI\Inject("service_container")
     * })
     */
    public function __construct(
        ObjectManager $om,
        $container
    ) {
        $this->om = $om;
        $this->repo = $this->om->getRepository('ClarolineCoreBundle:Update\Version');
        $this->container = $container;
        $this->installedRepoFile = $this->container->get('kernel')->getRootDir().'/../vendor/composer/installed.json';
    }

    public function register(InstallableInterface $bundle)
    {
        $data = $this->getVersionFile($bundle);
        $version = $this->repo->findBy(['version' => $data[0], 'bundle' => $bundle->getBundleFQCN()]);

        if ($version) {
            $this->log("Version {$version->getBundle()} {$version->getVersion()} already registered !", LogLevel::ERROR);

            return;
        }

        $this->log("Registering {$bundle->getBundleFQCN()} version {$data[0]}");
        $version = new Version($data[0], $data[1], $data[2], $bundle->getBundleFQCN());
        $this->om->persist($version);
        $this->om->flush();
    }

    public function registerBundle(PluginBundleInterface $bundle)
    {
        $executed = new UpdaterExecuted($this->getLatestUpgraded(), $bundle->getBundleFQCN());
        $this->om->persist($executed);
        $this->om->flush();
    }

    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;

        return $this;
    }

    public function getCurrent()
    {
        return $this->getVersionFile()[0];
    }

    public function getLatestUpgraded()
    {
        return $this->repo->getLatestExecuted();
    }

    public function getVersionFile()
    {
        $data = file_get_contents($this->getDistributionVersionFilePAth());

        return explode("\n", $data);
    }

    public function getVersionFilePath(InstallableInterface $bundle)
    {
        var_dump($bundle->getVersionFilePath());
    }

    public function getDistributionVersionFilePAth()
    {
        return __DIR__.'/../../../VERSION.txt';
    }

    public function validateCurrent()
    {
    }

    /**
     * @param string $repoFile
     * @param bool   $filter
     *
     * @return InstalledFilesystemRepository
     */
    public function openRepository($repoFile, $filter = true)
    {
        $json = new JsonFile($repoFile);

        if (!$json->exists()) {
            throw new \RuntimeException(
               "'{$this->previousRepoFile}' must be writable",
               456 // this code is there for unit testing only
            );
        }

        $repo = new InstalledFilesystemRepository($json);

        if ($filter) {
            foreach ($repo->getPackages() as $package) {
                if ($package->getType() !== 'claroline-core'
                    && $package->getType() !== 'claroline-plugin') {
                    $repo->removePackage($package);
                }
            }
        }

        return $repo;
    }
}
