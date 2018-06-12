<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AgendaBundle\Finder;

use Claroline\AppBundle\API\Finder\FinderTrait;
use Claroline\AppBundle\API\FinderInterface;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.agenda")
 * @DI\Tag("claroline.finder")
 */
class EventFinder implements FinderInterface
{
    use FinderTrait;

    public function getClass()
    {
        return 'Claroline\AgendaBundle\Entity\Event';
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [], array $sortBy = null)
    {
        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
              case 'workspaces':
                $qb->leftJoin('obj.workspace', 'w');
                $qb->andWhere('w.uuid IN (:'.$filterName.')');
                $qb->setParameter($filterName, $filterValue);
                break;
              case 'types':
                if ($filterValue === ['task']) {
                    $qb->andWhere('obj.isTask = true');
                } elseif ($filterValue === ['event']) {
                    $qb->andWhere('obj.isTask = false');
                }
                break;
              case 'createdAfter':
                break;
              case 'endBefore':
                break;
              default:
                $this->setDefaults($qb, $filterName, $filterValue);
             }
        }

        return $qb;
    }
}
