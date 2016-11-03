<?php

namespace UJM\ExoBundle\Serializer\Question;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Category;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * Serializer for category data.
 *
 * @DI\Service("ujm_exo.serializer.category")
 */
class CategorySerializer implements SerializerInterface
{
    /**
     * Converts a Category into a JSON-encodable structure.
     *
     * @param Category $category
     * @param array    $options
     *
     * @return \stdClass
     */
    public function serialize($category, array $options = [])
    {
        $categoryData = new \stdClass();
        $categoryData->id = (string) $category->getUuid();
        $categoryData->name = $category->getName();
        $categoryData->default = $category->isDefault();


        return $categoryData;
    }

    /**
     * Converts raw data into a Category entity.
     *
     * @param \stdClass $data
     * @param Category  $category
     * @param array     $options
     *
     * @return Category
     */
    public function deserialize($data, $category = null, array $options = [])
    {
        if (empty($category)) {
            $category = new Category();
        }

        if (!empty($data->id)) {
            $category->setUuid($data->id);
        }

        $category->setName($data->name);
        $category->setName($data->name);

        if (isset($data->default)) {
            $category->setDefault($data->default);
        }

        return $category;
    }
}
