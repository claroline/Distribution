<?php

namespace Claroline\CoreBundle\API\Finder;

use Claroline\AppBundle\API\Finder\AbstractFinder;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.log")
 * @DI\Tag("claroline.finder")
 */
class LogFinder extends AbstractFinder
{
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
                case 'doer':
                    if (!$userJoin) {
                        $userJoin = true;
                        $qb->join('obj.doer', 'doer');
                    }
                    $qb->andWhere("doer.uuid = :{$filterName}");
                    $qb->setParameter($filterName, $filterValue);
                    break;
                case 'doer.name':
                    if (!$userJoin) {
                        $userJoin = true;
                        $qb->join('obj.doer', 'doer');
                    }
                    $qb->andWhere($qb->expr()->orX(
                        $qb->expr()->like('UPPER(doer.firstName)', ':doer'),
                        $qb->expr()->like('UPPER(doer.lastName)', ':doer'),
                        $qb->expr()->like('UPPER(doer.username)', ':doer'),
                        $qb->expr()->like('UPPER(doer.email)', ':doer'),
                        $qb->expr()->like(
                            "CONCAT(CONCAT(UPPER(doer.firstName), ' '), UPPER(doer.lastName))",
                            ':doer'
                        ),
                        $qb->expr()->like(
                            "CONCAT(CONCAT(UPPER(doer.lastName), ' '), UPPER(doer.firstName))",
                            ':doer'
                        )
                    ));
                    $qb->setParameter('doer', '%'.strtoupper($filterValue).'%');
                    break;
                case 'dateLog':
                    $qb->andWhere('obj.dateLog >= :dateFrom')
                        ->setParameter('dateFrom', $filterValue);
                    break;
                case 'dateFromStrict':
                    $qb->andWhere('obj.dateLog > :dateFromStrict')
                        ->setParameter('dateFromStrict', $filterValue);
                    break;
                case 'dateTo':
                    $qb->andWhere('obj.dateLog <= :dateTo')
                        ->setParameter('dateTo', $filterValue);
                    break;
                case 'dateToStrict':
                    $qb->andWhere('obj.dateLog < :dateToStrict')
                        ->setParameter('dateToStrict', $filterValue);
                    break;
                case 'action':
                    $this->filterAction($filterValue, $qb);
                    break;
                case 'organization':
                    if (!$userJoin) {
                        $userJoin = true;
                        $qb->join('obj.doer', 'doer');
                    }
                    $qb->join('doer.userOrganizationReferences', 'orgaRef')
                        ->andWhere('orgaRef.organization IN (:organizations)')
                        ->setParameter('organizations', $filterValue);
                    break;
                case 'unique':
                case 'type':
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

        if (!empty($sortBy) && ('doer.name' === $sortBy['property'] || 'actions' === $sortBy['property'])) {
            $direction = 1 === $sortBy['direction'] ? 'ASC' : 'DESC';
            switch ($sortBy['property']) {
                case 'doer.name':
                    if (!$userJoin) {
                        $qb->join('obj.doer', 'doer');
                    }
                    $qb->addOrderBy('doer.lastName', $direction);
                    $qb->addOrderBy('doer.firstName', $direction);
                    $qb->addOrderBy('doer.id', $direction);
                    break;
                case 'actions':
                    $qb->addOrderBy('actions', $direction);
            }
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
        if ('all' === $action) {
            return;
        }

        $actionChunks = explode('::', $action);
        if (count($actionChunks) < 2) {
            $qb
                ->andWhere('obj.action = :action')
                ->setParameter('action', $action);

            return;
        }
        if (2 === count($actionChunks) && 'all' === $actionChunks[1]) {
            $qb
                ->andWhere('obj.action LIKE :action')
                ->setParameter('action', $actionChunks[0].'%');

            return;
        }
        if ('resource' === $actionChunks[0]) {
            $qb
                ->andWhere('ort.name = :type')
                ->setParameter('type', $actionChunks[1]);
            if ('all' !== $actionChunks[2]) {
                $qb->andWhere('obj.action = :action')
                    ->setParameter('action', $actionChunks[2]);
            }
        }
    }
}
