<?php

namespace Claroline\CoreBundle\API\Serializer\User;

use Claroline\CoreBundle\API\Options;
use Claroline\CoreBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\Entity\Organization\Location;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Entity\User;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.organization")
 * @DI\Tag("claroline.serializer")
 */
class OrganizationSerializer
{
    use SerializerTrait;

    /**
     * Serializes an Organization entity for the JSON api.
     *
     * @param Organization $organization - the organization to serialize
     * @param array        $options
     *
     * @return array - the serialized representation of the workspace
     */
    public function serialize(Organization $organization, array $options = [])
    {
        $data = [
            'id' => $organization->getUuid(),
            'name' => $organization->getName(),
            'code' => $organization->getCode(),
            'position' => $organization->getPosition(),
            'email' => $organization->getEmail(),
            'default' => $organization->getDefault(),
            'administrators' => array_map(function (User $administrator) {
                return [
                    'id' => $administrator->getId(),
                  'username' => $administrator->getUsername(),
                ];
            }, $organization->getAdministrators()->toArray()),
            'locations' => array_map(function (Location $location) {
                return [
                    'id' => $location->getId(),
                    'name' => $location->getName(),
                ];
            }, $organization->getLocations()->toArray()),
        ];

        if (in_array(Options::IS_RECURSIVE, $options)) {
            $children = [];
            foreach ($organization->getChildren() as $child) {
                $children[] = $this->serialize($child, $options);
            }
            $data['children'] = $children;
        }

        return $data;
    }

    public function getIdentifiers()
    {
        return ['id', 'uuid', 'name', 'code'];
    }
}
