<?php

namespace Icap\BlogBundle\Finder;

use Claroline\AppBundle\API\FinderInterface;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.blog.post")
 * @DI\Tag("claroline.finder")
 */
class PostFinder implements FinderInterface
{
    public function getClass()
    {
        return 'Icap\BlogBundle\Entity\Post';
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [], array $sortBy = null)
    {
        foreach ($searches as $filterName => $filterValue) {
            if ($filterName === "published") {
                $qb
                ->andWhere("obj.status = :status")
                ->andWhere("obj.publicationDate <= :endOfDay")
                ->setParameter("status", true)
                ->setParameter("endOfDay", new \DateTime('tomorrow'));
            } else if ($filterName === "authorName") {
                $qb
                ->innerJoin("obj.author", "author")
                ->andWhere("UPPER(author.firstName) LIKE :{$filterName} 
                            OR UPPER(author.lastName) LIKE :{$filterName} 
                            OR UPPER(CONCAT(CONCAT(author.firstName, ' '), author.lastName)) LIKE :{$filterName}
                            OR UPPER(CONCAT(CONCAT(author.lastName, ' '), author.firstName)) LIKE :{$filterName}
                            ");
                $qb->setParameter($filterName, '%'.strtoupper($filterValue).'%');
            } else if ($filterName === "publicationDate") {
                $date = DateNormalizer::denormalize($filterValue);
                
                $beginOfDay = clone $date;
                $beginOfDay->modify('today');
                $endOfDay = clone $beginOfDay;
                $endOfDay->modify('tomorrow');
                $endOfDay->modify('1 second ago');
                
                $qb
                    ->andWhere("obj.{$filterName} >= :beginOfDay")
                    ->andWhere("obj.{$filterName} <= :endOfDay")
                    ->setParameter(":beginOfDay", $beginOfDay)
                    ->setParameter(":endOfDay", $endOfDay);
            } else if ($filterName === "fromDate") {
                $date = DateNormalizer::denormalize($filterValue);
                $beginOfDay = clone $date;
                $beginOfDay->modify('today');
                
                $qb
                ->andWhere("obj.publicationDate >= :beginOfDay")
                ->setParameter(":beginOfDay", $beginOfDay);
            } else if ($filterName === "toDate") {
                $date = DateNormalizer::denormalize($filterValue);
                $beginOfDay = clone $date;
                $beginOfDay->modify('today');
                $endOfDay = clone $beginOfDay;
                $endOfDay->modify('tomorrow');
                $endOfDay->modify('1 second ago');
                
                $qb
                ->andWhere("obj.publicationDate <= :endOfDay")
                ->setParameter(":endOfDay", $endOfDay);
            } else if (is_string($filterValue)) {
                $qb->andWhere("UPPER(obj.{$filterName}) LIKE :{$filterName}");
                $qb->setParameter($filterName, '%'.strtoupper($filterValue).'%');
            } else {
                $qb->andWhere("obj.{$filterName} = :{$filterName}");
                $qb->setParameter($filterName, $filterValue);
            }
            
            //default sort by publicationDate
            if ($sortBy == null) {
                $qb->orderBy('obj.publicationDate', 'DESC');
            }
        }

        return $qb;
    }
}
