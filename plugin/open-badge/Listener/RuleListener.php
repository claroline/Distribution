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
use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Entity\Resource\ResourceUserEvaluation;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\Resource\ResourceEvaluationEvent;
use Claroline\OpenBadgeBundle\Entity\Assertion;
use Claroline\OpenBadgeBundle\Entity\Evidence;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service()
 */
class RuleListener
{
    /**
     * BadgeListener constructor.
     *
     * @DI\InjectParams({
     *     "translator"   = @DI\Inject("translator"),
     *     "tokenStorage" = @DI\Inject("security.token_storage"),
     *     "om"           = @DI\Inject("claroline.persistence.object_manager")
     * })
     */
    public function __construct(ObjectManager $om, TranslatorInterface $translator, TokenStorageInterface $tokenStorage)
    {
        $this->om = $om;
        $this->translator = $translator;
        $this->tokenStorage = $tokenStorage;
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
                    $this->awardResourcePassed($evaluation->getUser(), $evaluation, $rule);
                    break;
                case Rule::RULE_RESOURCE_SCORE_ABOVE:
                    $this->awardResourceScoreAbove($evaluation->getUser(), $evaluation, $rule);
                    break;
                case Rule::RULE_RESOURCE_COMPLETED_ABOVE:
                    $this->awardResourceCompletedAbove($evaluation->getUser(), $evaluation, $rule);
                    break;
                case Rule::RULE_RESOURCE_PARTICIPATED:
                    $this->awardResourceParticipated($evaluation->getUser(), $evaluation, $rule);
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
                    $this->awardInRole($event->getObject(), $event->getValue(), $rule);
                }
            }

            if ('group' === $event->getProperty()) {
                $rules = $this->om->getRepository(Rule::class)->findBy(['group' => $event->getValue()]);

                foreach ($rules as $rule) {
                    $this->awardInGroup($event->getObject(), $event->getValue(), $rule);
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
                    $this->awardInRole($event->getValue(), $event->getObject(), $rule);
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
                    $this->awardInGroup($event->getValue(), $event->getObject(), $rule);
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

    private function awardResourcePassed(User $user, ResourceUserEvaluation $evaluation, Rule $rule)
    {
        $assertion = $this->makeAssertion($user, $rule);
        $evidence = new Evidence();
        $now = new \DateTime();
        $evidence->setNarrative($this->translator->trans(
          'evidence_narrative_resource_passed',
          [
            '%date%' => $now->format('Y-m-d H:i:s'),
          ]
        ));
        $evidence->setAssertion($assertion);
        $evidence->setName(Rule::RULE_RESOURCE_PASSED);
        $evidence->setResourceEvidence($evaluation);
        $this->om->persist($evidence);
        $this->om->flush();
    }

    private function awardResourceScoreAbove(User $user, ResourceUserEvaluation $evaluation, Rule $rule)
    {
        $assertion = $this->makeAssertion($user, $rule);
        $evidence = new Evidence();
        $now = new \DateTime();
        $evidence->setNarrative($this->translator->trans(
          'evidence_narrative_resource_score_above',
          [
            '%date%' => $now->format('Y-m-d H:i:s'),
          ]
        ));
        $evidence->setAssertion($assertion);
        $evidence->setName(Rule::RULE_RESOURCE_SCORE_ABOVE);
        $evidence->setResourceEvidence($evaluation);
        $this->om->persist($evidence);
        $this->om->flush();
    }

    private function awardResourceCompletedAbove(User $user, ResourceUserEvaluation $evaluation, Rule $rule)
    {
        $assertion = $this->makeAssertion($user, $rule);
        $evidence = new Evidence();
        $now = new \DateTime();
        $evidence->setNarrative($this->translator->trans(
          'evidence_narrative_resource_score_above',
          [
            '%date%' => $now->format('Y-m-d H:i:s'),
          ]
        ));
        $evidence->setAssertion($assertion);
        $evidence->setName(Rule::RULE_RESOURCE_COMPLETED_ABOVE);
        $evidence->setResourceEvidence($evaluation);
        $this->om->persist($evidence);
        $this->om->flush();
    }

    private function awardResourceParticipated(User $user, ResourceUserEvaluation $evaluation, Rule $rule)
    {
        $assertion = $this->makeAssertion($user, $rule);
        $evidence = new Evidence();
        $now = new \DateTime();
        $evidence->setNarrative($this->translator->trans(
          'evidence_narrative_resource_score_above',
          [
            '%date%' => $now->format('Y-m-d H:i:s'),
          ]
        ));
        $evidence->setAssertion($assertion);
        $evidence->setName(Rule::RULE_RESOURCE_PARTICIPATED);
        $evidence->setResourceEvidence($evaluation);
        $this->om->persist($evidence);
        $this->om->flush();
    }

    private function awardInGroup(User $user, Group $group, Rule $rule)
    {
        $assertion = $this->makeAssertion($user, $rule);
        $evidence = new Evidence();
        $now = new \DateTime();
        $evidence->setNarrative($this->translator->trans(
          'evidence_narrative_add_group',
          [
            '%doer%' => $this->tokenStorage->getToken()->getUser(),
            '%date%' => $now->format('Y-m-d H:i:s'),
          ]
        ));
        $evidence->setAssertion($assertion);
        $evidence->setName(Rule::IN_GROUP);
        $this->om->persist($evidence);
        $this->om->flush();
    }

    private function awardInRole(User $user, Role $role, Rule $rule)
    {
        $assertion = $this->makeAssertion($user, $rule);
        $evidence = new Evidence();
        $now = new \DateTime();
        $evidence->setNarrative($this->translator->trans(
          'evidence_narrative_add_group',
          [
            '%doer%' => $this->tokenStorage->getToken()->getUser(),
            '%date%' => $now->format('Y-m-d H:i:s'),
          ]
        ));
        $evidence->setAssertion($assertion);
        $evidence->setName(Rule::IN_ROLE);
        $this->om->persist($evidence);
        $this->om->flush();
    }

    private function makeAssertion($user, $rule)
    {
        $assertion = new Assertion();
        $assertion->setRecipient($user);
        $assertion->setBadge($rule->getBadge());
        $this->om->persist($assertion);

        return $assertion;
    }
}
