<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\VideoPlayerBundle\Controller\API;

use JMS\DiExtraBundle\Annotation as DI;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\Delete;
use Claroline\CoreBundle\Entity\Resource\File;
use Claroline\VideoPlayerBundle\Entity\Track;
use Claroline\VideoPlayerBundle\Manager\VideoPlayerManager;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @NamePrefix("api_")
 */
class VideoController extends FOSRestController
{
    /**
     * @DI\InjectParams({
     *     "videoManager" = @DI\Inject("claroline.manager.video_player_manager"),
     *     "request"      = @DI\Inject("request"),
     *     "fileDir"      = @DI\Inject("%claroline.param.files_directory%")
     * })
     */
    public function __construct(VideoPlayerManager $videoManager, Request $request, $fileDir)
    {
        $this->videoManager = $videoManager;
        $this->request = $request;
        $this->fileDir = $fileDir;
    }

    /**
     * @Post("/video/{video}/track", name="post_video_track", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_resource"})
     */
    public function postTrackAction(File $video)
    {
        $track = $this->request->request->get('track');
        $isDefault = isset($track['is_default']) ? $track['is_default'] : false;
        $fileBag = $this->request->files->get('track');

        return $this->videoManager->createTrack($video, $fileBag['track'], $track['lang'], $isDefault);
    }

    /**
     * @Get("/video/{video}/tracks", name="get_video_tracks", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_resource"})
     */
    public function getTracksAction(File $video)
    {
        return $this->videoManager->getTracksByVideo($video);
    }

    /**
     * @Delete("/video/track/{track}", name="delete_video_track", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_video"})
     */
    public function deleteTrackAction(Track $track)
    {
        $this->videoManager->removeTrack($track);

        return [];
    }

    /**
     * @Get("/video/track/{track}/stream", name="get_video_track_stream", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_video"})
     */
    public function streamTrackAction(Track $track)
    {
        $file = $track->getTrackFile();

        return $this->returnFile($file);
    }

    /**
     * @Get("/video/{video}/stream", name="get_video_stream", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_video"})
     */
    public function streamVideoAction(File $video)
    {
        return $this->returnFile($video);
    }

    private function returnFile(File $file)
    {
        // see https://github.com/claroline/CoreBundle/commit/7cee6de85bbc9448f86eb98af2abb1cb072c7b6b
        $this->get('session')->save();
        $path = $this->fileDir.DIRECTORY_SEPARATOR.$file->getHashName();
        $response = new BinaryFileResponse($path);

        return $response;
    }
}
