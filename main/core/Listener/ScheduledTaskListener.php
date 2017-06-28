<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Listener;

use Claroline\CoreBundle\Event\GenericDataEvent;
use Claroline\CoreBundle\Manager\MailManager;
use Claroline\CoreBundle\Manager\ScheduledTaskManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 */
class ScheduledTaskListener
{
    private $mailManager;
    private $taskManager;

    /**
     * @DI\InjectParams({
     *     "mailManager" = @DI\Inject("claroline.manager.mail_manager"),
     *     "taskManager" = @DI\Inject("claroline.manager.scheduled_task_manager"),
     * })
     */
    public function __construct(
        MailManager $mailManager,
        ScheduledTaskManager $taskManager
    ) {
        $this->mailManager = $mailManager;
        $this->taskManager = $taskManager;
    }

    /**
     * @DI\Observe("claroline_scheduled_task_execute_mail")
     *
     * @param GenericDataEvent $event
     */
    public function onExecuteMailTask(GenericDataEvent $event)
    {
        $task = $event->getData();
        $data = $task->getData();
        $users = $task->getUsers();
        $object = isset($data['object']) ? $data['object'] : null;
        $content = isset($data['content']) ? $data['content'] : null;

        if (count($users) > 0 && !empty($object) && !empty($content)) {
            $this->mailManager->send($object, $content, $users);
            $this->taskManager->markTaskAsExecuted($task, new \DateTime());
        }
        $event->stopPropagation();
    }
}
