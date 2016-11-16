<?php

namespace UJM\ExoBundle\Repository;

use Claroline\CoreBundle\Entity\User;
use Doctrine\ORM\EntityRepository;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Question;
use UJM\ExoBundle\Entity\Step;

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

        /*$qb->orderBy();*/
        /*$this->addOrderBy($orderBy);
        $this->addPagination($page, $number);*/

        return $qb->getQuery()->getResult();
    }

    /**
     * Returns all the questions created by a given user. Allows to
     * select only questions defined as models (defaults to false).
     *
     * @param User $user
     * @param bool $limitToModels
     *
     * @return array
     */
    public function findByUser(User $user, $limitToModels = false)
    {
        $qb = $this->createQueryBuilder('q')
            ->join('q.creator', 'u')
            ->join('q.category', 'c')
            ->where('q.creator = :creator');

        if ($limitToModels) {
            $qb->andWhere('q.model = true');
        }

        return $qb
            ->orderBy('c.name, q.title', 'ASC')
            ->setParameter('creator', $user)
            ->getQuery()
            ->getResult();
    }

    public function findUsedBy(Question $question)
    {
        /*$this->createQueryBuilder()*/
        return [];
    }

    public function findSharedWith(Question $question)
    {
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
        return $this->createQueryBuilder('q')
            ->join('q.stepQuestions', 'sq')
            ->join('sq.step', 's')
            ->where('s.exercise = :exercise')
            ->orderBy('s.order, sq.order')
            ->setParameter(':exercise', $exercise)
            ->getQuery()
            ->getResult();
    }

    /**
     * Returns all the questions linked to a given step.
     *
     * @deprecated this methods is only used in incorrect way. It will be deleted when there will be no more use
     *
     * @param Step $step
     *
     * @return Question[]
     */
    public function findByStep(Step $step)
    {
        return $this->createQueryBuilder('q')
            ->join('q.stepQuestions', 'sq')
            ->join('sq.step', 's')
            ->where('sq.step = :step')
            ->orderBy('sq.order')
            ->setParameter(':step', $step)
            ->getQuery()
            ->getResult();
    }

    /**
     * Returns the questions corresponding to an array of ids.
     *
     * @param array $ids
     *
     * @return Question[]
     */
    public function findByIds(array $ids)
    {
        return $this->createQueryBuilder('q')
            ->where('q IN (:ids)')
            ->setParameter('ids', $ids)
            ->getQuery()
            ->getResult();
    }

    /**
     * Returns the questions created by a user which are not
     * associated with a given exercise. Allows to select only
     * questions defined as models (defaults to false).
     *
     * @param User     $user
     * @param Exercise $exercise
     * @param bool     $limitToModels
     *
     * @return array
     */
    public function findByUserNotInExercise(User $user, Exercise $exercise, $limitToModels = false)
    {
        $stepQuestionsQuery = $this->createQueryBuilder('q1')
            ->join('q1.stepQuestions', 'sq')
            ->join('sq.step', 's')
            ->where('s.exercise = :exercise');

        $qb = $this->createQueryBuilder('q')
            ->leftJoin('q.category', 'c')
            ->where('q.creator = :creator');

        if ($limitToModels) {
            $qb->andWhere('q.model = true');
        }

        return $qb
            ->andWhere($qb->expr()->notIn('q', $stepQuestionsQuery->getDQL()))
            ->orderBy('c.name, q.title', 'ASC')
            ->setParameters([
                'creator' => $user,
                'exercise' => $exercise,
            ])
            ->getQuery()
            ->getResult();
    }

    /**
     * Returns the questions created by a user whose category
     * name matches a given search string.
     *
     * @param User   $user
     * @param string $categoryName
     *
     * @return array
     */
    public function findByUserAndCategoryName(User $user, $categoryName)
    {
        return $this->createQueryBuilder('q')
            ->join('q.category', 'c')
            ->where('q.creator = :creator')
            ->andWhere('c.name LIKE :search')
            ->setParameters([
                'creator' => $user,
                'search' => "%{$categoryName}%",
            ])
            ->getQuery()
            ->getResult();
    }

    /**
     * Returns the questions created by a user whose type
     * matches a given search string.
     *
     * @param User   $user
     * @param string $type
     *
     * @return array
     */
    public function findByUserAndType(User $user, $type)
    {
        return $this->createQueryBuilder('q')
            ->where('q.creator = :creator')
            ->andWhere('q.type LIKE :search')
            ->setParameters([
                'creator' => $user,
                'search' => "%{$type}%",
            ])
            ->getQuery()
            ->getResult();
    }

    /**
     * Returns the questions created by a user whose title
     * matches a given search string.
     *
     * @param User   $user
     * @param string $title
     *
     * @return array
     */
    public function findByUserAndTitle(User $user, $title)
    {
        return $this->createQueryBuilder('q')
            ->where('q.creator = :creator')
            ->andWhere('q.title LIKE :search')
            ->setParameters([
                'creator' => $user,
                'search' => "%{$title}%",
            ])
            ->getQuery()
            ->getResult();
    }

    /**
     * Returns the questions created by a user whose invite
     * matches a given search string.
     *
     * @param User   $user
     * @param string $invite
     *
     * @return array
     */
    public function findByUserAndInvite(User $user, $invite)
    {
        return $this->createQueryBuilder('q')
            ->where('q.creator = :creator')
            ->andWhere('q.content LIKE :search')
            ->setParameters([
                'creator' => $user,
                'search' => "%{$invite}%",
            ])
            ->getQuery()
            ->getResult();
    }

    /**
     * Returns the questions created by a user whose category name,
     * type, title or invite matches a given search string.
     * Allows to select only questions which are not associated with
     * a particular exercise.
     *
     * @param User     $user
     * @param string   $content
     * @param Exercise $excluded
     *
     * @return array
     */
    public function findByUserAndContent(User $user, $content, Exercise $excluded = null)
    {
        $qb = $this->createQueryBuilder('q')
            ->leftJoin('q.category', 'c')
            ->where('c.name LIKE :search')
            ->orWhere('q.type LIKE :search')
            ->orWhere('q.title LIKE :search')
            ->orWhere('q.content LIKE :search')
            ->andWhere('q.creator = :creator');

        $parameters = [
            'creator' => $user,
            'search' => "%{$content}%",
        ];

        if ($excluded) {
            $stepQuestionsQuery = $this->createQueryBuilder('q1')
                ->join('q1.stepQuestions', 'sq')
                ->join('sq.step', 's')
                ->where('s.exercise = :exercise');
            $qb->andWhere(
                $qb->expr()->notIn('q', $stepQuestionsQuery->getDQL())
            );
            $parameters['exercise'] = $excluded;
        }

        return $qb->orderBy('c.name, q.title', 'ASC')
            ->setParameters($parameters)
            ->getQuery()
            ->getResult();
    }
}
