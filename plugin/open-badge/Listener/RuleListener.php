<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\OpenBadgeBundle\Listener;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Event\Resource\ResourceEvaluationEvent;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 */
class RuleListener
{
    /**
     * BadgeListener constructor.
     *
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
    }

    /**
     * @DI\Observe("resource_evaluation")
     *
     * @param ResourceEvaluationEvent $event
     */
    public function onResourceEvaluation(ResourceEvaluationEvent $event)
    {
        $evaluation = $event->getEvaluation();

        $rules = $this->om->getRepository(Rule::class)->findBy(['node' => $evaluation->getResourceNode()]);

        foreach ($rules as $rule) {
            switch ($rule->getAction()) {
                case Rule::RULE_RESOURCE_PASSED:
                  break;
                case Rule::RULE_RESOURCE_SCORE_ABOVE:
                  break;
                case Rule::RULE_RESOURCE_COMPLETED_ABOVE:
                  break;
                case Rule::RULE_RESOURCE_PARTICIPATED:
                    break;
                default:
                  break;
            }
        }
    }

    /**
     * @DI\Observe("user_add_group")
     *
     * @param ResourceEvaluationEvent $event
     */
    public function onUserAddGroup($event)
    {
    }

    /**
     * @DI\Observe("user_add_role")
     *
     * @param ResourceEvaluationEvent $event
     */
    public function onUserAddRole($event)
    {
    }

    /**
     * @DI\Observe("workspace_evaluation")
     */
    public function onWorkspaceEvaluation($event)
    {
        $evaluation = $event->getEvaluation();

        $rules = $this->om->getRepository(Rule::class)->findBy(['workspace' => $evaluation->getWorkspace()]);

        foreach ($rules as $rule) {
            switch ($rule->getAction()) {
                case Rule::RULE_WORKSPACE_PASSED:
                  break;
                case Rule::RULE_WORKSPACE_SCORE_ABOVE:
                  break;
                case Rule::RULE_WORKSPACE_COMPLETED_ABOVE:
                  break;
                default:
                  break;
            }
        }
    }
}
