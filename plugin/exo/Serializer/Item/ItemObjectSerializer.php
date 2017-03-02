<?php

namespace UJM\ExoBundle\Serializer\Item;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Item\ItemObject;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * Serializer for item object data.
 *
 * @DI\Service("ujm_exo.serializer.item_object")
 */
class ItemObjectSerializer implements SerializerInterface
{
    /**
     * Converts a ItemObject into a JSON-encodable structure.
     *
     * @param ItemObject $itemObject
     * @param array      $options
     *
     * @return \stdClass
     */
    public function serialize($itemObject, array $options = [])
    {
        $itemObjectData = new \stdClass();
        $itemObjectData->id = $itemObject->getUuid();
        $itemObjectData->type = $itemObject->getMimeType();

        if (1 === preg_match('#^text\/[^/]+$#', $itemObject->getMimeType())) {
            $itemObjectData->data = $itemObject->getData();
        } else {
            $itemObjectData->url = $itemObject->getData();
        }
        if ($itemObject->getTitle()) {
            $itemObjectData->title = $itemObject->getTitle();
        }

        return $itemObjectData;
    }

    /**
     * Converts raw data into a ItemObject entity.
     *
     * @param \stdClass  $data
     * @param ItemObject $itemObject
     * @param array      $options
     *
     * @return ItemObject
     */
    public function deserialize($data, $itemObject = null, array $options = [])
    {
        if (empty($itemObject)) {
            $itemObject = new ItemObject();
        }
        $itemObject->setMimeType($data->type);

        // Force client ID if needed
        if (!in_array(Transfer::USE_SERVER_IDS, $options)) {
            $itemObject->setUuid($data->id);
        }
        if (isset($data->data)) {
            $itemObject->setData($data->data);
        }
        if (isset($data->title) && !empty($data->title)) {
            $itemObject->setTitle($data->title);
        }

        return $itemObject;
    }
}
