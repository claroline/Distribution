<?php

namespace FormaLibre\ReservationBundle\Serializer;

use Claroline\CoreBundle\API\Serializer\User\OrganizationSerializer;
use Claroline\CoreBundle\Persistence\ObjectManager;
use FormaLibre\ReservationBundle\Entity\Resource;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.reservation.resource")
 * @DI\Tag("claroline.serializer")
 */
class ResourceSerializer
{
    private $organizationSerializer;
    private $resourceTypeSerializer;

    private $organizationRepo;
    private $resourceTypeRepo;

    /**
     * ResourceSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om"                     = @DI\Inject("claroline.persistence.object_manager"),
     *     "organizationSerializer" = @DI\Inject("claroline.serializer.organization"),
     *     "resourceTypeSerializer" = @DI\Inject("claroline.serializer.reservation.resource_type")
     * })
     *
     * @param ObjectManager          $om
     * @param OrganizationSerializer $organizationSerializer
     * @param ResourceTypeSerializer $resourceTypeSerializer
     */
    public function __construct(
        ObjectManager $om,
        OrganizationSerializer $organizationSerializer,
        ResourceTypeSerializer $resourceTypeSerializer
    ) {
        $this->organizationSerializer = $organizationSerializer;
        $this->resourceTypeSerializer = $resourceTypeSerializer;

        $this->organizationRepo = $om->getRepository('ClarolineCoreBundle:Organization\Organization');
        $this->resourceTypeRepo = $om->getRepository('FormaLibreReservationBundle:ResourceType');
    }

    /**
     * @param resource $resource
     *
     * @return array
     */
    public function serialize(Resource $resource)
    {
        return [
            'id' => $resource->getUuid(),
            'name' => $resource->getName(),
            'resourceType' => $this->resourceTypeSerializer->serialize($resource->getResourceType()),
            'maxTimeReservation' => $resource->getMaxTimeReservation(),
            'description' => $resource->getDescription(),
            'localization' => $resource->getLocalisation(),
            'quantity' => $resource->getQuantity(),
            'color' => $resource->getColor(),
            'organizations' => $this->getOrganizations($resource),
        ];
    }

    /**
     * Deserializes data into a Resource entity.
     *
     * @param \stdClass $data
     * @param resource  $resource
     *
     * @return resource
     */
    public function deserialize($data, Resource $resource = null)
    {
        if (empty($resource)) {
            $resource = new Resource();
        }
        if (isset($data['resourceType'])) {
            $resourceType = $this->resourceTypeRepo->findOneBy(['uuid' => $data['resourceType']['id']]);
            $resource->setResourceType($resourceType);
        }
        if (isset($data['name'])) {
            $resource->setName($data['name']);
        }
        if (isset($data['maxTimeReservation'])) {
            $resource->setMaxTimeReservation($data['type']);
        }
        if (isset($data['description'])) {
            $resource->setDescription($data['description']);
        }
        if (isset($data['localization'])) {
            $resource->setLocalisation($data['localization']);
        }
        if (isset($data['quantity'])) {
            $resource->setQuantity($data['quantity']);
        }
        if (isset($data['color'])) {
            $resource->setColor($data['color']);
        }
        $this->deserializeOrganizations($resource, $data['organizations']);

        return $resource;
    }

    private function getOrganizations(Resource $resource)
    {
        $organizations = [];

        foreach ($resource->getOrganizations() as $organization) {
            $organizations[] = $this->organizationSerializer->serialize($organization);
        }

        return $organizations;
    }

    private function deserializeOrganizations(Resource $resource, $organizationsData)
    {
        $resource->emptyOrganizations();

        foreach ($organizationsData as $organizationData) {
            $organization = $this->organizationRepo->findOneBy(['uuid' => $organizationData['id']]);
            $resource->addOrganization($organization);
        }
    }
}
