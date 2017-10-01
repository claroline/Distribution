<?php

namespace Claroline\ClacoFormBundle\API\Serializer;

use Claroline\ClacoFormBundle\Entity\Comment;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.clacoform.comment")
 * @DI\Tag("claroline.serializer")
 */
class CommentSerializer
{
    const OPTION_MINIMAL = 'minimal';

    /**
     * Serializes a Comment entity for the JSON api.
     *
     * @param Comment $comment - the comment to serialize
     * @param array   $options - a list of serialization options
     *
     * @return array - the serialized representation of the comment
     */
    public function serialize(Comment $comment, array $options = [])
    {
        $user = $comment->getUser();

        $serialized = [
            'id' => $comment->getId(),
            'content' => $comment->getContent(),
            'status' => $comment->getStatus(),
            'creationDate' => $comment->getCreationDate() ? $comment->getCreationDate()->format('Y-m-d H:i:s') : null,
            'editionDate' => $comment->getEditionDate() ? $comment->getEditionDate()->format('Y-m-d H:i:s') : null,
            'user' => $user ?
                ['id' => $user->getId(), 'firstName' => $user->getFirstName(), 'lastName' => $user->getLastName()] :
                null,
        ];

        return $serialized;
    }
}
