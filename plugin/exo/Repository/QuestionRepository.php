<?php

namespace UJM\ExoBundle\Repository;

use Claroline\CoreBundle\Entity\User;
use Doctrine\ORM\EntityRepository;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Question\Question;

/**
 * QuestionRepository.
 */
class QuestionRepository extends EntityRepository
{
    public function search(User $user, array $filters = [], $page = 0, $number = -1, array $orderBy = [])
    {
        $qb = $this->createQueryBuilder('q');

        // Get questions created by the User
        $qb->where('q.creator = :user');
        $qb->setParameter('user', $user);

        if (empty($filters['self_only'])) {
            // Includes shared questions
        }

        // Type
        if (!empty($filters['type'])) {
            $qb->andWhere('q.mimeType = :type');
            $qb->setParameter('type', $filters['type']);
        }

        // Title / Content
        if (!empty($filters['content'])) {
            // TODO : escape search string
            $qb->andWhere('(q.content LIKE "%:text%" OR q.title LIKE "%:text%")');
            $qb->setParameter('text', $filters['content']);
        }

        // Dates
        // TODO : add date filters

        // Category
        if (!empty($filters['category'])) {
            $qb->andWhere('q.category = :category');
            $qb->setParameter('type', $filters['category']);
        }

        // Exercise
        if (!empty($filters['exercise'])) {
            $qb
                ->join('q.stepQuestions', 'sq')
                ->join('sq.step', 's')
                ->join('s.exercise', 'e')
                ->andWhere('e.uuid = :exerciseId');

            $qb->setParameter('exerciseId', $filters['exercise']);
        }

        // Model
        if (!empty($filters['model'])) {
            $qb->andWhere('q.model = true');
        }

        // TODO : order query
        // TODO : add pagination

        return $qb->getQuery()->getResult();
    }

    public function findUsedBy(Question $question)
    {
        /*$this->createQueryBuilder()*/
        return [];
    }

    /**
     * Returns all the questions linked to a given exercise.
     *
     * @param Exercise $exercise
     *
     * @return Question[]
     */
    public function findByExercise(Exercise $exercise)
    {
        return $this->getEntityManager()
            ->createQuery('
                SELECT q
                FROM UJM\ExoBundle\Entity\Question\Question AS q
                JOIN UJM\ExoBundle\Entity\StepQuestion AS sq WITH sq.question = q 
                JOIN UJM\ExoBundle\Entity\Step AS s WITH sq.step = s AND s.exercise = :exercise
            ')
            ->setParameter('exercise', $exercise)
            ->getResult();
    }

    /**
     * Returns the questions corresponding to an array of UUIDs.
     *
     * @param array $uuids
     *
     * @return Question[]
     */
    public function findByUuids(array $uuids)
    {
        return $this->createQueryBuilder('q')
            ->where('q.uuid IN (:uuids)')
            ->setParameter('uuids', $uuids)
            ->getQuery()
            ->getResult();
    }
}
