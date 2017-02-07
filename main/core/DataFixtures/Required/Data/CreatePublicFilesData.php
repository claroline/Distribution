<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\DataFixtures\Required\Data;

use Claroline\CoreBundle\DataFixtures\Required\RequiredFixture;
use Claroline\CoreBundle\Persistence\ObjectManager;

class CreatePublicFilesData implements RequiredFixture
{
    private $container;

    public function setContainer($container)
    {
        $this->container = $container;
    }

    public function load(ObjectManager $manager)
    {
        $fileSystem = $this->container->get('filesystem');
        $fileDir = $this->container->getParameter('claroline.param.files_directory');
        $webDir = $this->container->getParameter('claroline.param.web_dir');
        $ds = DIRECTORY_SEPARATOR;

        if (!$fileSystem->exists($fileDir.$ds.'public')) {
            $fileSystem->mkdir($fileDir.$ds.'public');
        }
        if (!$fileSystem->exists($webDir.$ds.'public')) {
            $fileSystem->symlink($fileDir.$ds.'public', $webDir.$ds.'public');
        }
    }
}
