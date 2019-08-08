<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use JMS\DiExtraBundle\Annotation as DI;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;

/**
 * @DI\Service()
 */
class RevocationListSerializer
{
    use SerializerTrait;

    public function __construct()
    {
    }

    public function serialize(Rule $rule, array $options = []))
    {
        return [

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
        return [

        ];
    }
}
