<?php

namespace Claroline\CoreBundle\API\Serializer\Workspace;

use Claroline\AppBundle\API\Options;
use Claroline\CoreBundle\API\Serializer\User\RoleSerializer;
use Claroline\CoreBundle\API\Serializer\User\UserSerializer;
use Claroline\CoreBundle\Entity\Workspace\Requirements;

class RequirementsSerializer
{
    /** @var RoleSerializer */
    private $roleSerializer;
    /** @var UserSerializer */
    private $userSerializer;

    /**
     * RequirementsSerializer constructor.
     *
     * @param RoleSerializer $roleSerializer
     * @param UserSerializer $userSerializer
     */
    public function __construct(RoleSerializer $roleSerializer, UserSerializer $userSerializer)
    {
        $this->roleSerializer = $roleSerializer;
        $this->userSerializer = $userSerializer;
    }

    /**
     * Serializes an Requirements entity for the JSON api.
     *
     * @param Requirements $requirements
     *
     * @return array - the serialized representation of the workspace requirements
     */
    public function serialize(Requirements $requirements)
    {
        return [
            'id' => $requirements->getUuid(),
            'user' => $requirements->getUser() ?
                $this->userSerializer->serialize($requirements->getUser(), [Options::SERIALIZE_MINIMAL]) :
                null,
            'role' => $requirements->getRole() ?
                $this->roleSerializer->serialize($requirements->getRole(), [Options::SERIALIZE_MINIMAL]) :
                null,
        ];
    }
}
