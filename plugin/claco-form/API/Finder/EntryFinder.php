<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ClacoFormBundle\API\Finder;

use Claroline\CoreBundle\API\FinderInterface;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @DI\Service("claroline.api.finder.clacoform.entry")
 * @DI\Tag("claroline.finder")
 */
class EntryFinder implements FinderInterface
{
    /** @var ContainerInterface */
    private $container;

    /**
     * EntryFinder constructor.
     *
     * @DI\InjectParams({
     *     "container" = @DI\Inject("service_container")
     * })
     *
     * @param ContainerInterface $container
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function getClass()
    {
        return 'Claroline\ClacoFormBundle\Entity\Entry';
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [], array $extraData = [])
    {
        $clacoFormManager = $this->container->get('claroline.manager.claco_form_manager');
        $translator = $this->container->get('translator');
        $tokenStorage = $this->container->get('security.token_storage');

        $currentUser = $tokenStorage->getToken()->getUser();

        $isAnon = $currentUser === 'anon.';
        $clacoForm = $clacoFormManager->getClacoFormById($extraData['clacoForm']);
        $searchEnabled = $clacoForm->getSearchEnabled();

        $qb->join('obj.clacoForm', 'cf');
        $qb->andWhere('cf.id = :clacoFormId');
        $qb->setParameter('clacoFormId', $extraData['clacoForm']);

        $type = isset($searches['type']) ? $searches['type'] : null;

        if ($type) {
            switch ($type) {
                case $translator->trans('all_entries', [], 'clacoform'):
                    $type = 'all';
                    break;
                case $translator->trans('my_entries', [], 'clacoform'):
                    $type = 'my';
                    break;
                case $translator->trans('manager_entries', [], 'clacoform'):
                    $type = 'manager';
                    break;
                default:
                    $type = null;
            }
        }
        if (is_null($type)) {
            if ($searchEnabled || $clacoFormManager->hasRight($clacoForm, 'EDIT')) {
                $type = 'all';
            } elseif (!$isAnon) {
                $type = $clacoFormManager->isCategoryManager($clacoForm, $currentUser) ? 'manager' : 'my';
            }
        }
        if (is_null($type)) {
            throw new AccessDeniedException();
        }
        $userJoined = false;
        $categoriesJoined = false;

        switch ($type) {
            case 'all':
                break;
            case 'manager':
                $qb->join('obj.categories', 'c');
                $qb->join('c.managers', 'cm');
                $qb->andWhere('cm.id = :managerId');
                $qb->setParameter('managerId', $currentUser->getId());
                $categoriesJoined = true;
                break;
            case 'my':
                $qb->join('obj.user', 'u');
                $qb->leftJoin('obj.entryUsers', 'eu');
                $qb->leftJoin('eu.user', 'euu');
                $qb->andWhere('u.id = :userId');
                $qb->orWhere('(euu.id = :userId AND eu.shared = true)');
                $qb->setParameter('userId', $currentUser->getId());
                $userJoined = true;
                break;
        }
        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
                case 'title':
                    $qb->andWhere('UPPER(obj.title) LIKE :title');
                    $qb->setParameter('title', '%'.strtoupper($filterValue).'%');
                    break;
                case 'status':
                    $qb->andWhere('obj.status = :status');
                    $qb->setParameter('status', $filterValue ? 1 : 0);
                    break;
                case 'user':
                    if (!$userJoined) {
                        $qb->join('obj.user', 'u');
                    }
                    $qb->andWhere("
                        UPPER(u.firstName) LIKE :name
                        OR UPPER(u.lastName) LIKE :name
                        OR UPPER(u.username) LIKE :name
                        OR CONCAT(UPPER(u.firstName), CONCAT(' ', UPPER(u.lastName))) LIKE :name
                        OR CONCAT(UPPER(u.lastName), CONCAT(' ', UPPER(u.firstName))) LIKE :name
                    ");
                    $qb->setParameter('name', '%'.strtoupper($filterValue).'%');
                    break;
                case 'createdAfter':
                    $qb->andWhere("obj.creationDate >= :{$filterName}");
                    $qb->setParameter($filterName, new \DateTime(date('Y-m-d', $filterValue)));
                    break;
                case 'createdBefore':
                    $qb->andWhere("obj.creationDate <= :{$filterName}");
                    $qb->setParameter($filterName, new \DateTime(date('Y-m-d', $filterValue)));
                    break;
                case 'categories':
                    if (!$categoriesJoined) {
                        $qb->join('obj.categories', 'c');
                    }
                    $qb->andWhere('UPPER(c.name) LIKE :categoryName');
                    $qb->setParameter('categoryName', '%'.strtoupper($filterValue).'%');
                    break;
                case 'keywords':
                    $qb->join('obj.keywords', 'k');
                    $qb->andWhere('UPPER(k.name) LIKE :keywordName');
                    $qb->setParameter('keywordName', '%'.strtoupper($filterValue).'%');
                    break;
                default:
//                    if (is_string($filterValue)) {
//                        $qb->andWhere("UPPER(obj.{$filterName}) LIKE :{$filterName}");
//                        $qb->setParameter($filterName, '%'.strtoupper($filterValue).'%');
//                    } else {
//                        $qb->andWhere("obj.{$filterName} = :{$filterName}");
//                        $qb->setParameter($filterName, $filterValue);
//                    }
            }
        }

        return $qb;
    }
}
