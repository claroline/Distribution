<?php

namespace UJM\ExoBundle\Repository;

use Doctrine\ORM\EntityRepository;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Question;
use UJM\ExoBundle\Entity\Attempt\Answer;

/**
 * AnswerRepository.
 */
class AnswerRepository extends EntityRepository
{
    /**
     * Scores of an exercise for each paper.
     *
     * @param int    $exoId id Exercise
     * @param string $order to order result
     *
     * @return array
     */
    public function getExerciseMarks($exoId, $order)
    {
        $qb = $this->createQueryBuilder('r');
        $qb->select('sum(r.mark) as noteExo, p.id as paper')
           ->join('r.paper', 'p')
           ->join('p.exercise', 'e')
           ->where('e.id = ?1')
           ->andWhere('p.interrupted =  ?2')
           ->groupBy('p.id')
           ->orderBy($order, 'ASC')
           ->setParameters(array(1 => $exoId, 2 => 0));

        return $qb->getQuery()->getResult();
    }

    /**
     * Get the responses for a paper and an user.
     *
     * @param int $paperID id paper
     *
     * @return Answer[]
     */
    public function getPaperResponses($paperID)
    {
        $qb = $this->createQueryBuilder('r');
        $qb->join('r.paper', 'p')
           ->leftJoin('p.user', 'u')
           ->where($qb->expr()->in('p.id', $paperID));

        return $qb->getQuery()->getResult();
    }

    /**
     * Get the score for an exercise and an interaction with count.
     *
     * @param int $exoId
     * @param int $questionId
     *
     * @return Answer[]
     */
    public function getExerciseInterResponsesWithCount($exoId, $questionId)
    {
        $dql = '
            SELECT r.mark, count(r.mark) as nb
            FROM UJM\ExoBundle\Entity\Attempt\Answer r, UJM\ExoBundle\Entity\Question q, UJM\ExoBundle\Entity\Paper p
            WHERE r.question=q.id
            AND r.paper=p.id
            AND p.exercise= ?1
            AND r.question = ?2
            AND r.response != \'\'
            GROUP BY r.mark
        ';

        $query = $this->_em->createQuery($dql)
                      ->setParameters(array(1 => $exoId, 2 => $questionId));

        return $query->getResult();
    }

    /**
     * Send the score for an exercise and an interaction.
     *
     * @param int $exoId
     * @param int $questionId
     *
     * @return Answer[]
     */
    public function getExerciseInterResponses($exoId, $questionId)
    {
        $dql = '
            SELECT r.mark
            FROM UJM\ExoBundle\Entity\Attempt\Answer r, UJM\ExoBundle\Entity\Question q, UJM\ExoBundle\Entity\Paper p
            WHERE r.question=q.id
            AND r.paper=p.id
            AND p.exercise= ?1
            AND r.question = ?2
            ORDER BY p.id
        ';

        $query = $this->_em->createQuery($dql)
                      ->setParameters(array(1 => $exoId, 2 => $questionId));

        return $query->getResult();
    }

    /**
     * Send the score for an exercise and an interaction.
     *
     * @param Exercise $exercise
     * @param Question $question
     *
     * @return Answer[]
     */
    public function findByExerciseAndQuestion(Exercise $exercise, Question $question)
    {
        $qb = $this->createQueryBuilder('r');

        return $qb
            ->join('r.paper', 'p', 'WITH', 'p.exercise = :exercise')
            ->where('r.question = :question')
            ->setParameter('exercise', $exercise)
            ->setParameter('question', $question)
            ->getQuery()
            ->getResult();
    }
}
