<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\DropZoneBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractFinder;
use Claroline\DropZoneBundle\Entity\Revision;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.dropzone.revision")
 * @DI\Tag("claroline.finder")
 */
class RevisionFinder extends AbstractFinder
{
    public function getClass()
    {
        return Revision::class;
    }

    public function configureQueryBuilder(
        QueryBuilder $qb,
        array $searches = [],
        array $sortBy = null,
        array $options = ['count' => false, 'page' => 0, 'limit' => -1]
    ) {
        $qb->join('obj.drop', 'drop');
        $qb->join('drop.dropzone', 'd');

        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
                case 'dropzone':
                    $qb->andWhere("d.uuid = :{$filterName}");
                    $qb->setParameter($filterName, $filterValue);
                    break;
                case 'drop':
                    $qb->andWhere("drop.uuid = :{$filterName}");
                    $qb->setParameter($filterName, $filterValue);
                    break;
                default:
                    $this->setDefaults($qb, $filterName, $filterValue);
            }
        }

        return $qb;
    }
}
