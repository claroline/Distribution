<?php

namespace Claroline\CasBundle\Listener;

use Claroline\CasBundle\Manager\CasManager;
use Claroline\CoreBundle\Event\User\DecorateuserEvent;
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
     */
    public function __construct(CasManager $casManager)
    {
        $this->casManager = $casManager;
    }

    /**
     * .
     *
     * @DI\Observe("serialize_user")
     */
    public function onSerialize(DecorateuserEvent $event)
    {
        $casUserId = $this->casManager->getCasUserIdByUserId($event->getUser()->getId());

        $event->add('cas_data', [
            'id' => $casUserId,
        ]);
    }
}
