<?php

namespace Claroline\CoreBundle\API\Serializer\Facet;

use Claroline\CoreBundle\Entity\Facet\FieldFacet;
use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\API\Options;
use Claroline\CoreBundle\Entity\Facet\PanelFacet;
use Claroline\CoreBundle\API\SerializerProvider;

/**
 * @DI\Service("claroline.serializer.panel_facet")
 * @DI\Tag("claroline.serializer")
 */
class PanelFacetSerializer
{
    /**
     * @DI\InjectParams({
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param FieldFacetSerializer $fieldFacetSerializer
     * @param UserSerializer       $userSerializer
     */
    public function __construct(
        SerializerProvider $serializer
    ) {
        $this->serializer = $serializer;
    }

    /**
     * Serializes a FieldFacet entity for the JSON api.
     *
     * @param FieldFacet $fieldFacet - the field facet to serialize
     * @param array      $options    - a list of serialization options
     *
     * @return array - the serialized representation of the field facet
     */
    public function serialize(PanelFacet $panel, array $options = [])
    {
        $fieldFacetSerializer = $this->serializer->get('Claroline\CoreBundle\Entity\Facet\FieldFacet');

        return [
          'id'   => $panel->getUuid(),
          'title' => $panel->getName(),
          'position' => $panel->getPosition(),
          'roles' => [],
          'meta' => $this->getMeta($panel),
          'fields' => array_map(function ($fieldFacet) use ($fieldFacetSerializer, $options) {
              return $fieldFacetSerializer->serialize($fieldFacet, $options);
          }, $panel->getFieldsFacet()->toArray())
        ];
    }

    public function getMeta(PanelFacet $panel)
    {
        return [

        ];
    }

    public function deserialize()
    {
    }
}
