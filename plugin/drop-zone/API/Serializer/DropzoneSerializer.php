<?php

namespace Claroline\DropZoneBundle\API\Serializer;

use Claroline\DropZoneBundle\Entity\Dropzone;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.dropzone")
 * @DI\Tag("claroline.serializer")
 */
class DropzoneSerializer
{
    /**
     * @param Dropzone $dropzone
     *
     * @return array
     */
    public function serialize(Dropzone $dropzone)
    {
        return [
            'id' => $dropzone->getId(),
            'uuid' => $dropzone->getUuid()
        ];
    }

    /**
     * @param array    $data
     * @param Dropzone $dropzone
     *
     * @return Dropzone
     */
    public function deserialize(array $data, Dropzone $dropzone = null)
    {
        $dropzone = $dropzone ?: new Dropzone();

        if (isset($data['uuid'])) {
            $dropzone->setUuid($data['uuid']);
        }

        return $dropzone;
    }
}
