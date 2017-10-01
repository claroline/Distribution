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
use Symfony\Component\Validator\Constraints\DateTime;

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
                case $translator->trans('all_entries', [], 'clacoform') :
                    $type = 'all';
                    break;
                case $translator->trans('my_entries', [], 'clacoform') :
                    $type = 'my';
                    break;
                case $translator->trans('manager_entries', [], 'clacoform') :
                    $type = "manager";
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
        switch ($type) {
            case 'all':
                break;
            case 'manager':
                $qb->join('obj.categories', 'c');
                $qb->join('c.managers', 'cm');
                $qb->andWhere('cm.id = :managerId');
                $qb->setParameter('managerId', $currentUser->getId());
                break;
            case 'my':
                $qb->join('obj.user', 'u');
                $qb->leftJoin('obj.entryUsers', 'eu');
                $qb->leftJoin('eu.user', 'euu');
                $qb->andWhere('u.id = :userId');
                $qb->orWhere('(euu.id = :userId and eu.shared = true)');
                $qb->setParameter('userId', $currentUser->getId());
                break;
        }
        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
                case 'createdAfter':
                    $qb->andWhere("obj.creationDate >= :{$filterName}");
                    $qb->setParameter($filterName, new \DateTime('@'.$filterValue));
                    break;
                case 'createdBefore':
                    $qb->andWhere("obj.creationDate <= :{$filterName}");
                    $qb->setParameter($filterName, new \DateTime('@'.$filterValue));
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
