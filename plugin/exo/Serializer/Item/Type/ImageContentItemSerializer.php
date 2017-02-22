<?php

namespace UJM\ExoBundle\Serializer\Item\Type;

use Claroline\CoreBundle\Library\Utilities\FileUtilities;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Content\Image;
use UJM\ExoBundle\Entity\ItemType\ImageContentItem;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.item_image_content")
 */
class ImageContentItemSerializer implements SerializerInterface
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
     * Converts an image content item into a JSON-encodable structure.
     *
     * @param ImageContentItem $imageContentItem
     * @param array            $options
     *
     * @return \stdClass
     */
    public function serialize($imageContentItem, array $options = [])
    {
        $itemData = new \stdClass();
        $itemData->file = $this->serializeImage($imageContentItem);

        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
            $itemData->solutions = 'none';
        }

        return $itemData;
    }

    /**
     * Converts raw data into an image content item entity.
     *
     * @param \stdClass        $data
     * @param ImageContentItem $imageContentItem
     * @param array            $options
     *
     * @return ImageContentItem
     */
    public function deserialize($data, $imageContentItem = null, array $options = [])
    {
        if (empty($imageContentItem)) {
            $imageContentItem = new ImageContentItem();
        }
        $this->deserializeImage($imageContentItem, $data->file, $options);

        return $imageContentItem;
    }

    /**
     * Serializes the image of the Image content item.
     *
     * @param ImageContentItem $item
     *
     * @return \stdClass
     */
    private function serializeImage(ImageContentItem $item)
    {
        $itemImage = $item->getImage();
        $image = new \stdClass();
        $image->id = $itemImage->getUuid();
        $image->type = $itemImage->getType();

        if (strpos($itemImage->getUrl(), './') === 0) {
            $image->url = substr($itemImage->getUrl(), 2);
        } else {
            $image->url = $itemImage->getUrl();
        }
        $image->width = $itemImage->getWidth();
        $image->height = $itemImage->getHeight();

        return $image;
    }

    /**
     * Deserializes the image of the Image content item.
     *
     * @param ImageContentItem $item
     * @param \stdClass        $imageData
     * @param array            $options
     */
    private function deserializeImage(ImageContentItem $item, \stdClass $imageData, array $options)
    {
        $image = $item->getImage();

        if (empty($image)) {
            $image = new Image();
            $typeParts = explode('/', $imageData->type);

            if (!in_array(Transfer::USE_SERVER_IDS, $options)) {
                $image->setUuid($imageData->id);
            }
            $image->setType($imageData->type);
            $image->setTitle($imageData->id);
            $image->setWidth($imageData->width);
            $image->setHeight($imageData->height);

            if (isset($imageData->data)) {
                $objectClass = get_class($image);
                $objectUuid = $image->getUuid();
                $objectName = $image->getTitle();
                $imageParts = explode(',', $imageData->data);
                $imageBin = base64_decode($imageParts[1]);

                $file = $this->fileUtils->createFileFromData(
                    $imageBin,
                    $imageData->type,
                    $imageData->name,
                    $typeParts[1],
                    $imageData->_size,
                    $objectClass,
                    $objectUuid,
                    $objectName,
                    $objectClass
                );
                $image->setUrl($file->getUrl());
            }
            $item->setImage($image);
        }
    }
}
