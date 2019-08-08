<?php

namespace Claroline\OpenBadgeBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.open_badge.rule_manager")
 */
class RuleManager
{
    /**
     * @DI\InjectParams({
     *     "om"  = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ObjectManager $om
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
    }

    /*
        public function createRules()
        {
            $rules = [
              [Rule::RULE_RESOURCE_PASSED],
              [Rule::RULE_RESOURCE_SCORE_ABOVE],
              [Rule::RULE_RESOURCE_COMPLETED_ABOVE],
              [Rule::RULE_WORKSPACE_PASSED],
              [Rule::RULE_WORKSPACE_SCORE_ABOVE],
              [Rule::RULE_WORKSPACE_COMPLETED_ABOVE],
              [Rule::RULE_RESOURCE_PARTICIPATED],
              [Rule::RULE_PROFILE_COMPLETED],
              [Rule::RULE_IN_GROUP_OR_ROLE],
            ];
    
            foreach ($rules as $rule) {
                $object = $this->om->getRepository(Rule::class)->findOneByAction($rule[0]) ?? new Rule();
                $object->setAction($rule[0]);
                $this->om->persist($object);
            }
    
            $this->om->flush();
        }*/
}
