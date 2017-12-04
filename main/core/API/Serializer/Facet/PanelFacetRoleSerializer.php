<?php

namespace Claroline\CoreBundle\API\Serializer\Facet;

use Claroline\CoreBundle\API\Options;
use Claroline\CoreBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\API\SerializerProvider;
use Claroline\CoreBundle\Entity\Facet\PanelFacetRole;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.panel_facet_role")
 * @DI\Tag("claroline.serializer")
 */
class PanelFacetRoleSerializer
{
    use SerializerTrait;

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
     * Serializes a FieldFacetChoice entity for the JSON api.
     *
     * @param PanelFacetRole $panelFacetRole - the choice to serialize
     * @param array          $options        - a list of serialization options
     *
     * @return array - the serialized representation of the field facet
     */
    public function serialize(PanelFacetRole $panelFacetRole, array $options = [])
    {
        return [
          'id' => $panelFacetRole->getUuid(),
          'edit' => $panelFacetRole->canEdit(),
          'open' => $panelFacetRole->canOpen(),
          'role' => $this->serializer->get('Claroline\CoreBundle\Entity\Role')
            ->serialize($panelFacetRole->getRole(), [Options::SERIALIZE_MINIMAL]),
          'panel' => $panelFacetRole->getPanelFacet()->getUuid(),
        ];
    }

    public function deserialize(array $data, FieldFacetChoice $choice = null, array $options = [])
    {
        //do something lol
    }
}
