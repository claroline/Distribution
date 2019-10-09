<?php

namespace Claroline\RemoteUserSynchronizationBundle\Listener;

use Claroline\CoreBundle\Event\User\MergeUsersEvent;
use Claroline\RemoteUserSynchronizationBundle\Manager\RemoteUserTokenManager;

/**
 * Class ApiListener.
 */
class ApiListener
{
    /** @var RemoteUserTokenManager */
    private $manager;

    /**
     * @param Manager $manager
     */
    public function __construct(RemoteUserTokenManager $manager)
    {
        $this->manager = $manager;
    }

    /**
     * @param MergeUsersEvent $event
     */
    public function onMerge(MergeUsersEvent $event)
    {
        // Replace user of RemoteUserToken nodes
        $remoteUserTokenCount = $this->manager->replaceUser($event->getRemoved(), $event->getKept());
        $event->addMessage("[ClarolineRemoteUserSynchronizationBundle] updated RemoteUserToken count: $remoteUserTokenCount");
    }
}
