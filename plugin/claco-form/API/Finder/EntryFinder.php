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
use Claroline\CoreBundle\Entity\Facet\FieldFacet;
use Claroline\CoreBundle\Manager\Organization\LocationManager;
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

    /** @var LocationManager */
    private $locationManager;

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
        $this->locationManager = $this->container->get('claroline.manager.organization.location_manager');
    }

    public function getClass()
    {
        return 'Claroline\ClacoFormBundle\Entity\Entry';
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [], array $extraData = [])
    {
        $clacoFormManager = $this->container->get('claroline.manager.claco_form_manager');
        $tokenStorage = $this->container->get('security.token_storage');
        $translator = $this->container->get('translator');
        $currentUser = $tokenStorage->getToken()->getUser();

        $isAnon = $currentUser === 'anon.';
        $clacoForm = $clacoFormManager->getClacoFormById($extraData['clacoForm']);
        $canEdit = $clacoFormManager->hasRight($clacoForm, 'EDIT');
        $isCategoryManager = !$isAnon && $clacoFormManager->isCategoryManager($clacoForm, $currentUser);
        $searchEnabled = $clacoForm->getSearchEnabled();

        $qb->join('obj.clacoForm', 'cf');
        $qb->andWhere('cf.id = :clacoFormId');
        $qb->setParameter('clacoFormId', $extraData['clacoForm']);

        $qb->join('obj.fieldValues', 'fv');
        $qb->join('fv.field', 'fvf');
        $qb->join('fv.fieldFacetValue', 'fvffv');

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
                $type = $isCategoryManager ? 'manager' : 'my';
            }
        }
        if (is_null($type)) {
            throw new AccessDeniedException();
        }
        $userJoined = false;
        $categoriesJoined = false;

        switch ($type) {
            case 'all':
                if (!$canEdit) {
                    if ($isAnon) {
                        $qb->andWhere('obj.status = 1');
                    } elseif ($isCategoryManager) {
                        $qb->leftJoin('obj.user', 'u');
                        $qb->leftJoin('obj.categories', 'c');
                        $qb->leftJoin('c.managers', 'cm');
                        $searchEnabled ?
                            $qb->andWhere('obj.status = 1 OR u.id = :userId OR cm.id = :userId') :
                            $qb->andWhere('u.id = :userId OR cm.id = :userId');
                        $qb->setParameter('userId', $currentUser->getId());
                        $userJoined = true;
                        $categoriesJoined = true;
                    } else {
                        $qb->leftJoin('obj.user', 'u');
                        $searchEnabled ?
                            $qb->andWhere('obj.status = 1 OR u.id = :userId') :
                            $qb->andWhere('u.id = :userId');
                        $qb->setParameter('userId', $currentUser->getId());
                        $userJoined = true;
                    }
                }
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
                    $field = $clacoFormManager->getFieldByClacoFormAndId($clacoForm, $filterName);
                    $this->filterField($qb, $filterName, $filterValue, $field);
            }
        }

        return $qb;
    }

    private function filterField(&$qb, $filterName, $filterValue, $field)
    {
        if ($field) {
            $qb->andWhere("fvf.id = :field{$filterName}");
            $qb->setParameter("field{$filterName}", $filterName);

            switch ($field->getFieldFacet()->getType()) {
                case FieldFacet::FLOAT_TYPE:
                    $qb->andWhere("fvffv.floatValue = :value{$filterName}");
                    $qb->setParameter("value{$filterName}", $filterValue);
                    break;
                case FieldFacet::DATE_TYPE:
                    break;
                case FieldFacet::COUNTRY_TYPE:
                    $countries = $this->locationManager->getCountries();
                    $pattern = "/$filterValue/i";
                    $keys = [];

                    foreach ($countries as $key => $country) {

                        if (preg_match($pattern, $country)) {
                            $keys[] = $key;
                        }
                    }
                    $qb->andWhere("fvffv.stringValue IN (:value{$filterName})");
                    $qb->setParameter("value{$filterName}", $keys);
                    break;
                case FieldFacet::CHECKBOXES_TYPE:
                case FieldFacet::CASCADE_SELECT_TYPE:
                    $qb->andWhere("UPPER(fvffv.arrayValue) LIKE :value{$filterName}");
                    $qb->setParameter("value{$filterName}", '%'.strtoupper($filterValue).'%');
                    break;
                default:
                    $qb->andWhere("UPPER(fvffv.stringValue) LIKE :value{$filterName}");
                    $qb->setParameter("value{$filterName}", '%'.strtoupper($filterValue).'%');
            }
        }
    }
}
