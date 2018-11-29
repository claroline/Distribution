<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\OpenBadgeBundle\Entity\BadgeClass;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.serializer")
 */
class BadgeClassSerializer
{
    use SerializerTrait;

    public function __construct()
    {
    }

    /**
     * Serializes a Group entity.
     *
     * @param Group $group
     * @param array $options
     *
     * @return array
     */
    public function serialize(BadgeClass $badge, array $options = [])
    {
        return [
            'name' => $badge->getName(),
            'description' => $badge->getDescription(),
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
    public function deserialize($data, BadgeClass $badge = null, array $options = [])
    {
        $this->sipe('name', 'setName', $data, $badge);
        $this->sipe('description', 'setDescription', $data, $badge);
        //what is iri ?
        $this->sipe('name', 'setIri', $data, $badge);

        return $badge;
    }

    public function getClass()
    {
        return BadgeClass::class;
    }
}
