<?php

namespace UJM\ExoBundle\Repository;

use Doctrine\ORM\EntityRepository;
use UJM\ExoBundle\Entity\Exercise;

/**
 * ExerciseRepository.
 */
class ExerciseRepository extends EntityRepository
{
    /**
     * Lists scores obtained to an exercise.
     *
     * @param Exercise $exercise
     *
     * @return array
     */
    public function findScores(Exercise $exercise)
    {
    }

    public function invalidatePapers(Exercise $exercise)
    {
        return $this->getEntityManager()
            ->createQuery('
                UPDATE UJM\ExoBundle\Entity\Attempt\Paper AS p 
                SET p.invalidated = true 
                WHERE p.exercise = :exercise 
                  AND p.invalidated = false
            ')
            ->setParameters([
                'exercise' => $exercise,
            ])
            ->execute();
    }
}
