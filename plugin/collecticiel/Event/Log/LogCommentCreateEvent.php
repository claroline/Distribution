<?php

namespace Innova\CollecticielBundle\Event\Log;

use Claroline\CoreBundle\Event\Log\AbstractLogResourceEvent;
use Claroline\CoreBundle\Event\Log\LogGenericEvent;
use Innova\CollecticielBundle\Entity\Comment;
use Innova\CollecticielBundle\Entity\Dropzone;

class LogCommentCreateEvent extends AbstractLogResourceEvent
{
    const ACTION = 'resource-innova_collecticiel-comment_create';

    /**
     * @param Dropzone $dropzone
     * @param mixed    $dropzoneChangeSet
     * @param comment  $comment
     */
    public function __construct(Dropzone $dropzone, $dropzoneChangeSet, Comment $comment)
    {
        $details = [
            'dropzone' => [
                'id' => $dropzone->getId(),
                'changeSet' => $dropzoneChangeSet,
            ],
            'comment' => [
                'id' => $comment->getId(),
                'document' => $comment->getDocument()->getId(),
                'user' => $comment->getUser(),
            ],
        ];

        parent::__construct($dropzone->getResourceNode(), $details);
    }

    /**
     * @return array
     */
    public static function getRestriction()
    {
        return [LogGenericEvent::DISPLAYED_WORKSPACE];
    }
}
