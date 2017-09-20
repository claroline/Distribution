<?php

namespace Claroline\CoreBundle\API\Serializer\Task;

use Claroline\CoreBundle\Entity\Task\ScheduledTask;
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
            ],
        ];
    }

    /**
     * Deserializes JSON api data into a ScheduledTask entity.
     *
     * @param array         $data          - the data to deserialize
     * @param ScheduledTask $scheduledTask - the task entity to update
     *
     * @return ScheduledTask - the updated task entity
     */
    public function deserialize(array $data, ScheduledTask $scheduledTask = null)
    {
        $scheduledTask = $scheduledTask ?: new ScheduledTask();

        $scheduledTask->setName($data['name']);
        $scheduledTask->setType($data['type']);

        $scheduledDate = \DateTime::createFromFormat('Y-m-d\TH:i:s', $data['scheduledDate']);
        $scheduledTask->setScheduledDate($scheduledDate);

        if (isset($data['data'])) {
            $scheduledTask->setData($data['data']);
        }

        // todo users, workspaces, groups

        /*foreach ($users as $user) {
            $task->addUser($user);
        }
        $task->setGroup($group);
        $task->setWorkspace($workspace);*/

        return $scheduledTask;
    }
}
