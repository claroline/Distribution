<?php

namespace Claroline\CoreBundle\API\Serializer\Facet;

use Claroline\CoreBundle\API\Options;
use Claroline\CoreBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\API\SerializerProvider;
use Claroline\CoreBundle\Entity\Facet\FieldFacet;
use Claroline\CoreBundle\Entity\Facet\PanelFacet;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.panel_facet")
 * @DI\Tag("claroline.serializer")
 */
class PanelFacetSerializer
{
    use SerializerTrait;

    /** @var SerializerProvider */
    private $serializer;

    /**
     * @DI\InjectParams({
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param SerializerProvider $serializer
     */
    public function __construct(SerializerProvider $serializer)
    {
        $this->serializer = $serializer;
    }

    /**
     * Serializes a FieldFacet entity for the JSON api.
     *
     * @param PanelFacet $panel   - the field facet to serialize
     * @param array      $options - a list of serialization options
     *
     * @return array - the serialized representation of the field facet
     */
    public function serialize(PanelFacet $panel, array $options = [])
    {
        $fieldFacetSerializer = $this->serializer->get('Claroline\CoreBundle\Entity\Facet\FieldFacet');

        return [
          'id' => $panel->getUuid(),
          'title' => $panel->getName(),
          'position' => $panel->getPosition(),
          'roles' => [],
          'meta' => [],
          'fields' => array_map(function ($fieldFacet) use ($fieldFacetSerializer, $options) {
              return $fieldFacetSerializer->serialize($fieldFacet, $options);
          }, $panel->getFieldsFacet()->toArray()),
        ];
    }

    /**
     * @param array      $data
     * @param PanelFacet $panel
     * @param array      $options
     *
     * @return array - the serialized representation of the field facet
     */
    public function deserialize(array $data, PanelFacet $panel = null, array $options = [])
    {
        $this->sipe('title', 'setName', $data, $panel);
        $this->sipe('position', 'setPosition', $data, $panel);

        if (isset($data['fields']) && in_array(Options::DEEP_DESERIALIZE, $options)) {
            $panel->resetFieldFacets();

            foreach ($data['fields'] as $field) {
                $field = $this->serializer->deserialize('Claroline\CoreBundle\Entity\Facet\FieldFacet', $field, $options);
                $field->setPanelFacet($panel);
            }
        }
    }
}
