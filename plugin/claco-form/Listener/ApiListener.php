<?php

namespace Claroline\ClacoFormBundle\Listener;

use Claroline\ClacoFormBundle\Manager\ClacoFormManager;
use Claroline\CoreBundle\Event\User\MergeUsersEvent;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Class ApiListener.
 *
 * @DI\Service
 */
class ApiListener
{
    /** @var ClacoFormManager */
    private $clacoFormManager;

    /**
     * @DI\InjectParams({
     *     "clacoFormManager" = @DI\Inject("claroline.manager.claco_form_manager")
     * })
     *
     * @param ClacoFormManager $clacoFormManager
     */
    public function __construct(ClacoFormManager $clacoFormManager)
    {
        $this->clacoFormManager = $clacoFormManager;
    }

    /**
     * @DI\Observe("merge_users")
     *
     * @param MergeUsersEvent $event
     */
    public function onMerge(MergeUsersEvent $event)
    {
        //Category
        //Comment
        //Entry
        //EntryUser

        $event->addMessage('[ClarolineClacoFormBundle]');
    }
}
