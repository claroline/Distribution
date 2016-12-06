<?php

namespace UJM\ExoBundle\Repository;

use Doctrine\ORM\EntityRepository;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Question\Question;

/**
 * AnswerRepository.
 */
class AnswerRepository extends EntityRepository
{
    /**
     * Returns all answers to a question inside an exercise.
     *
     * @param Exercise $exercise
     * @param Question $question
     *
     * @return Answer[]
     */
    public function findByExerciseAndQuestion(Exercise $exercise, Question $question)
    {
        return $this->createQueryBuilder('a')
            ->join('a.paper', 'p', 'WITH', 'p.exercise = :exercise')
            ->where('a.question = :question')
            ->setParameter('exercise', $exercise)
            ->setParameter('question', $question)
            ->getQuery()
            ->getResult();
    }
}
