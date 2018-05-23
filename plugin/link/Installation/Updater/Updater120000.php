<?php

namespace Claroline\LinkBundle\Installation\Updater;

use Claroline\InstallationBundle\Updater\Updater;

class Updater120000 extends Updater
{
    private $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public function preUpdate()
    {
        // todo : update ResourceNode class
        // todo : update resource type name
    }
}
