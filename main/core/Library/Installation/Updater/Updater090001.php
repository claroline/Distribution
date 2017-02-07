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

class Updater090001 extends Updater
{
    private $container;
    private $filesDir;
    private $fileSystem;
    private $webDir;

    public function __construct(ContainerInterface $container, $logger)
    {
        $this->container = $container;
        $this->filesDir = $container->getParameter('claroline.param.files_directory');
        $this->fileSystem = $container->get('filesystem');
        $this->logger = $logger;
        $this->webDir = $container->getParameter('claroline.param.web_dir');
    }

    public function postUpdate()
    {
        $this->createPublicDirectory();
    }

    private function createPublicDirectory()
    {
        $ds = DIRECTORY_SEPARATOR;

        if (!$this->fileSystem->exists($this->filesDir.$ds.'public')) {
            $this->log('Creating public directory in files directory...');
            $this->fileSystem->mkdir($this->filesDir.$ds.'public');
        }
        if (!$this->fileSystem->exists($this->webDir.$ds.'public')) {
            $this->log('Creating symlink to public directory of files directory in web directory...');
            $this->fileSystem->symlink($this->filesDir.$ds.'public', $this->webDir.$ds.'public');
        }
    }
}
