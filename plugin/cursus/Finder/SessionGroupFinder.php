<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractFinder;
use Claroline\CursusBundle\Entity\Registration\SessionGroup;
use Doctrine\ORM\QueryBuilder;

class SessionGroupFinder extends AbstractFinder
{
    public function getClass()
    {
        return SessionGroup::class;
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [], array $sortBy = null, array $options = ['count' => false, 'page' => 0, 'limit' => -1])
    {
        $groupJoin = false;

        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
                case 'session':
                    $qb->join('obj.session', 's');
                    $qb->andWhere("s.uuid = :{$filterName}");
                    $qb->setParameter($filterName, $filterValue);
                    break;

                case 'group':
                    if (!$groupJoin) {
                        $qb->join('obj.group', 'g');
                        $groupJoin = true;
                    }
                    $qb->andWhere("g.uuid = :{$filterName}");
                    $qb->setParameter($filterName, $filterValue);
                    break;

                default:
                    $this->setDefaults($qb, $filterName, $filterValue);
            }
        }

        return $qb;
    }
}
