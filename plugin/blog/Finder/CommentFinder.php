<?php

namespace Icap\BlogBundle\Finder;

use Claroline\AppBundle\API\FinderInterface;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.blog.comment")
 * @DI\Tag("claroline.finder")
 */
class CommentFinder implements FinderInterface
{
    public function getClass()
    {
        return 'Icap\BlogBundle\Entity\Comment';
    }
    
    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [], array $sortBy = null)
    {
        foreach ($searches as $filterName => $filterValue) {
            if ($filterName === "allowedToSeeForUser") {
                $qb
                ->andWhere("obj.status = :status OR obj.author =:userId")
                ->setParameter("status", true)
                ->setParameter("userId", $filterValue);
            } else if ($filterName === "publishedOnly") {
                $qb
                ->andWhere("obj.status = :status")
                ->setParameter("status", true);
            } else if ($filterName === "authorName") {
                $qb
                ->innerJoin("obj.author", "author")
                ->andWhere("UPPER(author.firstName) LIKE :{$filterName}
                            OR UPPER(author.lastName) LIKE :{$filterName}
                            OR UPPER(CONCAT(CONCAT(author.firstName, ' '), author.lastName)) LIKE :{$filterName}
                            OR UPPER(CONCAT(CONCAT(author.lastName, ' '), author.firstName)) LIKE :{$filterName}
                            ");
                $qb->setParameter($filterName, '%'.strtoupper($filterValue).'%');
            } else if (is_string($filterValue)) {
                $qb->andWhere("UPPER(obj.{$filterName}) LIKE :{$filterName}");
                $qb->setParameter($filterName, '%'.strtoupper($filterValue).'%');
            } else {
                $qb->andWhere("obj.{$filterName} = :{$filterName}");
                $qb->setParameter($filterName, $filterValue);
            }
        }
        
        $qb
        ->orderBy('obj.creationDate', 'DESC');
        
        return $qb;
    }
}

