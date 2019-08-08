<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ForumBundle;

use Claroline\CoreBundle\Library\DistributionPluginBundle;
use Claroline\ForumBundle\Installation\AdditionalInstaller;

/**
 * Bundle class.
 */
class ClarolineForumBundle extends DistributionPluginBundle
{
    public function getAdditionalInstaller()
    {
        return new AdditionalInstaller();
    }

    public function getRequiredPlugins()
    {
        return ['Claroline\\TagBundle\\ClarolineTagBundle'];
    }
}
