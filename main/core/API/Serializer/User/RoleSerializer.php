<?php

namespace Claroline\CoreBundle\API\Serializer\User;

use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\Entity\Role;

/**
 * @DI\Service("claroline.serializer.role")
 * @DI\Tag("claroline.serializer")
 */
class RoleSerializer
{
    /**
     * Serializes a Role entity.
     *
     * @param Role  $role
     * @param array $options
     *
     * @return array
     */
    public function serialize(Role $role, array $options = [])
    {
        return [
            'translationKey' => $role->getTranslationKey(),
            'name' => $role->getName(),
            'meta' => $this->serializeMeta($role, $options)
        ];
    }

    public function serializeMeta(Role $role, array $options = [])
    {
        return [
           'isReadOnly' => $role->isReadOnly(),
           'type' => $role->getType(),
           'maxUsers' => $role->getMaxUsers(),
           'personalWorkspaceCreationEnabled' => $role->getPersonalWorkspaceCreationEnabled()
       ];
    }

    /**
     * Deserializes data into a Role entity.
     *
     * @param \stdClass $data
     * @param Role      $role
     * @param array     $options
     *
     * @return Role
     */
    public function deserialize($data, Role $role = null, array $options = [])
    {
        if (isset($data->translationKey)) {
            $role->setTranslationKey($data->translationKey);
            $role->setName('ROLE_' . str_replace(' ', '_', strtoupper($data->translationKey)));
        }

        return $role;
    }

    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Role';
    }
}
