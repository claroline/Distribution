<?php

namespace Claroline\CoreBundle\API\Serializer\Task;

use Claroline\CoreBundle\Entity\Task\ScheduledTask;
use Claroline\CoreBundle\Entity\Theme\Theme;
use Claroline\CoreBundle\Manager\Theme\ThemeManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.scheduled_task")
 * @DI\Tag("claroline.serializer")
 */
class ScheduledTaskSerializer
{
    /**
     * Serializes a ScheduledTask entity for the JSON api.
     *
     * @param ScheduledTask $scheduledTask - the task to serialize
     *
     * @return array - the serialized representation of the task
     */
    public function serialize(ScheduledTask $scheduledTask)
    {
        return [
            'id' => $scheduledTask->getId(),
            'type' => $scheduledTask->getType(),
            'name' => $scheduledTask->getName(),
            'scheduledDate' => $scheduledTask->getScheduledDate()->format('Y-m-d\TH:i:s'),
            'data' => $scheduledTask->getData(),
            'meta' => [
                'lastExecution' => $scheduledTask->getExecutionDate() ? $scheduledTask->getExecutionDate()->format('Y-m-d\TH:i:s') : null,
            ]
        ];
    }
}
