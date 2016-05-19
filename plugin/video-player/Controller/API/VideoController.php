<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\VideoPlayerBundle\Controller\API\User;

use JMS\DiExtraBundle\Annotation as DI;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\Delete;
use Claroline\CoreBundle\Entity\Resource\File;
use Claroline\VideoPlayerBundle\Entity\Track;

/**
 * @NamePrefix("api_")
 */
class VideoController extends FOSRestController
{
    /**
     * @DI\InjectParams({
     * })
     */
    public function __construct(
    ) {
    }

    /**
     * @Post("/video/{video}/track", name="post_video_track", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_video"})
     */
    public function postTrackAction(File $video)
    {
    }

    /**
     * @Get("/video/{video}/tracks", name="get_video_tracks", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_video"})
     */
    public function getTracksAction(File $video)
    {
    }

    /**
     * @Delete("/video/track/{track}", name="delete_video_track", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_video"})
     */
    public function deleteTrackAction(Track $track)
    {
    }

    /**
     * @Get("/video/track/{track}", name="get_video_track", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_video"})
     */
    public function getTrackAction(Track $track)
    {
    }

    /**
     * @Get("/video//track/{track}/stream", name="get_video_track_stream", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_video"})
     */
    public function streamTrackAction(Track $track)
    {
    }

    /**
     * @Get("/video/{video}/stream", name="get_video_stream", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_video"})
     */
    public function streamVideoAction(File $video)
    {
    }
}
