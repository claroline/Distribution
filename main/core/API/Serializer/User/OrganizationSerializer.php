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
            'email' => $organization->getEmail(),
            'meta' => [
                'default' => $organization->getDefault(),
                'position' => $organization->getPosition(),
                'parent' => !empty($organization->getParent()) ? [
                    'id' => $organization->getParent()->getUuid(),
                    'name' => $organization->getParent()->getName(),
                ] : [],
            ],
            'managers' => array_map(function (User $administrator) {
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
            $data['children'] = array_map(function (Organization $child) use ($options) {
                return $this->serialize($child, $options);
            }, $organization->getChildren()->toArray());
        }

        return $data;
    }

    public function getIdentifiers()
    {
        return ['id', 'uuid', 'name', 'code'];
    }
}
