<?php

namespace Claroline\MessageBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\Entity\AbstractMessage;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.message_send")
 */
class MessageSerializer
{
    use SerializerTrait;

    /**
     * Serializes a AbstractMessage entity.
     *
     * @param AbstractMessage $forum
     * @param array           $options
     *
     * @return array
     */
    public function serialize(AbstractMessage $message, array $options = [])
    {
        return [];
    }

    /**
     * Deserializes data into a Forum entity.
     *
     * @param array           $data
     * @param AbstractMessage $message
     * @param array           $options
     *
     * @return Forum
     */
    public function deserialize($data, AbstractMessage $message, array $options = [])
    {
        return $message;
    }
}
