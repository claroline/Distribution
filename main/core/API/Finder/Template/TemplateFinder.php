<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\API\Finder\Template;

use Claroline\AppBundle\API\Finder\AbstractFinder;
use Claroline\CoreBundle\Entity\Template\Template;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.template")
 * @DI\Tag("claroline.finder")
 */
class TemplateFinder extends AbstractFinder
{
    public function getClass()
    {
        return Template::class;
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [], array $sortBy = null)
    {
        $typeJoin = false;

        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
                case 'type':
                    if (!$typeJoin) {
                        $qb->join('obj.type', 't');
                        $typeJoin = true;
                    }
                    $qb->andWhere("t.uuid = :{$filterName}");
                    $qb->setParameter($filterName, $filterValue);
                    break;
                case 'typeName':
                    if (!$typeJoin) {
                        $qb->join('obj.type', 't');
                        $typeJoin = true;
                    }
                    $qb->andWhere("UPPER(t.name) LIKE :{$filterName}");
                    $qb->setParameter($filterName, '%'.strtoupper($filterValue).'%');
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
        if (!is_null($sortBy) && isset($sortBy['property']) && isset($sortBy['direction'])) {
            $sortByProperty = $sortBy['property'];
            $sortByDirection = 1 === $sortBy['direction'] ? 'ASC' : 'DESC';

            switch ($sortByProperty) {
                case 'typeName':
                    if (!$typeJoin) {
                        $qb->join('obj.type', 't');
                    }
                    $qb->orderBy('t.name', $sortByDirection);
                    break;
            }
        }

        return $qb;
    }
}
