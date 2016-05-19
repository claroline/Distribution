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
use Claroline\CoreBundle\Library\Utilities\ClaroUtilities;

/**
 * @DI\Service("claroline.manager.video_player_manager")
 */
class VideoPlayerManager
{
    private $om;
    private $fileDir;
    private $utils;

    /**
     * @DI\InjectParams({
     *      "om"         = @DI\Inject("claroline.persistence.object_manager"),
     *      "fileDir"    = @DI\Inject("%claroline.param.files_directory%"),
     *      "utils"      = @DI\Inject("claroline.utilities.misc")
     * })
     */
    public function __construct(
        ObjectManager $om,
        $fileDir,
        ClaroUtilities $utils
    ) {
        $this->om = $om;
        $this->fileDir = $fileDir;
        $this->utils = $utils;
    }

    public function createSubtitles(File $video, File $subtitles, $lang, $isDefault)
    {
        $track = new Track();
        $track->setVideo($video);
        $track->setLang($lang);
        $track->setKind('subtitles');
        $track->setDefault($isDefault);
        $hashName = $this->utils->generateGuid();
        $track->setHashName($hashName);
        $this->om->persist($track);
        $this->om->flush();
    }

    public function removeTrack(Track $track)
    {
        $this->om->remove($track);
        $this->om->flush();
    }

    public function getTracksByVideo(File $video)
    {
        $this->om->getRepository('Claroline\VideoPlayerBundle\Entity\Track')->findByVideo($video);
    }
}
