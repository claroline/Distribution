<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AudioPlayerBundle\Finder\Resource;

use Claroline\AppBundle\API\Finder\AbstractFinder;
use Claroline\AudioPlayerBundle\Entity\Resource\SectionComment;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.audio.resource_section_comment")
 * @DI\Tag("claroline.finder")
 */
class SectionCommentFinder extends AbstractFinder
{
    public function getClass()
    {
        return SectionComment::class;
    }

    public function configureQueryBuilder(
        QueryBuilder $qb,
        array $searches = [],
        array $sortBy = null,
        array $options = ['count' => false, 'page' => 0, 'limit' => -1]
    ) {
        $userJoin = false;

        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
                case 'section':
                    $qb->join('obj.section', 's');
                    $qb->andWhere("s.uuid = :{$filterName}");
                    $qb->setParameter($filterName, $filterValue);
                    break;
                case 'user':
                    if (!$userJoin) {
                        $qb->join('obj.user', 'u');
                        $userJoin = true;
                    }
                    $qb->andWhere("u.uuid = :{$filterName}");
                    $qb->setParameter($filterName, $filterValue);
                    break;
                case 'user.name':
                    if (!$userJoin) {
                        $qb->join('obj.user', 'u');
                        $userJoin = true;
                    }
                    $qb->andWhere($qb->expr()->orX(
                        $qb->expr()->like(
                            "CONCAT(CONCAT(UPPER(u.firstName), ' '), UPPER(u.lastName))",
                            ':name'
                        ),
                        $qb->expr()->like(
                            "CONCAT(CONCAT(UPPER(u.lastName), ' '), UPPER(u.firstName))",
                            ':name'
                        )
                    ));
                    $qb->setParameter('name', '%'.strtoupper($filterValue).'%');
                    break;
                case 'user.firstName':
                    if (!$userJoin) {
                        $qb->join('obj.user', 'u');
                        $userJoin = true;
                    }
                    $qb->andWhere('u.firstName LIKE :firstName');
                    $qb->setParameter('firstName', '%'.strtoupper($filterValue).'%');
                    break;
                case 'user.lastName':
                    if (!$userJoin) {
                        $qb->join('obj.user', 'u');
                        $userJoin = true;
                    }
                    $qb->andWhere('u.lastName LIKE :lastName');
                    $qb->setParameter('lastName', '%'.strtoupper($filterValue).'%');
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
                case 'user.firstName':
                    if (!$userJoin) {
                        $qb->join('obj.user', 'u');
                    }
                    $qb->orderBy('u.firstName', $sortByDirection);
                    break;
                case 'user.lastName':
                    if (!$userJoin) {
                        $qb->join('obj.user', 'u');
                    }
                    $qb->orderBy('u.lastName', $sortByDirection);
                    break;
            }
        }

        return $qb;
    }
}