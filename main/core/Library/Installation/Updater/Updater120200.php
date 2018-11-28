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

class Updater120200 extends Updater
{
    protected $logger;

    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->logger = $logger;
    }

    public function postUpdate()
    {
        $this->generatePlatformTemplates();
    }

    public function generatePlatformTemplates()
    {
        $this->log('Generating platform templates...');
    }
}
