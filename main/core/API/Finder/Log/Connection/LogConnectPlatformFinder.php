<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\API\Finder\Log\Connection;

use Claroline\AppBundle\API\Finder\AbstractFinder;
use Claroline\CoreBundle\Entity\Log\Connection\LogConnectPlatform;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.log.connection.platform")
 * @DI\Tag("claroline.finder")
 */
class LogConnectPlatformFinder extends AbstractFinder
{
    public function getClass()
    {
        return LogConnectPlatform::class;
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [], array $sortBy = null, array $options = ['count' => false, 'page' => 0, 'limit' => -1])
    {
        $userJoined = false;

        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
                case 'organizations':
                    if (!$userJoined) {
                        $qb->join('obj.user', 'u');
                        $userJoined = true;
                    }
                    $qb->leftJoin('u.userOrganizationReferences', 'oref');
                    $qb->leftJoin('oref.organization', 'o');
                    $qb->andWhere('o.uuid IN (:organizationIds)');
                    $qb->setParameter('organizationIds', is_array($filterValue) ? $filterValue : [$filterValue]);
                    break;
                case 'user':
                    if (!$userJoined) {
                        $qb->join('obj.user', 'u');
                        $userJoined = true;
                    }
                    $qb->andWhere("u.uuid = :{$filterName}");
                    $qb->setParameter($filterName, $filterValue);
                    break;
                case 'name':
                    if (!$userJoined) {
                        $qb->join('obj.user', 'u');
                        $userJoined = true;
                    }
                    $qb->andWhere($qb->expr()->orX(
                        $qb->expr()->like('UPPER(u.username)', ':name'),
                        $qb->expr()->like(
                            "CONCAT(CONCAT(UPPER(u.firstName), ' '), UPPER(u.lastName))",
                            ':name'
                        ),
                        $qb->expr()->like(
                            "CONCAT(CONCAT(UPPER(u.lastName), ' '), UPPER(u.firstName))",
                            ':name'
                        )
                    ));
                    $qb->setParameter('name', '%'.strtoupper($filterValue).'%');
                    break;
                case 'afterDate':
                    $qb->andWhere("obj.connectionDate > :{$filterName}");
                    $qb->setParameter($filterName, $filterValue);
                    break;
                case 'beforeDate':
                    $qb->andWhere("obj.connectionDate < :{$filterName}");
                    $qb->setParameter($filterName, $filterValue);
                    break;
                default:
                    if (is_bool($filterValue)) {
                        $qb->andWhere("obj.{$filterName} = :{$filterName}");
                        $qb->setParameter($filterName, $filterValue);
                    } else {
                        $qb->andWhere("UPPER(obj.{$filterName}) LIKE :{$filterName}");
                        $qb->setParameter($filterName, '%'.strtoupper($filterValue).'%');
                    }
            }
        }

        if (!is_null($sortBy) && isset($sortBy['property']) && isset($sortBy['direction'])) {
            $sortByProperty = $sortBy['property'];
            $sortByDirection = 1 === $sortBy['direction'] ? 'ASC' : 'DESC';

            switch ($sortByProperty) {
                case 'name':
                    $qb->orderBy('obj.user', $sortByDirection);
                    break;
                default:
                   $qb->orderBy("obj.{$sortByProperty}", $sortByDirection);
            }
        }

        return $qb;
    }
}
