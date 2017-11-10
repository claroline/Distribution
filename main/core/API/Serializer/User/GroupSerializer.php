<?php

namespace Claroline\CoreBundle\API\Serializer\User;

use Claroline\CoreBundle\API\Serializer\SerializerTrait;
use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\API\SerializerProvider;

/**
 * @DI\Service("claroline.serializer.group")
 * @DI\Tag("claroline.serializer")
 */
class GroupSerializer
{
    /**
     * GroupSerializer constructor.
     *
     * @DI\InjectParams({
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param OrganizationSerializer $organizationSerializer
     */
    public function __construct(SerializerProvider $serializer)
    {
        $this->serializer = $serializer;
    }

    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Group';
    }

    /**
     * deserialize
     */
    public function deserialize($data, Group $group = null, array $options = [])
    {
        $group->setName($data->name);
        $orgaList = [];

        if (isset($data->organizations)) {
            foreach ($data->organizations as $organization) {
                $orgaList[] = $this->serializer->deserialize(
                    'Claroline\CoreBundle\Entity\Organization\Organization',
                    $organization
                );
            }
        }

        $group->setOrganizations($orgaList);

        return $group;
    }

    /**
     * serialize.
     * This is only a partial implementation.
     */
    public function serialize(Group $group, array $options = [])
    {
        $object['name'] = $group->getName();

        $serializedOrganizations = [];

        foreach ($group->getOrganizations() as $organization) {
            $serializedOrganizations[] = $this->serializer->serialize(
              $organization
            );
        }

        $object['organizations'] = $serializedOrganizations;

        return $object;
    }

    public function getIdentifiers()
    {
        return ['id', 'uuid', 'name'];
    }
}
