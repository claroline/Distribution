<?php

namespace Claroline\CoreBundle\API\Serializer\Facet;

use Claroline\CoreBundle\Entity\Facet\FieldFacet;
use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\API\Options;
use Claroline\CoreBundle\Entity\Facet\Facet;
use Claroline\CoreBundle\API\SerializerProvider;
use Claroline\CoreBundle\API\Serializer\SerializerTrait;

/**
 * @DI\Service("claroline.serializer.facet")
 * @DI\Tag("claroline.serializer")
 */
class FacetSerializer
{
    use SerializerTrait;

    /**
     * @DI\InjectParams({
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param SerializerProvider $serializer
     */
    public function __construct(
        SerializerProvider $serializer
    ) {
        $this->serializer = $serializer;
    }

    public function serialize(Facet $facet, array $options = [])
    {
        $panelFacetSerializer = $this->serializer
          ->get('Claroline\CoreBundle\Entity\Facet\PanelFacet');

        return [
          'id'   => $facet->getUuid(),
          'title' => $facet->getName(),
          'position' => $facet->getPosition(),
          'roles' => [],
          'meta' => $this->getMeta($facet),
          'sections' => array_map(function ($panel) use ($panelFacetSerializer) {
              return $panelFacetSerializer->serialize($panel, $options);
          }, $facet->getPanelFacets()->toArray())
        ];
    }

    public function getMeta(Facet $facet)
    {
        return [
          'forceCreation' => $facet->getForceCreationForm(),
          'isMain' => $facet->isMain()
        ];
    }

    public function deserialize(array $data, Facet $facet = null, array $options = [])
    {
        //$count = $this->facetRepo->countFacets($isMain);
        $this->sipe('name', 'setName', $data, $facet);
        $this->sipe('meta.isMain', 'setIsMain', $data, $facet);
        $this->sipe('meta.forceCreation', 'setForceCreationForm', $data, $facet);

        $position = 0;
        $facet->setPosition($count);
    }

    public function getSchema()
    {
        return '#/main/core/facet.json';
    }
}
