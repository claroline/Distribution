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

use Claroline\CoreBundle\Persistence\ObjectManager;
use FOS\RestBundle\View\View;
use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\Entity\Version;

/**
 * @DI\Service("claroline.manager.version_manager")
 */
class VersionManager
{
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
        $data = $this->getVersionFile();
        $version = $this->repo->findOneByVersion($data[0]):
        if ($version) {
           throw new \Exception('Version already registered');
        }
        
        $version = new Version($data[0], $data[1], $data[2]);
        $this->om->persist($version);
        $this->om->flush();
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

        return split('\n', $data);
    }

    public function getVersionFilePath()
    {
        return __DIR__ . '/../../VERSION.txt'
    }

    public function validateCurrent()
    {
    }
}
