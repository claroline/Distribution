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
            ->createQuery('SELECT COUNT(*) FROM UJM\ExoBundle\Entity\Question AS q WHERE q.category = :category')
            ->setParameter('category', $category);

        return $query->getSingleScalarResult();
    }

    /**
     * Category by user.
     *
     * @param int $uid User
     *
     * @return \Doctrine\ORM\QueryBuilder
     *
     * @deprecated
     */
    public function getUserCategory($uid)
    {
        $qb = $this->createQueryBuilder('c');
        $qb->join('c.user', 'u')
            ->where($qb->expr()->in('u.id', $uid))
            ->orderBy('c.value', 'ASC');

        //request used by a form, queryBuilder must be given and not an array
        return $qb;
    }

    /**
     * Create an array of user's category.
     *
     * @param int $uid
     *
     * @return Category[]
     *
     * @deprecated
     */
    public function getListCategory($uid)
    {
        $qb = $this->getUserCategory($uid);
        $listCategory = $qb->getQuery()->getResult();

        return  $listCategory;
    }

    /**
     * @param $uid
     *
     * @return array
     *
     * @deprecated
     */
    public function getCategoryLocker($uid)
    {
        $qb = $this->createQueryBuilder('c');
        $qb->join('c.user', 'u')
            ->where($qb->expr()->in('u.id', $uid))
            ->andWhere('c.locker = 1')
            ->orderBy('c.value', 'ASC');
        $locker = $qb->getQuery()->getResult();

        return $locker;
    }
}
