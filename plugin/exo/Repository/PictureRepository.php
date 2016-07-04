<?php

namespace UJM\ExoBundle\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * PictureRepository.
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class PictureRepository extends EntityRepository
{
    /**
     * Search user's pictures by type and by label.
     *
     *
     * @param string $type        type of picture
     * @param int    $userID      id User
     * @param string $searchLabel label of picture
     *
     * Return array[Picture]
     */
    public function findByType($type, $userID, $searchLabel)
    {
        if ($type == 'image') {
            $dql = ('SELECT p FROM UJM\ExoBundle\Entity\Picture p WHERE p.user = ?1 AND
                (p.type= \'.png\' OR p.type= \'.jpeg\' OR p.type= \'.jpg\' OR p.type= \'.gif\' OR p.type= \'.bmp\')');
        } elseif ($type == 'video') {
            $dql = 'SELECT p FROM UJM\ExoBundle\Entity\Picture p WHERE p.user = ?1 AND
                (p.type= \'.avi\' OR p.type= \'.mpeg\' OR p.type= \'.wmv\' OR p.type= \'.flv\' OR p.type= \'.mov\')';
        } elseif ($type == 'music') {
            $dql = 'SELECT p FROM UJM\ExoBundle\Entity\Picture p WHERE p.user = ?1 AND
                (p.type= \'.mp3\' OR p.type= \'.wav\')';
        } elseif ($type == 'file') {
            $dql = 'SELECT p FROM UJM\ExoBundle\Entity\Picture p WHERE p.user = ?1 AND NOT
                p.type= \'.png\' AND NOT p.type= \'.jpeg\' AND NOT p.type= \'.jpg\' AND NOT p.type= \'.gif\' AND NOT p.type= \'.bmp\'
                AND NOT p.type= \'.avi\' AND NOT p.type= \'.mpeg\' AND NOT p.type= \'.wmv\' AND NOT p.type= \'.flv\' AND NOT p.type= \'.mov\'';
        } elseif ($type == 'all') {
            $dql = 'SELECT p FROM UJM\ExoBundle\Entity\Picture p WHERE p.user = ?1';
        }

        if ($searchLabel != '') {
            $dql .= ' AND UPPER(p.label) LIKE :search';
            $query = $this->_em->createQuery($dql)->setParameters([1 => $userID, 2 => $searchLabel]);
        } else {
            $query = $this->_em->createQuery($dql);
        }

        return $query->getResult();
    }

    /**
     * Search user's pictures by type and by label.
     *
     *
     * @param string $labelToFind label of picture
     * @param int    $userID      id User
     * @param bool   $strict      for a strict search or no
     *
     * Return array[Picture]
     */
    public function findByLabel($labelToFind, $userId, $strict)
    {
        $dql = 'SELECT p FROM UJM\ExoBundle\Entity\Picture p
            WHERE p.user = ?1
            AND UPPER(p.label) LIKE ?2';

        if ($strict == 0) {
            $query = $this->_em->createQuery($dql)
                ->setParameters([1 => $userId, 2 => $labelToFind]);
        } else {
            $query = $this->_em->createQuery($dql)
                ->setParameters([1 => $userId, 2 => "%$labelToFind%"]);
        }

        return $query->getResult();
    }
}
