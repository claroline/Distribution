<?php

namespace Icap\FormulaPluginBundle;

use Claroline\CoreBundle\Library\DistributionPluginBundle;
use Claroline\KernelBundle\Bundle\ConfigurationBuilder;
use Icap\FormulaPluginBundle\Installation\AdditionalInstaller;

/**
 * Formula Plugin bundle class.
 */
class IcapFormulaPluginBundle extends DistributionPluginBundle
{
    public function hasMigrations()
    {
        return false;
    }
}
