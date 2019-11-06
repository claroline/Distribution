<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ForumBundle\Listener;

use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\API\Finder\User\UserFinder;
use Claroline\ForumBundle\Entity\Message;
use Claroline\ForumBundle\Event\LogPostMessageEvent;

class CrudListener
{
    public function __construct(StrictDispatcher $dispatcher, UserFinder $userFinder)
    {
        $this->dispatcher = $dispatcher;
        $this->userFinder = $userFinder;
    }

    public function onPostCreate(CreateEvent $event)
    {
        $message = $event->getObject();
        $forum = $this->getSubject($message)->getForum();

        $usersToNotify = $this->userFinder->find(['workspace' => $forum->getResourceNode()->getWorkspace()->getUuid()]);
        $this->dispatcher->dispatch('log', LogPostMessageEvent::class, [$message, $usersToNotify]);
    }

    public function onSubjectCreate(CreateEvent $event)
    {
    }

    public function getSubject(Message $message)
    {
        if (!$message->getSubject()) {
            $parent = $message->getParent();

            return $this->getSubject($parent);
        }

        return $message->getSubject();
    }
}
