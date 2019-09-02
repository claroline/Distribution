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

use Doctrine\ORM\EntityRepository;

class WidgetInstanceRepository extends EntityRepository
{
    /**
     * @param string $filter
     *
     * @return int
     */
    public function countWidgetInstances($filter = null, $organizations = null)
    {
        $qb = $this->createQueryBuilder('widget')
            ->select('COUNT(widget.id)');

        switch ($filter) {
            case 'workspace':
                $qb->where('widget.isDesktop = FALSE');
                break;
            case 'desktop':
                $qb->where('widget.isDesktop = TRUE');
                break;
            default:
                break;
        }

        if (null !== $organizations) {
            $qb->leftJoin('widget.user', 'user')
                ->leftJoin('user.userOrganizationReferences', 'orgaRef')
                ->leftJoin('widget.workspace', 'ws')
                ->leftJoin('ws.organizations', 'orgas')
                ->andWhere($qb->expr()->orX('orgaRef.organization IN (:organizations)', 'orgas IN (:organizations)'))
                ->setParameter('organizations', $organizations);
        }

        return $qb->getQuery()->getSingleScalarResult();
    }

    /**
     * Count widgets by type (with subtotal for windget in workspaces or on desktops).
     *
     * @return array
     */
    public function countByType($organizations = null)
    {
        $qb = $this->createQueryBuilder('wi')
            ->select('wi.id, w.name, COUNT(w.id) AS total, SUM(CASE WHEN wi.isDesktop = TRUE THEN 1 ELSE 0 END) AS totalByDesktop, SUM(CASE WHEN wi.isDesktop = FALSE THEN 1 ELSE 0 END) AS totalByWorkspace')
            ->leftJoin('wi.widget', 'w')
            ->groupBy('w.id')
            ->orderBy('total', 'DESC');

        if (null !== $organizations) {
            $qb->leftJoin('wi.user', 'user')
                ->leftJoin('user.userOrganizationReferences', 'orgaRef')
                ->leftJoin('wi.workspace', 'ws')
                ->leftJoin('ws.organizations', 'orgas')
                ->andWhere($qb->expr()->orX('orgaRef.organization IN (:organizations)', 'orgas IN (:organizations)'))
                ->setParameter('organizations', $organizations);
        }

        return $qb->getQuery()->getResult();
    }
}
