<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager;

use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\File;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Library\Utilities\ClaroUtilities;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Claroline\CoreBundle\Event\StrictDispatcher;

/**
 * @DI\Service("claroline.manager.video_player_manager")
 */
class VideoPlayerManager
{
    private $om;
    private $fileDir;

    /**
     * @DI\InjectParams({
     *      "om"         = @DI\Inject("claroline.persistence.object_manager"),
     *      "fileDir"    = @DI\Inject("%claroline.param.files_directory%")
     * })
     */
    public function __construct(
        ObjectManager $om,
        $fileDir,
    ) {
        $this->om = $om;
        $this->fileDir = $fileDir;
    }
}
