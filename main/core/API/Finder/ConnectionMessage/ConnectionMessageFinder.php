<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\API\Finder\ConnectionMessage;

use Claroline\AppBundle\API\Finder\AbstractFinder;
use Claroline\CoreBundle\Entity\ConnectionMessage\ConnectionMessage;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.connection.message")
 * @DI\Tag("claroline.finder")
 */
class ConnectionMessageFinder extends AbstractFinder
{
    public function getClass()
    {
        return ConnectionMessage::class;
    }

    public function configureQueryBuilder(
        QueryBuilder $qb,
        array $searches = [],
        array $sortBy = null,
        array $options = ['count' => false, 'page' => 0, 'limit' => -1]
    ) {
        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
                default:
                    $this->setDefaults($qb, $filterName, $filterValue);
            }
        }

//        if (!is_null($sortBy) && isset($sortBy['property']) && isset($sortBy['direction'])) {
//            $sortByProperty = $sortBy['property'];
//            $sortByDirection = 1 === $sortBy['direction'] ? 'ASC' : 'DESC';
//
//            switch ($sortByProperty) {
//                default:
//                   $qb->orderBy("obj.{$sortByProperty}", $sortByDirection);
//            }
//        }

        return $qb;
    }

    public function getFilters()
    {
        return [];
    }
}
