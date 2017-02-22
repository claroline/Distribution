<?php

namespace UJM\ExoBundle\Serializer\Item\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\ItemType\TextContentItem;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.item_text_content")
 */
class TextContentItemSerializer implements SerializerInterface
{
    /**
     * Converts a text content item into a JSON-encodable structure.
     *
     * @param TextContentItem $textContentItem
     * @param array           $options
     *
     * @return \stdClass
     */
    public function serialize($textContentItem, array $options = [])
    {
        $itemData = new \stdClass();
        $itemData->text = $textContentItem->getText();
        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
            $itemData->solutions = 'none';
        }

        return $itemData;
    }

    /**
     * Converts raw data into a text content item entity.
     *
     * @param \stdClass       $data
     * @param TextContentItem $textContentItem
     * @param array           $options
     *
     * @return TextContentItem
     */
    public function deserialize($data, $textContentItem = null, array $options = [])
    {
        if (empty($textContentItem)) {
            $textContentItem = new TextContentItem();
        }

        if (isset($data->text)) {
            $textContentItem->setText($data->text);
        }

        return $textContentItem;
    }
}
