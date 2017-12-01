<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\DropZoneBundle\Repository;

use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\DropZoneBundle\Entity\Dropzone;
use Doctrine\ORM\EntityRepository;

class DropRepository extends EntityRepository
{
    public function findUserDrops(Dropzone $dropzone, User $user)
    {
        $roles = $user->getRoles();

        $dql = '
            SELECT drop
            FROM Claroline\DropZoneBundle\Entity\Drop drop
            JOIN drop.dropzone d
            LEFT JOIN drop.user u
            LEFT JOIN drop.role r
            WHERE d = :dropzone
            AND (
              u = :user
              OR r IN (:roles)
            )
        ';
        $query = $this->_em->createQuery($dql);
        $query->setParameter('dropzone', $dropzone);
        $query->setParameter('user', $user);
        $query->setParameter('roles', $roles);

        return $query->getResult();
    }

    public function findUserFinishedPeerDrops(Dropzone $dropzone, User $user)
    {
        $roles = $user->getRoles();

        $dql = '
            SELECT drop
            FROM Claroline\DropZoneBundle\Entity\Drop drop
            JOIN drop.dropzone d
            JOIN drop.corrections c
            LEFT JOIN drop.user u
            LEFT JOIN drop.role r
            LEFT JOIN c.user cu
            LEFT JOIN c.role cr
            WHERE d = :dropzone
            AND drop.finished = true
            AND c.finished = true
            AND (
              u != :user
              OR r NOT IN (:roles)
            )
            AND (
              cu = :user
              OR cr IN (:roles)
            )
        ';
        $query = $this->_em->createQuery($dql);
        $query->setParameter('dropzone', $dropzone);
        $query->setParameter('user', $user);
        $query->setParameter('roles', $roles);

        return $query->getResult();
    }

    public function findRoleFinishedPeerDrops(Dropzone $dropzone, Role $role)
    {
        $dql = '
            SELECT drop
            FROM Claroline\DropZoneBundle\Entity\Drop drop
            JOIN drop.dropzone d
            JOIN drop.corrections c
            JOIN drop.role r
            JOIN c.role cr
            WHERE d = :dropzone
            AND drop.finished = true
            AND c.finished = true
            AND r != :role
            AND cr = :role
        ';
        $query = $this->_em->createQuery($dql);
        $query->setParameter('dropzone', $dropzone);
        $query->setParameter('role', $role);

        return $query->getResult();
    }

    public function findUserUnfinishedPeerDrop(Dropzone $dropzone, User $user)
    {
        $roles = $user->getRoles();

        $dql = '
            SELECT drop
            FROM Claroline\DropZoneBundle\Entity\Drop drop
            JOIN drop.dropzone d
            JOIN drop.corrections c
            LEFT JOIN drop.user u
            LEFT JOIN drop.role r
            LEFT JOIN c.user cu
            LEFT JOIN c.role cr
            WHERE d = :dropzone
            AND drop.finished = true
            AND c.finished = false
            AND (
              u != :user
              OR r NOT IN (:roles)
            )
            AND (
              cu = :user
              OR cr IN (:roles)
            )
        ';
        $query = $this->_em->createQuery($dql);
        $query->setParameter('dropzone', $dropzone);
        $query->setParameter('user', $user);
        $query->setParameter('roles', $roles);

        return $query->getResult();
    }

    public function findUserAvailableDrops(Dropzone $dropzone, User $user)
    {
        $roles = $user->getRoles();

        $dql = '
            SELECT drop
            FROM Claroline\DropZoneBundle\Entity\Drop drop
            JOIN drop.dropzone d
            LEFT JOIN drop.user u
            LEFT JOIN drop.role r
            WHERE d = :dropzone
            AND drop.finished = true
            AND (
              u != :user
              OR r NOT IN (:roles)
            )
            AND NOT EXISTS (
              SELECT cor
              FROM Claroline\DropZoneBundle\Entity\Correction cor
              JOIN cor.drop cd
              LEFT JOIN cor.user coru
              LEFT JOIN cor.role corr
              WHERE cd = drop
              AND (
                coru = :user
                OR corr IN (:roles)
              )
            )
        ';
        $query = $this->_em->createQuery($dql);
        $query->setParameter('dropzone', $dropzone);
        $query->setParameter('user', $user);
        $query->setParameter('roles', $roles);

        return $query->getResult();
    }
}
