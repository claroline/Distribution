<?php

namespace Claroline\CasBundle\Listener;

use Claroline\CasBundle\Manager\CasManager;
use Claroline\CoreBundle\Event\User\DecorateUserEvent;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Class ApiListener.
 *
 * @DI\Service
 */
class ApiListener
{
    /** @var CasManager */
    private $casManager;

    /**
     * @DI\InjectParams({
     *     "casManager" = @DI\Inject("claroline.manager.cas_manager")
     * })
     *
     * @param CasManager $casManager
     */
    public function __construct(CasManager $casManager)
    {
        $this->casManager = $casManager;
    }

    /**
     * Add CAS ID to serialized user.
     *
     * @param DecorateUserEvent $event
     *
     * @DI\Observe("serialize_user")
     */
    public function onSerialize(DecorateUserEvent $event)
    {
        $casUserId = $this->casManager->getCasUserIdByUserId($event->getUser()->getId());

        $event->add('cas_data', [
            'id' => $casUserId,
        ]);
    }
}
