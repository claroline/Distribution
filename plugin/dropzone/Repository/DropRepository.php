<?php

namespace Icap\DropzoneBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Icap\DropzoneBundle\Entity\Drop;
use Icap\DropzoneBundle\Entity\Dropzone;

class DropRepository extends EntityRepository
{
    public function getDropIdNotCorrected($dropzone)
    {
        $query = $this->getEntityManager()->createQuery(
            "SELECT d.id AS did, c.valid as valid, count(c.id) AS nb_corrections \n".
            "FROM Icap\\DropzoneBundle\\Entity\\Drop AS d \n".
            "LEFT OUTER JOIN d.corrections AS c \n".
            "WHERE d.dropzone = :dropzone and d.unlockedDrop = false \n".
            'GROUP BY d.id, c.valid')
            ->setParameter('dropzone', $dropzone);

        $result = $query->getResult();

        $dropIds = [];
        foreach ($result as $line) {
            if (null === $line['valid']) {
                $dropIds[$line['did']] = 'has no correction';
            }
        }

        foreach ($result as $line) {
            if (false === $line['valid']) {
                $dropIds[$line['did']] = 'has only invalid corrections';
            }
        }

        foreach ($result as $line) {
            if (true === $line['valid']) {
                if ($line['nb_corrections'] >= $dropzone->getExpectedTotalCorrection()) {
                    $dropIds[$line['did']] = 'must be removed';
                    unset($dropIds[$line['did']]);
                } else {
                    $dropIds[$line['did']] = 'have not enough valid correction for being exclude';
                }
            }
        }

        return array_keys($dropIds);
    }

    public function getDropIdNotFullyCorrected($dropzone)
    {
        $query = $this->getEntityManager()->createQuery(
            "SELECT d.id AS did, count(c.id) AS nb_corrections \n".
            "FROM Icap\\DropzoneBundle\\Entity\\Drop AS d \n".
            "LEFT OUTER JOIN d.corrections AS c \n".
            "WHERE d.dropzone = :dropzone \n".
            "AND c.finished = true \n".
            "GROUP BY d.id \n".
            'HAVING nb_corrections < :expectedTotalCorrection')
            ->setParameter('dropzone', $dropzone)
            ->setParameter('expectedTotalCorrection', $dropzone->getExpectedTotalCorrection());

        $result = $query->getResult();

        $dropIds = [];
        foreach ($result as $line) {
            $dropIds[] = $line['did'];
        }

        return $dropIds;
    }

    /**
     *  Return if user was unlocked ( no need to make the required corrections
     *  todo Why not in a user super class ?
     *
     * @param $dropzoneId
     * @param $userId
     *
     * @return array
     */
    public function isUnlockedDrop($dropzoneId, $userId)
    {
        $qb = $this->createQueryBuilder('drop')
            ->select('drop.unlockedUser')
            ->andWhere('drop.dropzone = :dropzone')
            ->andWhere('drop.user = :user')
            ->setParameter('dropzone', $dropzoneId)
            ->setParameter('user', $userId);
        $isUnlockedDrop = $qb->getQuery()->getOneOrNullResult();

        return $isUnlockedDrop;
    }

    public function getPossibleDropIdsForDrawing(Dropzone $dropzone, $user)
    {
        // Only keep copies whose number correction (whether finished or not) does not exceed the dropzone ExpectedTotalCorrection
        $dropIdNotCorrected = $this->getDropIdNotCorrected($dropzone);

        if (count($dropIdNotCorrected) <= 0) {
            return [];
        }
        // Remove copies that the logged user has already corrected
        $alreadyCorrectedDropIds = $this->getEntityManager()->getRepository('IcapDropzoneBundle:Correction')->getAlreadyCorrectedDropIds($dropzone, $user);

        $qb = $this->createQueryBuilder('drop')
            ->select('drop.id')
            ->andWhere('drop.dropzone = :dropzone')
            ->andWhere('drop.user != :user')
            ->andWhere('drop.finished = true')
            ->andWhere('drop.id IN (:dropIdNotCorrected)')
            ->setParameter('dropzone', $dropzone)
            ->setParameter('user', $user)
            ->setParameter('dropIdNotCorrected', $dropIdNotCorrected);

        if (count($alreadyCorrectedDropIds)) {
            $qb->andWhere('drop.id NOT IN (:alreadyCorrectedDropIds)')
                ->setParameter('alreadyCorrectedDropIds', $alreadyCorrectedDropIds);
        }

        $possibleIds = $qb->getQuery()->getResult();

        return $possibleIds;
    }

    public function hasCopyToCorrect(Dropzone $dropzone, $user)
    {
        return count($this->getPossibleDropIdsForDrawing($dropzone, $user)) > 0;
    }

    public function drawDropForCorrection(Dropzone $dropzone, $user)
    {
        $possibleIds = $this->getPossibleDropIdsForDrawing($dropzone, $user);
        if (0 === count($possibleIds)) {
            return;
        }

        $randomIndex = rand(0, (count($possibleIds) - 1));
        $dropId = $possibleIds[$randomIndex];

        return $this->find($dropId);
    }

