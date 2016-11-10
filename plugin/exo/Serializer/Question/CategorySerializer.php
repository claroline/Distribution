<?php

namespace UJM\ExoBundle\Serializer\Question;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use UJM\ExoBundle\Entity\Category;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * Serializer for category data.
 *
 * @DI\Service("ujm_exo.serializer.category")
 */
class CategorySerializer implements SerializerInterface
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    /**
     * CategorySerializer constructor.
     *
     * @param ObjectManager         $om
     * @param TokenStorageInterface $tokenStorage
     *
     * @DI\InjectParams({
     *     "om"           = @DI\Inject("claroline.persistence.object_manager"),
     *     "tokenStorage" = @DI\Inject("security.token_storage")
     * })
     */
    public function __construct(
        ObjectManager $om,
        TokenStorageInterface $tokenStorage)
    {
        $this->om = $om;
        $this->tokenStorage = $tokenStorage;
    }
    
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

        if (in_array(Transfer::INCLUDE_ADMIN_META, $options)) {
            $categoryData->default = $category->isDefault();
        }

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
            // Loads the Question from DB if already exist
            $category = $this->om->getRepository('UJMExoBundle:Category')->findOneBy([
                'uuid' => $data->id,
            ]);

            if (empty($category)) {
                // Question not exist
                $category = new Category();
            }
        }

        if (!empty($data->id)) {
            $category->setUuid($data->id);
        }

        $category->setName($data->name);

        if (isset($data->default)) {
            $category->setDefault($data->default);
        }

        if (empty($category->getUser())) {
            $currentUser = $this->tokenStorage->getToken()->getUser();
            if ($currentUser instanceof User) {
                $category->setUser($currentUser);
            }
        }

        return $category;
    }
}
