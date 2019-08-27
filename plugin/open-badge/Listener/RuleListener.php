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

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\Event\Crud\PatchEvent;
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
     * @DI\Observe("crud_pre_patch_object_claroline_corebundle_entity_user")
     *
     * @param ResourceEvaluationEvent $event
     */
    public function listenUserPatch(PatchEvent $event)
    {
        if (Crud::COLLECTION_ADD === $event->getAction()) {
            if ('role' === $event->getProperty()) {
                $rules = $this->om->getRepository(Rule::class)->findBy(['role' => $event->getValue()]);

                foreach ($rules as $rule) {
                    //add role rule thingy
                }
            }

            if ('group' === $event->getProperty()) {
                $rules = $this->om->getRepository(Rule::class)->findBy(['group' => $event->getValue()]);

                foreach ($rules as $rule) {
                    //add role group thingy
                }
            }
        }
    }

    /**
     * @DI\Observe("crud_pre_patch_object_claroline_corebundle_entity_role")
     *
     * @param ResourceEvaluationEvent $event
     */
    public function listenRolePatch(PatchEvent $event)
    {
        if (Crud::COLLECTION_ADD === $event->getAction()) {
            if ('user' === $event->getProperty()) {
                $rules = $this->om->getRepository(Rule::class)->findBy(['role' => $event->getObject()]);

                foreach ($rules as $rule) {
                    //add role rule thingy
                }
            }
        }
    }

    /**
     * @DI\Observe("crud_pre_patch_object_claroline_corebundle_entity_group")
     *
     * @param ResourceEvaluationEvent $event
     */
    public function listenGroupPatch(PatchEvent $event)
    {
        if (Crud::COLLECTION_ADD === $event->getAction()) {
            if ('user' === $event->getProperty()) {
                $rules = $this->om->getRepository(Rule::class)->findBy(['group' => $event->getObject()]);

                foreach ($rules as $rule) {
                    //add role rule thingy
                }
            }
        }
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
