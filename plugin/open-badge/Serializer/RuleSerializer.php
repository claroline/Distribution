<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.open_badge.rule")
 */
class RuleSerializer
{
    use SerializerTrait;

    public function serialize(Rule $rule, array $options = [])
    {
        return [
            'data' => $rule->getData(),
            'type' => $rule->getAction(),
            'id' => $rule->getUuid(),
        ];
    }

    /**
     * Deserializes data into a Group entity.
     *
     * @param \stdClass $data
     * @param Group     $group
     * @param array     $options
     *
     * @return Group
     */
    public function deserialize($data, Rule $rule = null, array $options = [])
    {
        $rule->setData($data['data']);
        $rule->setAction($data['type']);

        return $rule;
    }
}
