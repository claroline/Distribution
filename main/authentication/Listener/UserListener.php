<?php

namespace Claroline\AuthenticationBundle\Listener;

use Claroline\AuthenticationBundle\Manager\OauthManager;
use Claroline\CoreBundle\Event\Log\LogGenericEvent;
use Claroline\CoreBundle\Event\Log\LogUserDeleteEvent;
use Claroline\CoreBundle\Event\User\MergeUsersEvent;

class UserListener
{
    /** @var OauthManager */
    private $oauthManager;

    /**
     * UserListener constructor.
     *
     * @param OauthManager $oauthManager
     */
    public function __construct(OauthManager $oauthManager)
    {
        $this->oauthManager = $oauthManager;
    }

    /**
     * @param MergeUsersEvent $event
     */
    public function onMerge(MergeUsersEvent $event)
    {
        // TODO : implement
    }

    /**
     * @param LogGenericEvent $event
     */
    public function onDelete(LogGenericEvent $event)
    {
        if ($event instanceof LogUserDeleteEvent) {
            $receiver = $event->getReceiver();
            if (null !== $receiver) {
                $this->oauthManager->unlinkAccount($receiver->getId());
            }
        }
    }
}
