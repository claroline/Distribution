<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\PlannedNotificationBundle\Finder;

use Claroline\AppBundle\API\FinderInterface;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.planned_notification")
 * @DI\Tag("claroline.finder")
 */
class PlannedNotificationFinder implements FinderInterface
{
    public function getClass()
    {
        return 'Claroline\PlannedNotificationBundle\Entity\PlannedNotification';
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [], array $sortBy = null)
    {
        $rolesJoin = false;
        $qb->join('obj.workspace', 'w');
        $qb->andWhere('w.uuid = :workspaceUuid');
        $qb->setParameter('workspaceUuid', $searches['workspace']);

        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
                case 'workspace':
                    break;
                case 'roles':
                    $qb->leftJoin('obj.roles', 'r');
                    $qb->andWhere("UPPER(r.translationKey) LIKE :{$filterName}");
                    $qb->setParameter($filterName, '%'.strtoupper($filterValue).'%');
                    $rolesJoin = true;
                    break;
                case 'parameters.action':
                case 'parameters.interval':
                case 'parameters.byMail':
                case 'parameters.byMessage':
                    $validFilterName = str_replace('parameters.', '', $filterName);

                    if (is_bool($filterValue)) {
                        $qb->andWhere("obj.{$validFilterName} = :{$validFilterName}");
                        $qb->setParameter($validFilterName, $filterValue);
                    } else {
                        $qb->andWhere("UPPER(obj.{$validFilterName}) LIKE :{$validFilterName}");
                        $qb->setParameter($validFilterName, '%'.strtoupper($filterValue).'%');
                    }
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
                case 'parameters.action':
                case 'parameters.interval':
                case 'parameters.byMail':
                case 'parameters.byMessage':
                    $validProperty = str_replace('parameters.', '', $sortByProperty);
                    $qb->orderBy("obj.{$validProperty}", $sortByDirection);
                    break;
                case 'roles':
                    if (!$rolesJoin) {
                        $qb->leftJoin('obj.roles', 'r');
                    }
                    $qb->orderBy('r.translationKey', $sortByDirection);
                    break;
            }
        }

        return $qb;
    }
}
