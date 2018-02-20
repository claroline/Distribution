<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AppBundle;

use Claroline\AppBundle\DependencyInjection\Compiler\ApiConfigPass;
use Claroline\CoreBundle\Library\DistributionPluginBundle;
use Claroline\KernelBundle\Bundle\ConfigurationBuilder;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class ClarolineAppBundle extends DistributionPluginBundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->addCompilerPass(new ApiConfigPass());
    }

    public function supports($environment)
    {
        return true;
    }

    public function getConfiguration($environment)
    {
        return new ConfigurationBuilder();
    }
}
