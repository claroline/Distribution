<?php

namespace Claroline\CoreBundle\API\Serializer\Facet;

use Claroline\CoreBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\API\SerializerProvider;
use Claroline\CoreBundle\Entity\Facet\Facet;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.facet")
 * @DI\Tag("claroline.serializer")
 */
class FacetSerializer
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
     * @param Facet $facet
     * @param array $options
     */
    public function serialize(Facet $facet, array $options = [])
    {
        $panelFacetSerializer = $this->serializer
          ->get('Claroline\CoreBundle\Entity\Facet\PanelFacet');

        return [
          'id' => $facet->getUuid(),
          'title' => $facet->getName(),
          'position' => $facet->getPosition(),
          'roles' => [],
          'meta' => $this->getMeta($facet),
          'sections' => array_map(function ($panel) use ($panelFacetSerializer, $options) {
              return $panelFacetSerializer->serialize($panel, $options);
          }, $facet->getPanelFacets()->toArray()),
        ];
    }

    /**
     * @param Facet $facet
     */
    public function getMeta(Facet $facet)
    {
        return [
          'forceCreation' => $facet->getForceCreationForm(),
          'isMain' => $facet->isMain(),
        ];
    }

    /**
     * @param array $data
     * @param Facet $facet
     * @param array $options
     */
    public function deserialize(array $data, Facet $facet = null, array $options = [])
    {
        $this->sipe('title', 'setName', $data, $facet);
        $this->sipe('meta.isMain', 'setIsMain', $data, $facet);
        $this->sipe('position', 'setPosition', $data, $facet);
        $this->sipe('meta.forceCreation', 'setForceCreationForm', $data, $facet);

        if (isset($data['sections'])) {
            foreach ($data['sections'] as $section) {
                //check if section exists first
                $panelFacet = $this->serializer->deserialize('Claroline\CoreBundle\Entity\Facet\PanelFacet', $section, $options);
                $facet->addPanelFacet($panelFacet);
            }
        }
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/main/core/facet.json';
    }
}
