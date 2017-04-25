<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 4/12/17
 */

namespace Claroline\ExternalSynchronizationBundle\Repository;

use Doctrine\ORM\EntityRepository;

class ExternalGroupRepository extends EntityRepository
{
    public function findByRolesAndSearch(
        array $roles,
        $search = null,
        $orderedBy = 'name',
        $order = 'ASC',
        $executeQuery = true
    ) {
        $qb = $this
            ->createQueryBuilder('ext_group')
            ->innerJoin('ext_group.group', 'group')
            ->innerJoin('group.roles', 'role')
            ->where('role IN (:roles)')
            ->orderBy("group.{$orderedBy}", $order)
            ->setParameter('roles', $roles);
        if (!empty($search)) {
            $search = strtoupper($search);
            $qb
                ->andWhere('UPPER(group.name) LIKE :search')
                ->setParameter('search', "%{$search}%");
        }

        return $executeQuery ? $qb->getQuery()->getResult() : $qb->getQuery();
    }
}
