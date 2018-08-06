<?php

namespace Claroline\MessageBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\Entity\AbstractMessage;
use Claroline\MessageBundle\Entity\UserMessage;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.messaging_send")
 * @DI\Tag("claroline.serializer")
 */
class UserMessageSerializer
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

    public function getClass()
    {
        return UserMessage::class;
    }
}
