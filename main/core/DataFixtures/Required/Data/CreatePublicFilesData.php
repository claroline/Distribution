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
        $publicFilesDir = $this->container->getParameter('claroline.param.public_files_directory');
        $dataWebDir = $this->container->getParameter('claroline.param.data_web_dir');

        if (!$fileSystem->exists($publicFilesDir)) {
            $fileSystem->mkdir($publicFilesDir);
        }
        if (!$fileSystem->exists($dataWebDir)) {
            $fileSystem->symlink($publicFilesDir, $dataWebDir);
        }
    }
}
