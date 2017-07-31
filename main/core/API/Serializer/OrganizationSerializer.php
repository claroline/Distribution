<?php

namespace Claroline\CoreBundle\API\Serializer;

use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.organization")
 * @DI\Tag("claroline.serializer")
 */
class OrganizationSerializer
{
    private $om;

    /**
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ObjectManager $om
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
    }

    /**
     * Serializes an Organization entity for the JSON api.
     *
     * @param Organization $organization - the workspace to serialize
     *
     * @return array - the serialized representation of the workspace
     */
    public function serialize(Organization $organization, $options = [])
    {
        $data = [
          'id' => $organization->getId(),
          'name' => $organization->getName(),
          'position' => $organization->getPosition(),
          'email' => $organization->getEmail(),
          'default' => $organization->getDefault(),
          'administrators' => array_map(function ($administrator) {
              return [
              'id' => $administrator->getId(),
              'username' => $administrator->getUsername(),
            ];
          }, $organization->getAdministrators()->toArray()),
          'locations' => array_map(function ($location) {
              return [
              'id' => $location->getId(),
              'name' => $location->getName(),
            ];
          }, $organization->getLocations()->toArray()),
        ];

        if ($options['recursive']) {
            $children = [];
            foreach ($organization->getChildren() as $child) {
                $children[] = $this->serialize($child, $options);
            }
            $data['children'] = $children;
        }

        return $data;
    }
}
