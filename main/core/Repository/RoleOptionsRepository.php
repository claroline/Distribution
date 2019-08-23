<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Repository;

use Claroline\CoreBundle\Entity\RoleOptions;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

class RoleOptionsRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, RoleOptions::class);
    }

    public function findRoleOptionsByRoles(array $roles)
    {
        $dql = '
            SELECT ro
            FROM Claroline\CoreBundle\Entity\RoleOptions ro
            WHERE ro.role IN (:roles)
        ';

        $query = $this->_em->createQuery($dql);
        $query->setParameter('roles', $roles);

        return $query->getResult();
    }
}