    public function getDropIdsFullyCorrectedQuery($dropzone)
    {
        $query = $this->getEntityManager()->createQuery(
            "SELECT cd.id AS did, cd.unlockedDrop as unlcoked, count(cd.id) AS nb_corrections, cdd.expectedTotalCorrection \n".
            "FROM Icap\\DropzoneBundle\\Entity\\Correction AS c \n".
            "JOIN c.drop AS cd \n".
            "JOIN cd.dropzone AS cdd \n".
            "WHERE cdd.id = :dropzoneId \n".
            "AND c.finished = true \n".
            "AND c.valid = true \n".
            "AND cd.finished = true \n".
            "GROUP BY did \n".
            'HAVING (nb_corrections >= cdd.expectedTotalCorrection) OR (unlcoked = true) ')
            ->setParameter('dropzoneId', $dropzone->getId());

        return $query;
    }

    public function countDropsFullyCorrected($dropzone)
    {
        return count($this->getDropIdsFullyCorrectedQuery($dropzone)->getResult());
    }

    public function countDrops($dropzone)
    {
        $query = $this->getEntityManager()->createQuery(
            "SELECT count(d.id) \n".
            "FROM Icap\\DropzoneBundle\\Entity\\Drop AS d \n".
            "WHERE d.finished = true \n".
            "AND d.dropzone = :dropzone \n")
            ->setParameter('dropzone', $dropzone);
        $result = $query->getSingleScalarResult();

        return $result;
    }

    public function getDropsFullyCorrectedOrderByUserQuery($dropzone)
    {
        $lines = $this->getDropIdsFullyCorrectedQuery($dropzone)->getResult();

        $dropIds = [];
        foreach ($lines as $line) {
            $dropIds[] = $line['did'];
        }

        return $this
            ->createQueryBuilder('drop')
            ->select('drop, document, correction, user')
            ->andWhere('drop.id IN (:dropIds)')
            ->andWhere('drop.dropzone = :dropzone')
            ->join('drop.user', 'user')
            ->leftJoin('drop.documents', 'document')
            ->join('drop.corrections', 'correction')
            ->orderBy('user.lastName, user.firstName')
            ->setParameter('dropIds', $dropIds)
            ->setParameter('dropzone', $dropzone)
            ->getQuery();
    }

    public function getDropsFullyCorrectedOrderByDropDateQuery($dropzone)
    {
        $lines = $this->getDropIdsFullyCorrectedQuery($dropzone)->getResult();

        $dropIds = [];
        foreach ($lines as $line) {
            $dropIds[] = $line['did'];
        }

        return $this
            ->createQueryBuilder('drop')
            ->select('drop, document, correction, user')
            ->andWhere('drop.id IN (:dropIds)')
            ->andWhere('drop.dropzone = :dropzone')
            ->join('drop.user', 'user')
            ->leftJoin('drop.documents', 'document')
            ->join('drop.corrections', 'correction')
            ->orderBy('drop.dropDate', 'desc')
            ->setParameter('dropIds', $dropIds)
            ->setParameter('dropzone', $dropzone)
            ->getQuery();
    }

    public function getDropsFullyCorrectedOrderByReportAndDropDateQuery($dropzone)
    {
        $lines = $this->getDropIdsFullyCorrectedQuery($dropzone)->getResult();

        $dropIds = [];
        foreach ($lines as $line) {
            $dropIds[] = $line['did'];
        }

        return $this
            ->createQueryBuilder('drop')
            ->select('drop, document, correction, user')
            ->andWhere('drop.id IN (:dropIds)')
            ->andWhere('drop.dropzone = :dropzone')
            ->join('drop.user', 'user')
            ->leftJoin('drop.documents', 'document')
            ->join('drop.corrections', 'correction')
            ->add('orderBy', 'drop.reported DESC, drop.dropDate DESC')
            ->setParameter('dropIds', $dropIds)
            ->setParameter('dropzone', $dropzone)
            ->getQuery();
    }

    public function getDropsFullyCorrectedReportedQuery($dropzone)
    {
        $lines = $this->getDropIdsFullyCorrectedQuery($dropzone)->getResult();

        $dropIds = [];
        foreach ($lines as $line) {
            $dropIds[] = $line['did'];
        }

        return $this
            ->createQueryBuilder('drop')
            ->select('drop, document, correction, user')
            ->andWhere('drop.id IN (:dropIds)')
            ->andWhere('drop.dropzone = :dropzone')
            ->andWhere('drop.reported = true or correction.correctionDenied = true ')
            ->join('drop.user', 'user')
            ->leftJoin('drop.documents', 'document')
            ->join('drop.corrections', 'correction')
            ->orderBy('drop.reported desc, correction.correctionDenied, drop.dropDate')
            ->setParameter('dropIds', $dropIds)
            ->setParameter('dropzone', $dropzone)
            ->getQuery();
    }

