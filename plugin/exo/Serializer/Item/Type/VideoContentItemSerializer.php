<?php

namespace UJM\ExoBundle\Serializer\Item\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\ItemType\VideoContentItem;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.item_video_content")
 */
class VideoContentItemSerializer implements SerializerInterface
{
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
        $itemData->file = ['data' => ''];
//        $itemData->file = $videoContentItem->getText();
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

//        if (isset($data->text)) {
//            $videoContentItem->setText($data->text);
//        }

        return $videoContentItem;
    }
}
