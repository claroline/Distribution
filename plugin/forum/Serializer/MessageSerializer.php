<?php

namespace Claroline\ForumBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\API\Serializer\MessageSerializer as AbstractMessageSerializer;
use Claroline\ForumBundle\Entity\Message;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.forum_message")
 * @DI\Tag("claroline.serializer")
 */
class MessageSerializer
{
    use SerializerTrait;

    private $messageSerializer;

    /**
     * ParametersSerializer constructor.
     *
     * @DI\InjectParams({
     *     "messageSerializer" = @DI\Inject("claroline.serializer.message")
     * })
     *
     * @param AbstractMessageSerializer $serializer
     */
    public function __construct(AbstractMessageSerializer $messageSerializer)
    {
        $this->messageSerializer = $messageSerializer;
    }

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
        $data = $this->messageSerializer->serialize($message, $options);

        $data['subject'] = [
          'id' => $message->getSubject()->getId(),
        ];

        return $data;
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
        $message = $this->messageSerializer->deserialize($data, $message, $options);

        //set subject ?

        return $message;
    }
}
