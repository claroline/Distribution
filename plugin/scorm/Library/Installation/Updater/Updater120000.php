<?php

namespace Claroline\ScormBundle\Library\Installation\Updater;

use Claroline\InstallationBundle\Updater\Updater;

class Updater120000 extends Updater
{
    private $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public function postUpdate()
    {
        $scormManager = $this->container->get('claroline.manager.scorm_manager');

        $this->log('Migrating Scorm 1.2 resources...');
        $scormManager->convertAllScorm12();

        $this->log('Migrating Scorm 2004 resources...');
        $scormManager->convertAllScorm2004();
    }
}
