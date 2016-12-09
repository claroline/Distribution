<?php

namespace UJM\ExoBundle\Repository;

use Claroline\CoreBundle\Entity\User;
use Doctrine\ORM\EntityRepository;
use UJM\ExoBundle\Entity\Attempt\Paper;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Question\Hint;

/**
 * PaperRepository.
 */
class PaperRepository extends EntityRepository
{
    /**
     * Returns the unfinished papers of a user for a given exercise, if any.
     *
     * @param Exercise $exercise
     * @param User     $user
     *
     * @return Paper[]
     */
    public function findUnfinishedPapers(Exercise $exercise, User $user)
    {
        return $this->createQueryBuilder('p')
            ->where('p.user = :user')
            ->andWhere('p.exercise = :exercise')
            ->andWhere('p.end IS NULL')
            ->orderBy('p.start', 'DESC')
            ->setParameters([
                'user' => $user,
                'exercise' => $exercise,
            ])
            ->getQuery()
            ->getResult();
    }

    /**
     * Finds the score of a paper by adding the score of each answer.
     *
     * @param Paper $paper
     *
     * @return float
     */
    public function findScore(Paper $paper)
    {
        return $this->getEntityManager()
            ->createQuery('
                SELECT SUM(a.score) 
                FROM UJM\ExoBundle\Entity\Attempt\Answer AS a
                WHERE a.paper = :paper
                  AND a.score IS NOT NULL
            ')
            ->setParameters([
                'paper' => $paper,
            ])
            ->getSingleScalarResult();
    }

    /**
     * Checks that all the answers of a Paper have been marked.
     *
     * @param Paper $paper
     *
     * @return bool
     */
    public function isFullyEvaluated(Paper $paper)
    {
        return 0 === $this->getEntityManager()
            ->createQuery('
                SELECT COUNT(a) 
                FROM UJM\ExoBundle\Entity\Attempt\Answer AS a
                WHERE a.paper = :paper
                  AND a.score IS NOT NULL
            ')
            ->setParameters([
                'paper' => $paper,
            ])
            ->getSingleScalarResult();
    }

    /**
     * Returns the number of papers for an exercise.
     *
     * @param Exercise $exercise
     *
     * @return int the number of exercise papers
     */
    public function countExercisePapers(Exercise $exercise)
    {
        return $this->getEntityManager()
            ->createQuery('
                SELECT COUNT(p) 
                FROM UJM\ExoBundle\Entity\Attempt\Paper AS p
                WHERE p.exercise = :exercise
            ')
            ->setParameters([
                'exercise' => $exercise,
            ])
            ->getSingleScalarResult();
    }

    /**
     * Counts the number of finished paper for a user and an exercise.
     *
     * @param Exercise $exercise
     * @param User     $user
     *
     * @return int the number of finished papers
     */
    public function countUserFinishedPapers(Exercise $exercise, User $user)
    {
        return $this->getEntityManager()
            ->createQuery('
                SELECT COUNT(p) 
                FROM UJM\ExoBundle\Entity\Attempt\Paper AS p
                WHERE p.user = :user
                  AND p.exercise = :exercise
                  AND p.end IS NOT NULL
            ')
            ->setParameters([
                'user' => $user,
                'exercise' => $exercise,
            ])
            ->getSingleScalarResult();
    }

    /**
     * Returns whether a hint is related to a paper.
     *
     * @param Paper $paper
     * @param Hint  $hint
     *
     * @return bool
     */
    public function hasHint(Paper $paper, Hint $hint)
    {
        return 0 < $this->createQueryBuilder('p')
            ->select('COUNT(p)')
            ->join('p.exercise', 'e')
            ->join('e.steps', 's')
            ->join('s.stepQuestions', 'sq')
            ->where('e = :exercise')
            ->andWhere('sq.question = :question')
            ->setParameters([
                'question' => $hint->getQuestion(),
                'exercise' => $paper->getExercise(),
            ])
            ->getQuery()
            ->getSingleScalarResult();
    }
}
