<?php

namespace Claroline\CoreBundle\API\Finder;

use Claroline\AppBundle\API\FinderInterface;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.log")
 * @DI\Tag("claroline.finder")
 */
class LogFinder implements FinderInterface
{
    public function __construct()
    {
    }

    /**
     * The queried object is already named "obj".
     *
     * @param QueryBuilder $qb
     * @param array        $searches
     * @param array|null   $sortBy
     *
     * @return QueryBuilder
     */
    public function configureQueryBuilder(QueryBuilder $qb, array $searches, array $sortBy = null)
    {
        $qb->leftJoin('obj.resourceType', 'ort');
        $userJoin = false;
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
                case 'doer.name':
                    $userJoin = true;
                    $qb->join('obj.doer', 'doer');
                    $qb->andWhere($qb->expr()->orX(
                        $qb->expr()->like('UPPER(doer.firstName)', ':doer'),
                        $qb->expr()->like('UPPER(doer.lastName)', ':doer'),
                        $qb->expr()->like('UPPER(doer.username)', ':doer'),
                        $qb->expr()->like('UPPER(doer.email)', ':doer')
                    ));
                    $qb->setParameter('doer', '%'.strtoupper($filterValue).'%');
                    break;
                case 'dateLog':
                    $qb->andWhere('obj.dateLog > :date')
                        ->setParameter('date', $filterValue);
                    break;
                case 'action':
                    $this->filterAction($filterValue, $qb);
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

        if (!empty($sortBy) && $sortBy['property'] === 'doer.name') {
            if (!$userJoin) {
                $qb->join('obj.doer', 'doer');
            }
            $direction = 1 === $sortBy['direction'] ? 'ASC' : 'DESC';
            $qb->addOrderBy('doer.lastName', $direction);
            $qb->addOrderBy('doer.firstName', $direction);
        }

        return $qb;
    }

    /** @return $string */
    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Log\Log';
    }

    private function filterAction($action, QueryBuilder $qb)
    {
        if ($action === 'all') {
            return;
        }

        $actionChunks = explode('::', $action);
        if (count($actionChunks) < 2) {
            $qb
                ->andWhere('obj.action = :action')
                ->setParameter('action', $action);

            return;
        }
        if (count($actionChunks) === 2 && $actionChunks[1] === 'all') {
            $qb
                ->andWhere('obj.action LIKE :action')
                ->setParameter('action', $actionChunks[0].'%');

            return;
        }
        if ($actionChunks[0] === 'resource') {
            $qb
                ->andWhere('ort.name = :type')
                ->setParameter('type', $actionChunks[1]);
            if ($actionChunks[2] !== 'all') {
                $qb->andWhere('obj.action = :action')
                    ->setParameter('action', $actionChunks[2]);
            }
        }
    }
}
