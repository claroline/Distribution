<?php

namespace Claroline\CoreBundle\API\Serializer;

use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\Entity\Organization\Location;

/**
 * @DI\Service("claroline.serializer.location")
 * @DI\Tag("claroline.serializer")
 */
class LocationSerializer
{
    public function serialize(Location $location, array $options = [])
    {
        return [
          'id' => $location->getUuid(),
          'name' => $location->getName(),
          'street' => $location->getStreet(),
          'boxNumber' => $location->getBoxNumber(),
          'streetNumber' => $location->getStreetNumber(),
          'pc' => $location->getPc(),
          'town' => $location->getTown(),
          'country' => $location->getCountry(),
          'phone' => $location->getPhone(),
          'gps' => [
            'latitude' => $location->getLatitude(),
            'longitude' => $location->getLongitude()
          ]
        ];
    }

    public function deserialize($data, Location $location = null, array $options = [])
    {
        $this->addIfPropertyExists('name', 'setName', $data, $location);
        $this->addIfPropertyExists('street', 'setStreet', $data, $location);
        $this->addIfPropertyExists('boxNumber', 'setBoxNumber', $data, $location);
        $this->addIfPropertyExists('street', 'setStreet', $data, $location);
        $this->addIfPropertyExists('streetNumber', 'setStreetNumber', $data, $location);
        $this->addIfPropertyExists('pc', 'setPc', $data, $location);
        $this->addIfPropertyExists('town', 'setTown', $data, $location);
        $this->addIfPropertyExists('country', 'setCountry', $data, $location);
        $this->addIfPropertyExists('phone', 'setPhone', $data, $location);

        return $location;
    }

    private function addIfPropertyExists($prop, $setter, $data, Location $location)
    {
        if (isset($data[$prop])) {
            $location->$setter($data[$prop]);
        }
    }

    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Organization\Location';
    }
}
