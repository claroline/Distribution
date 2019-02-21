<?php

namespace Claroline\ForumBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\File\PublicFileSerializer;
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

    /** @var SerializerProvider */
    private $serializer;

    /** @var AbstractMessageSerializer */
    private $messageSerializer;

    /** @var AbstractMessageSerializer */
    private $subjectSerializer;

    /** @var ObjectManager */
    private $om;

    /** @var PublicFileSerializer */
    private $fileSerializer;

    /**
     * MessageSerializer constructor.
     *
     * @DI\InjectParams({
     *     "serializer"        = @DI\Inject("claroline.api.serializer"),
     *     "messageSerializer" = @DI\Inject("claroline.serializer.message"),
     *     "om"                = @DI\Inject("claroline.persistence.object_manager"),
     *     "subjectSerializer" = @DI\Inject("claroline.serializer.forum_subject"),
     *     "fileSerializer"    = @DI\Inject("claroline.serializer.public_file")
     * })
     *
     * @param SerializerProvider        $serializer
     * @param AbstractMessageSerializer $messageSerializer
     * @param ObjectManager             $om
     * @param SubjectSerializer         $subjectSerializer
     * @param PublicFileSerializer      $fileSerializer
     */
    public function __construct(
        SerializerProvider $serializer,
        AbstractMessageSerializer $messageSerializer,
        ObjectManager $om,
        SubjectSerializer $subjectSerializer,
        PublicFileSerializer $fileSerializer
    ) {
        $this->serializer = $serializer;
        $this->messageSerializer = $messageSerializer;
        $this->om = $om;
        $this->subjectSerializer = $subjectSerializer;
        $this->fileSerializer = $fileSerializer;
    }

    public function getClass()
    {
        return Message::class;
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
        $subject = $message->getSubject();

        if ($subject) {
            $data['subject'] = [
                'id' => $subject->getUuid(),
                'title' => $subject->getTitle(),
            ];
            if ($subject->getForum() && $subject->getForum()->getResourceNode()) {
                $data['meta']['resource'] = [
                    'id' => $subject->getForum()->getResourceNode()->getId(),
                ];
            }

            $data['meta']['poster'] = $subject->getPoster() ?
              $this->fileSerializer->serialize($subject->getPoster()) :
              null;
        }

        $data['meta']['flagged'] = $message->isFlagged();
        $data['meta']['moderation'] = $message->getModerated();

        return $data;
    }

    /**
     * Deserializes data into a Message entity.
     *
     * @param array   $data
     * @param Message $message
     * @param array   $options
     *
     * @return Message
     */
    public function deserialize($data, Message $message, array $options = [])
    {
        $message = $this->messageSerializer->deserialize($data, $message, $options);

        $this->sipe('meta.flagged', 'setFlagged', $data, $message);
        $this->sipe('meta.moderation', 'setModerated', $data, $message);

        if (isset($data['subject'])) {
            $subject = $this->serializer->deserialize(
                'Claroline\ForumBundle\Entity\Subject',
                $data['subject']
            );

            if (!empty($subject)) {
                $message->setSubject($subject);
                $message->setModerated($subject->getModerated());
            }
        }

        if (isset($data['parent'])) {
            $parent = $this->om->getRepository($this->getClass())->findOneBy(['uuid' => $data['parent']['id']]);

            if ($parent) {
                $message->setParent($parent);
            }
        }

        return $message;
    }
}
