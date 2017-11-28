<?php

namespace Claroline\CoreBundle\API\Serializer\Facet;

use Claroline\CoreBundle\Entity\Facet\FieldFacet;
use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\API\Options;

/**
 * @DI\Service("claroline.serializer.field_facet")
 * @DI\Tag("claroline.serializer")
 */
class FieldFacetSerializer
{
    /**
     * Serializes a FieldFacet entity for the JSON api.
     *
     * @param FieldFacet $fieldFacet - the field facet to serialize
     * @param array      $options    - a list of serialization options
     *
     * @return array - the serialized representation of the field facet
     */
    public function serialize(FieldFacet $fieldFacet, array $options = [])
    {
        if (in_array(Options::PROFILE_SERIALIZE, $options)) {
            $serialized = [
              //no uuid yet
              'id'       => $fieldFacet->getId(),
              'name'     => $fieldFacet->getName(),
              'type'     => $fieldFacet->getFieldType(),
              //maybe translate this
              'label'    => $fieldFacet->getName(),
              'required' => $fieldFacet->isRequired(),
              'options'  => $fieldFacet->getOptions()
            ];

            if (true) {
                $serialized['options'] = [];
            }

            return $serialized;
        }

        //could be used by the clacoform. It should change later. The default one should be
        //PROFILE_SERIALIZE. See with @kitan
        $serialized = [
            'id' => $fieldFacet->getId(),
            'name' => $fieldFacet->getName(),
            'type' => $fieldFacet->getType(),
            'translationKey' => $fieldFacet->getTypeTranslationKey(),
        ];

        return $serialized;
    }

    public function deserialize()
    {
    }
}
