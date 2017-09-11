<?php

namespace Claroline\CoreBundle\API\Serializer;

use Claroline\CoreBundle\Entity\Role;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.role")
 * @DI\Tag("claroline.serializer")
 */
class RoleSerializer
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
    public function serialize(Role $role, $options = [])
    {
        return [
          'id' => $role->getId(),
          'name' => $role->getName(),
          'translation' => $role->getTranslationKey(),
          'type' => $role->getType(),
        ];
    }
}
