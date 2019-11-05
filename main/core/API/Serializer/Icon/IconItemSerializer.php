<?php

namespace Claroline\CoreBundle\API\Serializer\Icon;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Icon\IconItem;
use Claroline\CoreBundle\Entity\Icon\IconSet;

class IconItemSerializer
{
    use SerializerTrait;

    /** @var IconSetSerializer */
    private $iconSetSerializer;

    private $iconSetRepo;

    /**
     * IconItemSerializer constructor.
     *
     * @param IconSetSerializer $iconSetSerializer
     * @param ObjectManager     $om
     */
    public function __construct(IconSetSerializer $iconSetSerializer, ObjectManager $om)
    {
        $this->iconSetSerializer = $iconSetSerializer;

        $this->iconSetRepo = $om->getRepository(IconSet::class);
    }

    /**
     * @return string
     */
    public function getClass()
    {
        return IconItem::class;
    }

    /**
     * Serializes an IconItem entity for the JSON api.
     *
     * @param IconItem $iconItem
     * @param array    $options
     *
     * @return array
     */
    public function serialize(IconItem $iconItem, array $options = [])
    {
        $serialized = [
            'id' => $iconItem->getUuid(),
            'mimeType' => $iconItem->getMimeType(),
            'relativeUrl' => $iconItem->getRelativeUrl(),
            'name' => $iconItem->getName(),
            'class' => $iconItem->getClass(),
        ];

        if (!in_array(Options::SERIALIZE_MINIMAL, $options)) {
            $serialized['iconSet'] = $this->iconSetSerializer->serialize($iconItem->getIconSet());
        }

        return $serialized;
    }

    /**
     * Deserializes IconItem data into entities.
     *
     * @param array    $data
     * @param IconItem $iconItem
     *
     * @return IconItem
     */
    public function deserialize($data, IconItem $iconItem)
    {
        $this->sipe('id', 'setUuid', $data, $iconItem);
        $this->sipe('mimeType', 'setMimeType', $data, $iconItem);
        $this->sipe('relativeUrl', 'setRelativeUrl', $data, $iconItem);
        $this->sipe('name', 'setName', $data, $iconItem);
        $this->sipe('class', 'setClass', $data, $iconItem);

        if (isset($data['iconSet']['id']) && !$iconItem->getIconSet()) {
            $iconSet = $this->iconSetRepo->findOneBy(['uuid' => $data['iconSet']['id']]);

            if ($iconSet) {
                $iconItem->setIconSet($iconSet);
            }
        }

        return $iconItem;
    }
}
