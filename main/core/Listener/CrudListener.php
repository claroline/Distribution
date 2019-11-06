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

use Claroline\AppBundle\Event\Crud\CopyEvent;
use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\AppBundle\Event\Crud\DeleteEvent;
use Claroline\AppBundle\Event\Crud\PatchEvent;
use Claroline\AppBundle\Event\Crud\UpdateEvent;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Listener\Log\LogListener;

class CrudListener
{
    public function __construct(StrictDispatcher $dispatcher, ObjectManager $om, LogListener $logListener)
    {
        $this->dispatcher = $dispatcher;
        $this->om = $om;
        $this->logListener = $logListener;
    }

    public function onResourceCreate(CreateEvent $event)
    {
        $node = $event->getObject();
        $workspace = $node->getWorkspace();
        $usersToNotify = $workspace && $workspace->getId() ?
            $this->om->getRepository(User::class)->findUsersByWorkspaces([$workspace]) :
            [];

        $this->dispatcher->dispatch('log', 'Log\LogResourceCreate', [$node, $usersToNotify]);
    }

    public function onResourceDelete(DeleteEvent $event)
    {
        $node = $event->getObject();

        $this->dispatcher->dispatch('log', 'Log\LogResourceDelete', [$node]);
    }

    public function onResourceCopy(CopyEvent $event)
    {
        $node = $event->getObject();
        $newNode = $event->getCopy();

        $this->dispatcher->dispatch('log', 'Log\LogResourceCopy', [$newNode, $node]);
    }

    public function onResourceUpdate(UpdateEvent $event)
    {
        $node = $event->getObject();
        $uow = $this->om->getUnitOfWork();
        $uow->computeChangeSets();
        $changeSet = $uow->getEntityChangeSet($node);

        if (count($changeSet) > 0) {
            $this->dispatcher->dispatch('log', 'Log\LogResourceUpdate', [$node, $changeSet]);
        }
    }

    public function onWorkspacePreCreate(CreateEvent $event)
    {
        $workspace = $event->getObject();

        $this->dispatcher->dispatch('log', 'Log\LogWorkspaceCreate', [$workspace]);
        //if we create from model, we don't want to trigger the log on every resource and stuff
        $this->logListener->disable();
    }

    public function onWorkspacePreDelete(DeleteEvent $event)
    {
        $workspace = $event->getObject();

        $this->dispatcher->dispatch('log', 'Log\LogWorkspaceDelete', [$workspace]);
        //if we create from model, we don't want to trigger the log on every resource and stuff
        $this->logListener->disable();
    }

    public function onUserCreate(CreateEvent $event)
    {
        $user = $event->getObject();

        $this->dispatcher->dispatch('log', 'Log\LogUserCreate', [$user]);
    }

    public function onGroupCreate(CreateEvent $event)
    {
        $group = $event->getObject();

        $this->dispatcher->dispatch('log', 'Log\LogGroupCreate', [$group]);
    }

    public function onGroupDelete(DeleteEvent $event)
    {
        $group = $event->getObject();

        $this->dispatcher->dispatch('log', 'Log\LogGroupDelete', [$group]);
    }

    public function onGroupUpdate(DeleteEvent $event)
    {
        $group = $event->getObject();

        $this->dispatcher->dispatch('log', 'Log\LogGroupUpdate', [$group]);
    }

    public function onGroupPatch(PatchEvent $event)
    {
        $group = $event->getObject();
        $value = $event->getValue();
        $action = $event->getAction();

        if ($value instanceof User) {
            if ('add' === $action) {
                $this->dispatcher->dispatch('log', 'Log\LogGroupAddUser', [$group, $value]);
            } elseif ('remove' === $action) {
                $this->dispatcher->dispatch('log', 'Log\LogGroupRemoveUser', [$group, $value]);
            }
        } elseif ($value instanceof Role) {
            if ('add' === $action) {
                $this->dispatcher->dispatch('log', 'Log\LogRoleSubscribe', [$value, $group]);
            } elseif ('remove' === $action) {
                $this->dispatcher->dispatch('log', 'Log\LogRoleUnsubscribe', [$value, $group]);
            }
        }
    }
}
