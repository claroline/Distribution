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
        return 'Claroline\CoreBundle\Entity\Log\Connection\LogConnectPlatform';
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [], array $sortBy = null)
    {
        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
                case 'organizations':
                    $qb->join('obj.user', 'u');
                    $qb->leftJoin('u.userOrganizationReferences', 'oref');
                    $qb->leftJoin('oref.organization', 'o');
                    $qb->andWhere('o.uuid IN (:organizationIds)');
                    $qb->setParameter('organizationIds', is_array($filterValue) ? $filterValue : [$filterValue]);
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

        return $qb;
    }
}
