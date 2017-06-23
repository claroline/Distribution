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
use Claroline\CoreBundle\Entity\Version;
use Claroline\CoreBundle\Persistence\ObjectManager;
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
        $this->repo = $this->om->getRepository('ClarolineCoreBundle:Version');
        $this->container = $container;
    }

    public function registerCurrent()
    {
        $this->log('Registering current version');
        $data = $this->getVersionFile();
        $version = $this->repo->findOneByVersion($data[0]);

        if ($version) {
            $this->log("Version {$version->getVersion()} already registered !", LogLevel::ERROR);

            return;
        }

        $version = new Version($data[0], $data[1], $data[2]);
        $this->om->persist($version);
        $this->om->flush();
    }

    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;

        return $this;
    }

    public function getCurrent()
    {
    }

    public function getLatestUpgraded()
    {
    }

    public function getVersionFile()
    {
        $data = file_get_contents($this->getVersionFilePath());

        return explode("\n", $data);
    }

    public function getVersionFilePath()
    {
        return __DIR__.'/../../../VERSION.txt';
    }

    public function validateCurrent()
    {
    }
}
