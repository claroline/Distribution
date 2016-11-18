<?php

namespace UJM\ExoBundle\Repository;

use Doctrine\ORM\EntityRepository;
use UJM\ExoBundle\Entity\Category;

/**
 * Category repository.
 */
class CategoryRepository extends EntityRepository
{
    /**
     * Counts the number of questions of a category.
     *
     * @param Category $category
     *
     * @return integer
     */
    public function countQuestions(Category $category)
    {
        $query = $this->getEntityManager()
            ->createQuery('SELECT COUNT(q) FROM UJM\ExoBundle\Entity\Question q WHERE q.category = :category')
            ->setParameter('category', $category);

        return $query->getSingleScalarResult();
    }
}
