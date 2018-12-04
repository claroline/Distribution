<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\OpenBadgeBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractFinder;
use Claroline\OpenBadgeBundle\Entity\Assertion;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.openbadge.assertion")
 * @DI\Tag("claroline.finder")
 */
class AssertionFinder extends AbstractFinder
{
    public function getClass()
    {
        return Assertion::class;
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [], array $sortBy = null)
    {
        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
              case 'badge':
                  $qb->leftJoin('obj.badge', 'badge');
                  $qb->andWhere('badge.uuid = :uuid');
                  $qb->setParameter('uuid', $filterValue);
                  break;
            }
        }

        return $qb;
    }
}
