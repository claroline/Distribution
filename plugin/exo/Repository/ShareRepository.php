<?php

namespace UJM\ExoBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Claroline\CoreBundle\Entity\User;

/**
 * ShareRepository.
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ShareRepository extends EntityRepository
{
    /**
     * Allow to know if a question is shared with an user.
     *
     *
     * @param int $user     id User
     * @param int $question id Question
     *
     * Return array[Share]
     */
    public function getControlSharedQuestion($user, $question)
    {
        $qb = $this->createQueryBuilder('s');
        $qb->join('s.question', 'q')
            ->where($qb->expr()->in('q', $question))
            ->andWhere($qb->expr()->in('s.user', $user));

        return $qb->getQuery()->getResult();
    }

    /**
     * Get the shared questions in the import view of an exercise.
     *
     *
     * @param int                     $exoId id Exercise
     * @param int                     $uid   id User
     * @param Doectrine EntityManager $am
     *
     * Return array[Share]
     */
    public function getUserInteractionSharedImport($exoId, $uid, $em)
    {
        $questions = array();

        $dql = 'SELECT sq FROM UJM\ExoBundle\Entity\StepQuestion sq JOIN sq.step s WHERE s.exercise= ?1
                ORDER BY sq.ordre';

        $query = $em->createQuery($dql)->setParameter(1, $exoId);
        $eqs = $query->getResult();

        foreach ($eqs as $eq) {
            $questions[] = $eq->getQuestion()->getId();
        }

        $qb = $this->createQueryBuilder('s');

        $qb->join('s.question', 'q')
           ->join('s.user', 'u')
           ->where($qb->expr()->in('u.id', $uid));
        if (count($questions) > 0) {
            $qb->andWhere('q.id not in ('.implode(',', $questions).')');
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * Search shared questions by category.
     *
     *
     * @param user   $user       id User
     * @param string $whatToFind string to find
     *
     * Return array[Share]
     */
    public function findByUserAndCategoryName(User $user, $whatToFind)
    {
        $userId = $user->getId();
        $dql = 'SELECT s FROM UJM\ExoBundle\Entity\Share s JOIN s.question q JOIN q.category c
            WHERE c.value LIKE ?1
            AND s.user = ?2';

        $query = $this->_em->createQuery($dql)
                      ->setParameters(array(1 => "%{$whatToFind}%", 2 => $userId));

        return $query->getResult();
    }

    /**
     * Search shared questions by title.
     *
     *
     * @param user   $user       id User
     * @param string $whatToFind string to find
     *
     * Return array[Share]
     */
    public function findByUserAndTitle(User $user, $whatToFind)
    {
        $userId = $user->getId();
        $dql = 'SELECT s FROM UJM\ExoBundle\Entity\Share s JOIN s.question q
            WHERE q.title LIKE ?1
            AND s.user = ?2';

        $query = $this->_em->createQuery($dql)
                      ->setParameters(array(1 => "%{$whatToFind}%", 2 => $userId));

        return $query->getResult();
    }

    /**
     * Search shared questions by type.
     *
     *
     * @param user   $user       id User
     * @param string $whatToFind string to find
     *
     * Return array[Share]
     */
    public function findByUserAndType(User $user, $whatToFind)
    {
        $userId = $user->getId();
        $dql = 'SELECT s FROM UJM\ExoBundle\Entity\Share s
                JOIN s.question q
                WHERE s.user = ?2
                AND q.type LIKE ?1';

        $query = $this->_em->createQuery($dql)
                      ->setParameters(array(1 => "%{$whatToFind}%", 2 => $userId));

        return $query->getResult();
    }

    /**
     * Search shared questions by contain.
     *
     *
     * @param User   $user       id User
     * @param string $whatToFind string to find
     *
     * Return array[Share]
     */
    public function findByUserAndInvite(User $user, $whatToFind)
    {
        $userId = $user->getId();
        $dql = 'SELECT s FROM UJM\ExoBundle\Entity\Share s
                JOIN s.question q
                WHERE s.user = ?2
                AND q.invite LIKE ?1';

        $query = $this->_em->createQuery($dql)
                      ->setParameters(array(1 => "%{$whatToFind}%", 2 => $userId));

        return $query->getResult();
    }

    /**
     * Search shared questions.
     *
     *
     * @param int    $user       id User
     * @param string $whatToFind string to find
     *
     * Return array[Share]
     */
    public function findByUserAndContent(User $user, $whatToFind)
    {
        $userId = $user->getId();
        $dql = 'SELECT s FROM UJM\ExoBundle\Entity\Share s,
                UJM\ExoBundle\Entity\Question q, UJM\ExoBundle\Entity\Category c
                WHERE s.question = q AND q.category = c
                AND s.user = ?2
                AND (q.description LIKE ?1 OR q.type LIKE ?1 OR c.value LIKE ?1 OR q.title LIKE ?1)
        ';

        $query = $this->_em->createQuery($dql)
                      ->setParameters(array(1 => "%{$whatToFind}%", 2 => $userId));

        return $query->getResult();
    }
}
