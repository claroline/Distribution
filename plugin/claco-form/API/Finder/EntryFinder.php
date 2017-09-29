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
use Claroline\CoreBundle\Entity\User;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @DI\Service("claroline.api.finder.clacoform.entry")
 * @DI\Tag("claroline.finder")
 */
class EntryFinder implements FinderInterface
{
    /** @var AuthorizationCheckerInterface */
    private $authChecker;

    /** @var TokenStorageInterface */
    private $tokenStorage;

    /**
     * EntryFinder constructor.
     *
     * @DI\InjectParams({
     *     "authChecker"  = @DI\Inject("security.authorization_checker"),
     *     "tokenStorage" = @DI\Inject("security.token_storage")
     * })
     *
     * @param AuthorizationCheckerInterface $authChecker
     * @param TokenStorageInterface         $tokenStorage
     */
    public function __construct(
        AuthorizationCheckerInterface $authChecker,
        TokenStorageInterface $tokenStorage
    ) {
        $this->authChecker = $authChecker;
        $this->tokenStorage = $tokenStorage;
    }

    public function getClass()
    {
        return 'Claroline\ClacoFormBundle\Entity\Entry';
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [])
    {

//        if (php_sapi_name() !== 'cli' && !$this->authChecker->isGranted('ROLE_ADMIN')) {
//            /** @var User $currentUser */
//            $currentUser = $this->tokenStorage->getToken()->getUser();
//            $qb->leftJoin('obj.organizations', 'uo');
//            $qb->leftJoin('uo.administrators', 'ua');
//            $qb->andWhere('ua.id = :userId');
//            $qb->setParameter('userId', $currentUser->getId());
//        }
//
//        foreach ($searches as $filterName => $filterValue) {
//            switch ($filterName) {
//                case 'createdAfter':
//                    $qb->andWhere("obj.created >= :{$filterName}");
//                    $qb->setParameter($filterName, $filterValue);
//                    break;
//                case 'createdBefore':
//                    $qb->andWhere("obj.created <= :{$filterName}");
//                    $qb->setParameter($filterName, $filterValue);
//                    break;
//                default:
//                    if (is_string($filterValue)) {
//                        $qb->andWhere("UPPER(obj.{$filterName}) LIKE :{$filterName}");
//                        $qb->setParameter($filterName, '%'.strtoupper($filterValue).'%');
//                    } else {
//                        $qb->andWhere("obj.{$filterName} = :{$filterName}");
//                        $qb->setParameter($filterName, $filterValue);
//                    }
//            }
//        }

        return $qb;
    }
}
