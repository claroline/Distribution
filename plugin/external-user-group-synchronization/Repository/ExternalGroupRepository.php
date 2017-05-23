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
            ->innerJoin('ext_group.group', 'intGroup')
            ->innerJoin('intGroup.roles', 'role')
            ->where('role IN (:roles)')
            ->orderBy("intGroup.{$orderedBy}", $order)
            ->setParameter('roles', $roles);
        if (!empty($search)) {
            $search = strtoupper($search);
            $qb
                ->andWhere($qb->expr()->like('UPPER(intGroup.name)', ':search'))
                ->setParameter('search', "%{$search}%");
        }

        return $executeQuery ? $qb->getQuery()->getResult() : $qb->getQuery();
    }

    public function deactivateGroupsForSource($source)
    {
        $now = new \DateTime();
        $now->setTime(0, 0, 0);

        $qb = $this
            ->createQueryBuilder('ext_group')
            ->update()
            ->set('ext_group.active', ':inactive')
            ->where('ext_group.sourceSlug = :source')
            ->andWhere('ext_group.lastSynchronizationDate < :now')
            ->setParameter('inactive', false)
            ->setParameter('source', $source)
            ->setParameter('now', $now);

        $qb->getQuery()->execute();
    }
}
