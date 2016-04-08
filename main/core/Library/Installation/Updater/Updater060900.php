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

class Updater060900 extends Updater
{
    private $container;

    public function __construct(ContainerInterface $container, $logger)
    {
		$this->logger = $logger;
        $this->container = $container;
    }

    public function postUpdate()
    {
		$this->log('Enable all bundles...');
        $this->container->get('claroline.manager.bundle_manager')->enableAll();
    }
}
