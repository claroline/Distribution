<?php

namespace Icap\WikiBundle\Finder;

use Claroline\AppBundle\API\FinderInterface;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.wiki.section")
 * @DI\Tag("claroline.finder")
 */
class SectionFinder implements FinderInterface
{
    /**
     * The queried object is already named "obj".
     *
     * @param QueryBuilder $qb
     * @param array        $searches
     * @param array|null   $sortBy
     */
    public function configureQueryBuilder(QueryBuilder $qb, array $searches, array $sortBy = null)
    {
        $qb->join('obj.activeContribution', 'contribution');
        foreach ($searches as $filterName => $filterValue) {
            if (is_string($filterValue)) {
                $qb->andWhere("UPPER(obj.{$filterName}) LIKE :{$filterName}");
                $qb->setParameter($filterName, '%'.strtoupper($filterValue).'%');
            } else {
                $qb->andWhere("obj.{$filterName} = :{$filterName}");
                $qb->setParameter($filterName, $filterValue);
            }
        }
    }

    /** @return $string */
    public function getClass()
    {
        return 'Icap\WikiBundle\Entity\Section';
    }
}
