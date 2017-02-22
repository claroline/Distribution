<?php

namespace UJM\ExoBundle\Serializer\Item\Type;

use Claroline\CoreBundle\Library\Utilities\FileUtilities;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Content\Audio;
use UJM\ExoBundle\Entity\ItemType\AudioContentItem;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.item_audio_content")
 */
class AudioContentItemSerializer implements SerializerInterface
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
     * Converts an audio content item into a JSON-encodable structure.
     *
     * @param AudioContentItem $audioContentItem
     * @param array            $options
     *
     * @return \stdClass
     */
    public function serialize($audioContentItem, array $options = [])
    {
        $itemData = new \stdClass();
        $itemData->file = $this->serializeAudio($audioContentItem);

        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
            $itemData->solutions = 'none';
        }

        return $itemData;
    }

    /**
     * Converts raw data into an audio content item entity.
     *
     * @param \stdClass        $data
     * @param AudioContentItem $audioContentItem
     * @param array            $options
     *
     * @return AudioContentItem
     */
    public function deserialize($data, $audioContentItem = null, array $options = [])
    {
        if (empty($audioContentItem)) {
            $audioContentItem = new AudioContentItem();
        }
        $this->deserializeAudio($audioContentItem, $data->file, $options);

        return $audioContentItem;
    }

    /**
     * Serializes the audio of the Audio content item.
     *
     * @param AudioContentItem $item
     *
     * @return \stdClass
     */
    private function serializeAudio(AudioContentItem $item)
    {
        $itemAudio = $item->getAudio();
        $audio = new \stdClass();
        $audio->id = $itemAudio->getUuid();
        $audio->type = $itemAudio->getType();

        if (strpos($itemAudio->getUrl(), './') === 0) {
            $audio->url = substr($itemAudio->getUrl(), 2);
        } else {
            $audio->url = $itemAudio->getUrl();
        }

        return $audio;
    }

    /**
     * Deserializes the audio of the Audio content item.
     *
     * @param AudioContentItem $item
     * @param \stdClass        $imageData
     * @param array            $options
     */
    private function deserializeAudio(AudioContentItem $item, \stdClass $audioData, array $options)
    {
        $typeParts = explode('/', $audioData->type);
        $audio = $item->getAudio() ?: new Audio();

        if (!in_array(Transfer::USE_SERVER_IDS, $options)) {
            $audio->setUuid($audioData->id);
        }
        $audio->setType($audioData->type);
        $audio->setTitle($audioData->id);

        if (isset($audioData->data)) {
            $objectClass = get_class($audio);
            $objectUuid = $audio->getUuid();
            $objectName = $audio->getTitle();
            $audioParts = explode(',', $audioData->data);
            $audioBin = base64_decode($audioParts[1]);

            $file = $this->fileUtils->createFileFromData(
                $audioBin,
                $audioData->type,
                $audioData->name,
                $typeParts[1],
                $audioData->_size,
                $objectClass,
                $objectUuid,
                $objectName,
                $objectClass
            );
            $audio->setUrl($file->getUrl());
        }
        $item->setAudio($audio);
    }
}
