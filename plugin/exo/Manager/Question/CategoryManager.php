<?php

namespace UJM\ExoBundle\Manager\Question;

use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Category;
use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Serializer\Question\CategorySerializer;
use UJM\ExoBundle\Transfer\Json\ValidationException;
use UJM\ExoBundle\Validator\JsonSchema\Question\CategoryValidator;

/**
 * Manages question categories.
 *
 * @DI\Service("ujm_exo.manager.category")
 */
class CategoryManager
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var CategoryValidator
     */
    private $validator;

    /**
     * @var CategorySerializer
     */
    private $serializer;

    /**
     * CategoryManager constructor.
     *
     * @DI\InjectParams({
     *     "om"         = @DI\Inject("claroline.persistence.object_manager"),
     *     "validator"  = @DI\Inject("ujm_exo.validator.category"),
     *     "serializer" = @DI\Inject("ujm_exo.serializer.category")
     * })
     *
     * @param ObjectManager      $om
     * @param CategoryValidator  $validator
     * @param CategorySerializer $serializer
     */
    public function __construct(
        ObjectManager $om,
        CategoryValidator $validator,
        CategorySerializer $serializer)
    {
        $this->om = $om;
        $this->validator = $validator;
        $this->serializer = $serializer;
    }

    /**
     * Validates and creates a new Category from raw data.
     *
     * @param \stdClass $data
     *
     * @return Category
     *
     * @throws ValidationException
     */
    public function create(\stdClass $data)
    {
        return $this->update(new Category(), $data);
    }

    /**
     * Validates and updates an Category entity with raw data.
     *
     * @param Category  $category
     * @param \stdClass $data
     *
     * @return Category
     *
     * @throws ValidationException
     */
    public function update(Category $category, \stdClass $data)
    {
        // Validate received data
        $errors = $this->validator->validate($data, [Validation::REQUIRE_SOLUTIONS]);
        if (count($errors) > 0) {
            throw new ValidationException('Category is not valid', $errors);
        }

        // Update Category with new data
        $this->serializer->deserialize($data, $category);

        // Save to DB
        $this->om->persist($category);
        $this->om->flush();

        return $category;
    }

    /**
     * Exports a Category.
     *
     * @param Category $category
     * @param array    $options
     *
     * @return \stdClass
     */
    public function export(Category $category, array $options = [])
    {
        return $this->serializer->serialize($category, $options);
    }
}
