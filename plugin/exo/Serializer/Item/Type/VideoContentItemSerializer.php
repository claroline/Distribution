<?php

namespace UJM\ExoBundle\Serializer\Item\Type;

use Claroline\CoreBundle\Library\Utilities\FileUtilities;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Content\Video;
use UJM\ExoBundle\Entity\ItemType\VideoContentItem;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.item_video_content")
 */
class VideoContentItemSerializer implements SerializerInterface
{
    private $fileUtils;

    /**
     * @DI\InjectParams({
     *     "fileUtils" = @DI\Inject("claroline.utilities.file")
     * })
     */
    public function __construct(FileUtilities $fileUtils)
    {
        $this->fileUtils = $fileUtils;
    }

    /**
     * Converts a video content item into a JSON-encodable structure.
     *
     * @param VideoContentItem $videoContentItem
     * @param array            $options
     *
     * @return \stdClass
     */
    public function serialize($videoContentItem, array $options = [])
    {
        $itemData = new \stdClass();
        $itemData->file = $this->serializeVideo($videoContentItem);

        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
            $itemData->solutions = 'none';
        }

        return $itemData;
    }

    /**
     * Converts raw data into a video content item entity.
     *
     * @param \stdClass        $data
     * @param VideoContentItem $videoContentItem
     * @param array            $options
     *
     * @return VideoContentItem
     */
    public function deserialize($data, $videoContentItem = null, array $options = [])
    {
        if (empty($videoContentItem)) {
            $videoContentItem = new VideoContentItem();
        }
        $this->deserializeVideo($videoContentItem, $data->file, $options);

        return $videoContentItem;
    }

    /**
     * Serializes the video of the Video content item.
     *
     * @param VideoContentItem $item
     *
     * @return \stdClass
     */
    private function serializeVideo(VideoContentItem $item)
    {
        $itemVideo = $item->getVideo();
        $video = new \stdClass();
        $video->id = $itemVideo->getUuid();
        $video->type = $itemVideo->getType();

        if (strpos($itemVideo->getUrl(), './') === 0) {
            $video->url = substr($itemVideo->getUrl(), 2);
        } else {
            $video->url = $itemVideo->getUrl();
        }

        return $video;
    }

    /**
     * Deserializes the video of the Video content item.
     *
     * @param VideoContentItem $item
     * @param \stdClass        $videoData
     * @param array            $options
     */
    private function deserializeVideo(VideoContentItem $item, \stdClass $videoData, array $options)
    {
        $video = $item->getVideo();

        if (empty($video)) {
            $video = new Video();
            $typeParts = explode('/', $videoData->type);

            if (!in_array(Transfer::USE_SERVER_IDS, $options)) {
                $video->setUuid($videoData->id);
            }
            $video->setType($videoData->type);
            $video->setTitle($videoData->id);

            if (isset($videoData->data)) {
                $objectClass = get_class($video);
                $objectUuid = $video->getUuid();
                $objectName = $video->getTitle();
                $videoParts = explode(',', $videoData->data);
                $videoBin = base64_decode($videoParts[1]);

                $file = $this->fileUtils->createFileFromData(
                    $videoBin,
                    $videoData->type,
                    $videoData->name,
                    $typeParts[1],
                    $videoData->_size,
                    $objectClass,
                    $objectUuid,
                    $objectName,
                    $objectClass
                );
                $video->setUrl($file->getUrl());
            }
            $item->setVideo($video);
        }
    }
}
