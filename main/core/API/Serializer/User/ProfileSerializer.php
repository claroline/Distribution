<?php

namespace Claroline\CoreBundle\API\Serializer\User;

use Claroline\CoreBundle\Entity\Role;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.profile")
 */
class ProfileSerializer
{
    public function __construct()
    {
    }

    /**
     * Serializes the profile configuration.
     *
     * @param array $options
     *
     * @return array
     */
    public function serialize(array $options = [])
    {
        $this->serializeMainFacet();

        return [

        ];
    }

    private function serializeMainFacet()
    {
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
        return $role;
    }
}
