<?php

namespace Claroline\CoreBundle\API\Serializer;

use Claroline\CoreBundle\Entity\Group;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.group")
 * @DI\Tag("claroline.serializer")
 */
class GroupSerializer
{
    public function __construct()
    {
    }

    /**
     * Serializes a Workspace entity for the JSON api.
     *
     * @param Group $group  - the group to serialize
     * @param bool  $public
     *
     * @return array - the serialized representation of the workspace
     */
    public function serialize(Group $group, $options = [])
    {
        return [
          'name' => $group->getName(),
        ];
    }
}
