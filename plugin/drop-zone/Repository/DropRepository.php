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
}
