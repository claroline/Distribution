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

class Updater120549 extends Updater
{
    private $oldConfigDir;
    private $newConfigDir;

    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->logger = $logger;

        $this->oldConfigDir = $container->getParameter('kernel.root_dir').DIRECTORY_SEPARATOR.'config'.DIRECTORY_SEPARATOR;
        $this->newConfigDir = $container->getParameter('claroline.param.config_directory').DIRECTORY_SEPARATOR;
    }

    public function preUpdate()
    {
        $this->migrateConfigFiles();
    }

    private function migrateConfigFiles()
    {
        $this->log(sprintf('Move Claroline config file in "%s"', $this->newConfigDir));

        $filesToMove = [
            'bundles.ini',
            'ip_white_list.yml',
            'platform_options.json',
            'white_list_ip_range.yml',
        ];

        foreach ($filesToMove as $file) {
            if (file_exists($this->oldConfigDir.$file)) {
                rename($this->oldConfigDir.$file, $this->newConfigDir.$file);
            }
        }
    }
}
