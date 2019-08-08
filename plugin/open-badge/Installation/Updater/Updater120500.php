<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\OpenBadgeBundle\Installation\Updater;

use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Updater120500 extends Updater
{
    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->logger = $logger;

        //$this->ruleManager = $container->get('claroline.manager.open_badge.rule_manager');
    }

    public function postUpdate()
    {
        $this->ruleManager->createRules();
    }
}
