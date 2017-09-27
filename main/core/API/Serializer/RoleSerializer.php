<?php

namespace Claroline\CoreBundle\API\Serializer;

use Claroline\CoreBundle\Entity\Role;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.role")
 * @DI\Tag("claroline.serializer")
 */
class RoleSerializer extends AbstractSerializer
{
    /**
     * Serializes a Role entity for the JSON api.
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

    public function deserialize($role)
    {
        $role = $this->om->getRepository('ClarolineCoreBundle:Role')->find($role->id);

        if (!$role) {
            $role = new Role();
            //do more stuff
        }
    }
}
