<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AuthenticationBundle\DependencyInjection\Compiler;

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class SamlConfigPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        /** @var PlatformConfigurationHandler $configHandler */
        $configHandler = $container->get(PlatformConfigurationHandler::class);

        $container->setParameter('entity_id', $configHandler->getParameter('external_authentication.saml.entity_id'));
        $container->setParameter('credentials', $configHandler->getParameter('external_authentication.saml.credentials'));
        $container->setParameter('idp', $configHandler->getParameter('external_authentication.saml.idp'));
    }
}
