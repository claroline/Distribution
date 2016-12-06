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
}
