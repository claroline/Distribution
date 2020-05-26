<?php

namespace Icap\BlogBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractFinder;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Doctrine\ORM\QueryBuilder;
use Icap\BlogBundle\Entity\Post;

class PostFinder extends AbstractFinder
{
    public function getClass()
    {
        return Post::class;
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [], array $sortBy = null, array $options = ['count' => false, 'page' => 0, 'limit' => -1])
    {
        $qb->leftJoin('obj.blog', 'b');
        $qb->leftJoin('b.resourceNode', 'node');

        $workspaceJoin = false;
        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
                case 'published':
                    if ($filterValue) {
                        $qb->andWhere('node.published = :status');
                        $qb->andWhere('node.active = :published');
                        $qb->andWhere('obj.status = :status');
                        $qb->andWhere('obj.publicationDate <= :endOfDay');
                        $qb->setParameter('status', true);
                        $qb->setParameter('endOfDay', new \DateTime('tomorrow'));
                    } else {
                        $qb->andWhere('node.published = :status');
                        $qb->andWhere('obj.status = :status');
                        $qb->setParameter('status', false);
                    }
                    break;
                case 'authorName':
                    $qb->innerJoin('obj.author', 'author');
                    $qb->andWhere("
                        UPPER(author.firstName) LIKE :{$filterName}
                        OR UPPER(author.lastName) LIKE :{$filterName}
                        OR UPPER(CONCAT(CONCAT(author.firstName, ' '), author.lastName)) LIKE :{$filterName}
                        OR UPPER(CONCAT(CONCAT(author.lastName, ' '), author.firstName)) LIKE :{$filterName}
                    ");
                    $qb->setParameter($filterName, '%'.strtoupper($filterValue).'%');
                    break;
                case 'publicationDate':
                    $date = DateNormalizer::denormalize($filterValue);

                    $beginOfDay = clone $date;
                    $beginOfDay->modify('today');
                    $endOfDay = clone $beginOfDay;
                    $endOfDay->modify('tomorrow');
                    $endOfDay->modify('1 second ago');

                    $qb->andWhere("obj.{$filterName} >= :beginOfDay");
                    $qb->andWhere("obj.{$filterName} <= :endOfDay");
                    $qb->setParameter(':beginOfDay', $beginOfDay);
                    $qb->setParameter(':endOfDay', $endOfDay);
                    break;
                case 'fromDate':
                    $date = DateNormalizer::denormalize($filterValue);
                    $beginOfDay = clone $date;
                    $beginOfDay->modify('today');

                    $qb->andWhere('obj.publicationDate >= :beginOfDay');
                    $qb->setParameter(':beginOfDay', $beginOfDay);
                    break;
                case 'toDate':
                    $date = DateNormalizer::denormalize($filterValue);
                    $beginOfDay = clone $date;
                    $beginOfDay->modify('today');
                    $endOfDay = clone $beginOfDay;
                    $endOfDay->modify('tomorrow');
                    $endOfDay->modify('1 second ago');

                    $qb->andWhere('obj.publicationDate <= :endOfDay');
                    $qb->setParameter(':endOfDay', $endOfDay);
                    break;
                case 'tag':
                    $qb->andWhere('obj.uuid IN (
                        SELECT to.objectId
                        FROM Claroline\\TagBundle\\Entity\\TaggedObject to
                        INNER JOIN to.tag t
                        WHERE UPPER(t.name) = :tagFilter
                    )');
                    $qb->setParameter('tagFilter', strtoupper($filterValue));
                    break;
                case 'roles':
                    $managerRoles = [];
                    $otherRoles = [];

                    foreach ($filterValue as $roleName) {
                        if (preg_match('/^ROLE_WS_MANAGER_/', $roleName)) {
                            $managerRoles[] = $roleName;
                        } else {
                            $otherRoles[] = $roleName;
                        }
                    }

                    $managerSearch = $roleSearch = $searches;
                    $managerSearch['_managerRoles'] = $managerRoles;
                    $roleSearch['_roles'] = $otherRoles;
                    unset($managerSearch['roles']);
                    unset($roleSearch['roles']);

                    return $this->union($managerSearch, $roleSearch, $options, $sortBy);

                    break;
                case '_managerRoles':
                    if (!$workspaceJoin) {
                        $qb->join('node.workspace', 'w');
                        $workspaceJoin = true;
                    }

                    $qb->leftJoin('w.roles', 'owr');
                    $qb->andWhere('owr.name IN (:managerRoles)');

                    $qb->setParameter('managerRoles', $filterValue);
                    break;
                case '_roles':
                    $qb->leftJoin('node.rights', 'rights');
                    $qb->join('rights.role', 'rightsr');
                    $qb->andWhere('rightsr.name IN (:otherRoles)');
                    $qb->andWhere('BIT_AND(rights.mask, 1) = 1');
                    $qb->setParameter('otherRoles', $filterValue);
                    break;
                case 'workspace':
                    if (!$workspaceJoin) {
                        $qb->join('node.workspace', 'w');
                        $workspaceJoin = true;
                    }

                    $qb->andWhere("w.uuid = :{$filterName}");
                    $qb->setParameter($filterName, $filterValue);
                    break;
                case 'archived':
                    if (!$workspaceJoin) {
                        $qb->join('node.workspace', 'w');
                        $workspaceJoin = true;
                    }

                    $qb->andWhere("w.archived = :{$filterName}");
                    $qb->setParameter($filterName, $filterValue);
                    break;
                default:
                    $this->setDefaults($qb, $filterName, $filterValue);
            }
        }

        //pinned always first
        $qb->addOrderBy('obj.pinned', 'DESC');
        //and then custom sort
        if (!empty($sortBy)) {
            $qb->addOrderBy('obj.'.$sortBy['property'], 1 === $sortBy['direction'] ? 'ASC' : 'DESC');
        }

        return $qb;
    }
}
