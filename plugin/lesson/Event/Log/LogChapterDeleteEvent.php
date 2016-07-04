<?php

namespace Icap\LessonBundle\Event\Log;

use Claroline\CoreBundle\Event\Log\AbstractLogResourceEvent;
use Icap\LessonBundle\Entity\Chapter;
use Icap\LessonBundle\Entity\Lesson;

class LogChapterDeleteEvent extends AbstractLogResourceEvent
{
    const ACTION = 'resource-icap_lesson-chapter_delete';

    /**
     * @param Lesson $lesson
     * @param string $chaptername
     */
    public function __construct(Lesson $lesson, $chaptername)
    {
        $details = [
            'chapter' => [
                'lesson' => $lesson->getId(),
                'title' => $chaptername,
            ],
        ];
        parent::__construct($lesson->getResourceNode(), $details);
    }

    /**
     * @return array
     */
    public static function getRestriction()
    {
        return [self::DISPLAYED_WORKSPACE];
    }
}
