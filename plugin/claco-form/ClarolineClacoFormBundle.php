<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ClacoFormBundle;

use Claroline\ClacoFormBundle\Library\Installation\AdditionalInstaller;
use Claroline\CoreBundle\Library\DistributionPluginBundle;

class ClarolineClacoFormBundle extends DistributionPluginBundle
{
    public function hasMigrations()
    {
        return true;
    }

    public function getAdditionalInstaller()
    {
        return new AdditionalInstaller();
    }

    public function getRequiredPlugins()
    {
        return ['Claroline\\MessageBundle\\ClarolineMessageBundle'];
    }
}
