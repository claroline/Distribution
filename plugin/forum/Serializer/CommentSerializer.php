<?php

namespace Claroline\ForumBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\API\Serializer\MessageSerializer;
use Claroline\ForumBundle\Entity\Comment;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.forum_comment")
 * @DI\Tag("claroline.serializer")
 */
class CommentSerializer
{
    use SerializerTrait;

    private $messageSerializer;

    /**
     * @DI\InjectParams({
     *     "messageSerializer" = @DI\Inject("claroline.serializer.message")
     * })
     *
     * @param AbstractMessageSerializer $serializer
     */
    public function __construct(MessageSerializer $messageSerializer)
    {
        $this->messageSerializer = $messageSerializer;
    }

    public function getClass()
    {
        return 'Claroline\ForumBundle\Entity\Comment';
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/plugin/forum/comment.json';
    }

    /**
     * @return string
     */
    public function getSamples()
    {
        return '#/plugin/forum/comment';
    }

    /**
     * Serializes a Comment entity.
     *
     * @param Comment $message
     * @param array   $options
     *
     * @return array
     */
    public function serialize(Comment $comment, array $options = [])
    {
        $data = $this->messageSerializer->serialize($comment, $options);

        $data['message'] = [
          'id' => $comment->getMessage()->getId(),
        ];

        return $data;
    }

    /**
     * Deserializes data into a Comment entity.
     *
     * @param array   $data
     * @param Comment $message
     * @param array   $options
     *
     * @return Comment
     */
    public function deserialize($data, Comment $comment, array $options = [])
    {
        $comment = $this->messageSerializer->deserialize($data, $comment, $options);

        //set message

        return $comment;
    }
}
