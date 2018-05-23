<?php

namespace Claroline\CoreBundle\Listener\Resource;

/**
 * Logs actions on resources.
 *
 * @DI\Inject
 */
class ResourceLogListener
{
    private $eventDispatcher;

    /**
     * ResourceLogListener constructor.
     */
    public function __construct()
    {

    }

    public function onOpen()
    {
        //$this->dispatcher->dispatch('log', 'Log\LogResourceRead', [$node]);
    }

    public function onCreate()
    {
        /*$usersToNotify = $workspace && $workspace->getId() ?
            $this->container->get('claroline.manager.user_manager')->getUsersByWorkspaces([$workspace], null, null, false) :
            [];

        $this->eventDispatcher->dispatch('log', 'Log\LogResourceCreate', [$node, $usersToNotify]);
        $this->eventDispatcher->dispatch('log', 'Log\LogResourcePublish', [$node, $usersToNotify]);*/
    }

    public function onCopy()
    {
        // $this->dispatcher->dispatch('log', 'Log\LogResourceCopy', [$newNode, $node]);
    }

    public function onTogglePublication()
    {
        /*$usersToNotify = $node->getWorkspace() && !$node->getWorkspace()->isDisabledNotifications() ?
            $this->container->get('claroline.manager.user_manager')->getUsersByWorkspaces([$node->getWorkspace()], null, null, false) :
            [];

        $this->dispatcher->dispatch('log', 'Log\LogResourcePublish', [$node, $usersToNotify]);*/
    }

    public function onConfigure()
    {
        /*$uow = $this->om->getUnitOfWork();
        $uow->computeChangeSets();
        $changeSet = $uow->getEntityChangeSet($node);

        if (count($changeSet) > 0) {
            $this->dispatcher->dispatch(
                'log',
                'Log\LogResourceUpdate',
                [$node, $changeSet]
            );
        }*/
    }

    public function onMove()
    {
        // $this->dispatcher->dispatch('log', 'Log\LogResourceMove', [$child, $parent]);
    }

    public function onDelete()
    {
        /*$this->dispatcher->dispatch(
            'log',
            'Log\LogResourceDelete',
            [$node]
        );*/
    }

    public function onExport()
    {
        //$this->dispatcher->dispatch('log', 'Log\LogResourceExport', [$node]);
    }
}
