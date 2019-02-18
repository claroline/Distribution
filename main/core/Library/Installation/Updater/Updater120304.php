<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Library\Installation\Updater;

use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Updater120304 extends Updater
{
    const BATCH_SIZE = 500;

    protected $logger;

    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->logger = $logger;
        $this->container = $container;
        $this->userManager = $container->get('claroline.manager.user_manager');
    }

    public function postUpdate()
    {
        $this->userManager->setLogger($this->logger);
        $this->userManager->bindUserToOrganization();
    }
}
