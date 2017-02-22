<?php

namespace UJM\ExoBundle\Entity\ItemType;

use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Content\Video;

/**
 * A Video Content item.
 *
 * @ORM\Entity
 * @ORM\Table(name="ujm_item_video_content")
 */
class VideoContentItem extends AbstractItem
{
    /**
     * The video of the content item.
     *
     * @ORM\ManyToOne(
     *     targetEntity="UJM\ExoBundle\Entity\Content\Video",
     *     cascade={"persist"}
     * )
     *
     * @var Video
     */
    private $video;

    /**
     * Gets video.
     *
     * @return Video
     */
    public function getVideo()
    {
        return $this->video;
    }

    /**
     * Sets video.
     *
     * @param Video $video
     */
    public function setVideo(Video $video)
    {
        $this->video = $video;
    }

    public function isContentItem()
    {
        return true;
    }
}
