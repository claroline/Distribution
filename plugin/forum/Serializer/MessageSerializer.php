<?php

namespace Claroline\ForumBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\ForumBundle\Entity\Message;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.forum_message")
 * @DI\Tag("claroline.serializer")
 */
class MessageSerializer
{
    use SerializerTrait;

    public function getClass()
    {
        return 'Claroline\ForumBundle\Entity\Message';
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/plugin/forum/message.json';
    }

    /**
     * @return string
     */
    public function getSamples()
    {
        return '#/plugin/forum/message';
    }

    /**
     * Serializes a Message entity.
     *
     * @param Message $message
     * @param array   $options
     *
     * @return array
     */
    public function serialize(Message $message, array $options = [])
    {
        return [];
    }

    /**
     * Deserializes data into a Message entity.
     *
     * @param array   $data
     * @param Message $message
     * @param array   $options
     *
     * @return Plugin
     */
    public function deserialize($data, Message $message, array $options = [])
    {
        return $message;
    }
}
