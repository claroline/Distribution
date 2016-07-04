<?php

namespace UJM\ExoBundle\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * ExerciseRepository.
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ExerciseRepository extends EntityRepository
{
    /**
     * List of exercises of workspaces where the user has the admin role.
     *
     *
     * @param int $userID id User
     *
     * Return array
     */
    public function getExerciseAdmin($userID)
    {
        $exercises = [];

        $dql = 'SELECT w.id, w.name
            FROM Claroline\CoreBundle\Entity\User u
            JOIN u.roles r
            JOIN r.workspace w
            WHERE u.id= ?1 AND r.name LIKE \'ROLE_WS_MANAGER_%\'
            ORDER BY w.name';

        $query = $this->_em->createQuery($dql)
                           ->setParameter(1, $userID);

        foreach ($query->getResult() as $ws) {
            $dql = 'SELECT e.id, rn.name, w.name as workspace
                    FROM UJM\ExoBundle\Entity\Exercise e
                    JOIN e.resourceNode rn
                    JOIN rn.resourceType rt
                    JOIN rn.workspace w
                    WHERE rt.name =\'ujm_exercise\'
                    AND w.id= ?1
                    ORDER BY rn.name';
            $queryResources = $this->_em->createQuery($dql)
                                        ->setParameter(1, $ws['id']);
            foreach ($queryResources->getResult() as $resource) {
                $exercises[] = $resource;
            }
        }

        return $exercises;
    }
}
