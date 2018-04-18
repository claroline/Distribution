<?php

namespace HeVinci\CompetencyBundle\Listener;

use Claroline\CoreBundle\Event\User\MergeUsersEvent;
use HeVinci\CompetencyBundle\Manager\ObjectiveManager;
use HeVinci\CompetencyBundle\Manager\ProgressManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Class ApiListener.
 *
 * @DI\Service
 */
class ApiListener
{
    /** @var ObjectiveManager */
    private $objectiveManager;

    /** @var ProgressManager */
    private $progressManager;

    /**
     * @DI\InjectParams({
     *     "objectiveManager" = @DI\Inject("hevinci.competency.objective_manager"),
     *     "progressManager"  = @DI\Inject("hevinci.competency.progress_manager")
     * })
     *
     * @param ObjectiveManager $objectiveManager
     * @param ProgressManager  $progressManager
     */
    public function __construct(ObjectiveManager $objectiveManager, ProgressManager $progressManager)
    {
        $this->objectiveManager = $objectiveManager;
        $this->progressManager = $progressManager;
    }

    /**
     * @DI\Observe("merge_users")
     *
     * @param MergeUsersEvent $event
     */
    public function onMerge(MergeUsersEvent $event)
    {
        //Objective
        //AbstractUserProgress
        //AbstractObjectiveProgress
        //AbstractCompetencyProgress
        //AbilityProgress

        $event->addMessage('[HeVinciCompetencyBundle]');
    }
}
