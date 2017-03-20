<?php

namespace FormaLibre\SupportBundle;

use Claroline\CoreBundle\Library\PluginBundle;
use FormaLibre\SupportBundle\Library\Installation\AdditionalInstaller;

class FormaLibreSupportBundle extends PluginBundle
{
    public function hasMigrations()
    {
        return true;
    }

    public function getAdditionalInstaller()
    {
        return new AdditionalInstaller();
    }

    public function getRequiredFixturesDirectory($environment)
    {
        return 'DataFixtures';
    }
}
