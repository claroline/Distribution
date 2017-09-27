<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace UJM\ExoBundle\API\Finder;

use Claroline\CoreBundle\API\FinderInterface;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Quiz questions finder (used by the Question bank).
 *
 * @DI\Service("ujm_exo.api.finder.question")
 * @DI\Tag("claroline.finder")
 */
class QuestionFinder implements FinderInterface
{
    public function getClass()
    {
        return 'UJM\ExoBundle\Entity\Item\Item';
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [])
    {
        // only search in questions (not content items)
        // in any case exclude every mimeType that does not begin with [application] from results
        $qb
            ->andWhere('obj.mimeType LIKE :questionPrefix')
            ->setParameter('questionPrefix', 'application%');

        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
                case 'selfOnly':
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
}
