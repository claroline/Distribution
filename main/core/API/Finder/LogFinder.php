<?php

namespace Claroline\CoreBundle\API\Finder;

use Claroline\CoreBundle\API\FinderInterface;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.log")
 * @DI\Tag("claroline.finder")
 */
class LogFinder implements FinderInterface
{

    /**
     * The queried object is already named "obj".
     *
     * @param QueryBuilder $qb
     * @param array $searches
     * @param array|null $sortBy
     *
     * @return QueryBuilder
     */
    public function configureQueryBuilder(QueryBuilder $qb, array $searches, array $sortBy = null)
    {
        $qb->join('obj.resourceType', 'ort');

        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
                case 'resourceType':
                    if (is_array($filterValue)) {
                        $qb->andWhere("ort.name IN (:{$filterName})");
                    } else {
                        $qb->andWhere("ort.name LIKE :{$filterName}");
                    }
                    $qb->setParameter($filterName, $filterValue);
                    break;
                default:
                    if (is_string($filterValue)) {
                        $qb->andWhere("UPPER(obj.{$filterName}) LIKE :{$filterName}");
                        $qb->setParameter($filterName, '%'.strtoupper($filterValue).'%');
                    } else {
                        $qb->andWhere("obj.{$filterName} = :{$filterName}");
                        $qb->setParameter($filterName, $filterValue);
                    }
                    break;
            }
        }

        return $qb;
    }

    /** @return $string */
    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Log\Log';
    }
}