    public function getDropsAwaitingCorrectionQuery($dropzone)
    {
        $lines = $this->getDropIdsFullyCorrectedQuery($dropzone)->getResult();

        $dropIds = [];
        foreach ($lines as $line) {
            $dropIds[] = $line['did'];
        }

        $qb = $this
            ->createQueryBuilder('drop')
            ->select('drop, document, correction, user')
            ->andWhere('drop.dropzone = :dropzone')
            ->andWhere('drop.finished = true')
            ->andWhere('drop.unlockedDrop = false')
            ->join('drop.user', 'user')
            ->leftJoin('drop.documents', 'document')
            ->leftJoin('drop.corrections', 'correction')
            ->orderBy('drop.reported desc, user.lastName, user.firstName')
            ->setParameter('dropzone', $dropzone);

        if (count($dropIds) > 0) {
            $qb = $qb
                ->andWhere('drop.id NOT IN (:dropIds)')
                ->setParameter('dropIds', $dropIds);
        }

        return $qb->getQuery();
    }

    public function getUnfinishedDropsQuery($dropzone)
    {
        $qb = $this
            ->createQueryBuilder('drop')
            ->select('drop, user')
            ->andWhere('drop.dropzone = :dropzone')
            ->andWhere('drop.finished = false')
            ->join('drop.user', 'user')
            ->orderBy('drop.reported desc, user.lastName, user.firstName')
            ->setParameter('dropzone', $dropzone);

        return $qb->getQuery();
    }

    public function getDropIdsByUser($dropzoneId, $userId)
    {
        $qb = $this->createQueryBuilder('drop')
            ->select('drop.id')
            ->andWhere('drop.dropzone = :dropzone')
            ->andWhere('drop.user = :user')
            ->setParameter('dropzone', $dropzoneId)
            ->setParameter('user', $userId);

        return $qb->getQuery()->getSingleScalarResult();
    }

    public function getDropByUser($dropzoneId, $userId)
    {
        $qb = $this->createQueryBuilder('drop')
            ->select('drop')
            ->andWhere('drop.dropzone = :dropzone')
            ->andWhere('drop.user = :user')
            ->setParameter('dropzone', $dropzoneId)
            ->setParameter('user', $userId);

        return $qb->getQuery()->getSingleResult();
    }

    public function getDropAndCorrectionsAndDocumentsAndUser($dropzone, $dropId)
    {
        $qb = $this->createQueryBuilder('drop')
            ->select('drop, document, correction, user')
            ->andWhere('drop.dropzone = :dropzone')
            ->andWhere('drop.id = :dropId')
            ->join('drop.user', 'user')
            ->leftJoin('drop.documents', 'document')
            ->leftJoin('drop.corrections', 'correction')
            ->setParameter('dropzone', $dropzone)
            ->setParameter('dropId', $dropId);

        $res = $qb->getQuery()->getResult();

        return $res;
    }

    public function getDropAndValidEndedCorrectionsAndDocumentsByUser($dropzone, $dropId, $userId)
    {
        $qb = $this->createQueryBuilder('drop')
            ->select('drop, document, correction, user')
            ->andWhere('drop.dropzone = :dropzone')
            ->andWhere('drop.id = :dropId')
            ->andWhere('correction.finished = 1')
            ->andWhere('user.id = :userId')
            ->join('drop.user', 'user')
            ->leftJoin('drop.documents', 'document')
            ->leftJoin('drop.corrections', 'correction')
            ->setParameter('dropzone', $dropzone)
            ->setParameter('userId', $userId)
            ->setParameter('dropId', $dropId);

        return $qb->getQuery()->getResult();
    }

    public function getLastNumber($dropzone)
    {
        $query = $this->getEntityManager()->createQuery(
            "SELECT max(drop.number) \n".
            "FROM Icap\\DropzoneBundle\\Entity\\Drop AS drop \n".
            'WHERE drop.dropzone = :dropzone')
            ->setParameter('dropzone', $dropzone);

        $result = $query->getSingleScalarResult();
        if (null === $result) {
            return 0;
        } else {
            return $result;
        }
    }

    /**
     *  Return the number of unfinished copies ( student didnt click 'save and finish')).
     *
     * @param $dropzoneId
     *
     * @return mixed
     */
    public function countUnterminatedDropsByDropzone($dropzoneId)
    {
        $nb = $this->createQueryBuilder('d')
            ->select('count(d)')
            ->andWhere('d.dropzone = :dropzoneId')
            ->andWhere('d.finished = 0')
            ->setParameter('dropzoneId', $dropzoneId)
            ->getQuery()
            ->getSingleScalarResult();

        return $nb;
    }

    /**
     *  Close unclosed drops in a dropzone.
     *
     * @param $dropzoneId
     */
    public function closeUnTerminatedDropsByDropzone($dropzoneId)
    {
        $qb = $this->createQueryBuilder('drop')
            ->update('Icap\\DropzoneBundle\\Entity\\Drop', 'd')
            ->set('d.autoClosedDrop', 1)
            ->set('d.finished', 1)
            ->andWhere('d.dropzone = :dropzoneId')
            ->andWhere('d.finished = 0')
            ->setParameter('dropzoneId', $dropzoneId);
        $qb->getQuery()->execute();
    }
}
