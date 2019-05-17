<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AudioPlayerBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractFinder;
use Claroline\AudioPlayerBundle\Entity\Resource\Section;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.audio.resource_section")
 * @DI\Tag("claroline.finder")
 */
class SectionFinder extends AbstractFinder
{
    public function getClass()
    {
        return Section::class;
    }

    public function configureQueryBuilder(
        QueryBuilder $qb,
        array $searches = [],
        array $sortBy = null,
        array $options = ['count' => false, 'page' => 0, 'limit' => -1]
    ) {
        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
                case 'resourceNode':
                    $qb->join('obj.resourceNode', 'r');
                    $qb->andWhere("r.uuid = :{$filterName}");
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

        return $qb;
    }
}
