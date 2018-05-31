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
        $this->log('Migrating Scorm 1.2 resources...');
        $this->log('Migrating Scorm 2004 resources...');

        $om = $this->container->get('claroline.persistence.object_manager');
    }
}
