<?php

namespace Claroline\ClacoFormBundle\API\Serializer;

use Claroline\ClacoFormBundle\Entity\Category;
use Claroline\CoreBundle\Entity\User;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.clacoform.category")
 * @DI\Tag("claroline.serializer")
 */
class CategorySerializer
{
    const OPTION_MINIMAL = 'minimal';

    /**
     * Serializes a Category entity for the JSON api.
     *
     * @param Category $category - the category to serialize
     * @param array    $options  - a list of serialization options
     *
     * @return array - the serialized representation of the category
     */
    public function serialize(Category $category, array $options = [])
    {
        $serialized = [
            'id' => $category->getId(),
            'name' => $category->getName(),
            'details' => $category->getDetails(),
        ];

        if (!in_array(static::OPTION_MINIMAL, $options)) {
            $serialized = array_merge($serialized, [
                'managers' => array_map(function (User $manager) {
                    return ['id' => $manager->getId(), 'firstName' => $manager->getFirstName(), 'lastName' => $manager->getLastName()];
                }, $category->getManagers()),
            ]);
        }

        return $serialized;
    }
}
