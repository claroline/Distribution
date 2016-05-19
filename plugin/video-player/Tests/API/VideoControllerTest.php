<?php

namespace Claroline\CoreBundle\Tests\API\User;

use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use Claroline\CoreBundle\Library\Testing\Persister;

class VideoControllerTest extends TransactionalTestCase
{
    protected function setUp()
    {
        parent::setUp();
        $this->persister = $this->client->getContainer()->get('claroline.library.testing.persister');
    }

    /**
     * @Post("/video/{video}/track", name="post_video_track", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_video"})
     */
    public function testPostTrackAction(File $video)
    {
    }

    /**
     * @Get("/video/{video}/tracks", name="get_video_tracks", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_video"})
     */
    public function testGetTracksAction(File $video)
    {
    }

    /**
     * @Delete("/video/track/{track}", name="delete_video_track", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_video"})
     */
    public function testDeleteTrackAction(Track $track)
    {
    }

    /**
     * @Get("/video/track/{track}", name="get_video_track", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_video"})
     */
    public function testGetTrackAction(Track $track)
    {
    }

    /**
     * @Get("/video//track/{track}/stream", name="get_video_track_stream", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_video"})
     */
    public function testStreamTrackAction(Track $track)
    {
    }

    /**
     * @Get("/video/{video}/stream", name="get_video_stream", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_video"})
     */
    public function testStreamVideoAction(File $video)
    {
    }
}
