<?php

namespace Claroline\MessageBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\MessageSerializer as AbstractMessageSerializer;
use Claroline\MessageBundle\Entity\Message;
use Claroline\MessageBundle\Manager\MessageManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @DI\Service("claroline.serializer.messaging_message")
 * @DI\Tag("claroline.serializer")
 */
class MessageSerializer
{
    use SerializerTrait;

    /** @var AbstractMessageSerializer */
    private $messageSerializer;

    /**
     * ParametersSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om"           = @DI\Inject("claroline.persistence.object_manager"),
     *     "tokenStorage" = @DI\Inject("security.token_storage"),
     *     "manager"      = @DI\Inject("claroline.manager.message_manager"),
     * })
     *
     * @param SerializerProvider        $serializer
     * @param AbstractMessageSerializer $messageSerializer
     */
    public function __construct(
        ObjectManager $om,
        MessageManager $manager,
        TokenStorageInterface $tokenStorage
    ) {
        $this->om = $om;
        $this->tokenStorage = $tokenStorage;
        $this->manager = $manager;
    }

    public function getClass()
    {
        return Message::class;
    }

    /**
     * @return string
     */
    /*
    public function getSchema()
    {
       return '#/plugin/message/message.json';
    }*/

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
        return [
          'object' => $message->getObject(),
          'content' => $message->getContent(),
          'to' => $message->getTo(),
          'children' => array_map(function (Message $child) {
              return $this->serialize($child);
          }, $message->getChildren()->toArray()),
        ];
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
        $this->sipe('object', 'setObject', $data, $message);
        $this->sipe('content', 'setContent', $data, $message);
        $this->sipe('to', 'setTo', $data, $message);
        $currentUser = $this->tokenStorage->getToken()->getUser();

        if (isset($data['parent'])) {
            $parent = $this->om->getRepository(Message::class)->find($data['parent']['id']);
            $message->setParent($parent);
        }

        $message->setSender($currentUser);

        return $message;
    }
}
