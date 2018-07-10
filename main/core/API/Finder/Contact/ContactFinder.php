<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\API\Finder\Contact;

use Claroline\AppBundle\API\Finder\AbstractFinder;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @DI\Service("claroline.api.finder.contact")
 * @DI\Tag("claroline.finder")
 */
class ContactFinder extends AbstractFinder
{
    /** @var AuthorizationCheckerInterface */
    private $authorization;

    /** @var TokenStorageInterface */
    private $tokenStorage;

    /**
     * ContactFinder constructor.
     *
     * @DI\InjectParams({
     *     "authorization" = @DI\Inject("security.authorization_checker"),
     *     "tokenStorage"  = @DI\Inject("security.token_storage")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param TokenStorageInterface         $tokenStorage
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        TokenStorageInterface $tokenStorage
    ) {
        $this->authorization = $authorization;
        $this->tokenStorage = $tokenStorage;
    }

    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Contact\Contact';
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [], array $sortBy = null)
    {
        $qb->join('obj.user', 'u');
        $qb->join('obj.contact', 'c');
        $qb->andWhere('u.id = :userId');
        $qb->setParameter('userId', $searches['user']);

        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
                case 'user':
                    break;
                case 'username':
                case 'firstName':
                case 'lastName':
                case 'phone':
                case 'email':
                    $qb->andWhere("UPPER(c.{$filterName}) LIKE :{$filterName}");
                    $qb->setParameter($filterName, '%'.strtoupper($filterValue).'%');
                    break;
                case 'group':
                    $qb->join('c.groups', 'g');
                    $qb->andWhere('UPPER(g.name) LIKE :group');
                    $qb->setParameter('group', '%'.strtoupper($filterValue).'%');
                    break;
            }
        }
        if (!is_null($sortBy) && isset($sortBy['property']) && isset($sortBy['direction'])) {
            $sortByProperty = $sortBy['property'];
            $sortByDirection = 1 === $sortBy['direction'] ? 'ASC' : 'DESC';

            switch ($sortByProperty) {
                case 'username':
                case 'firstName':
                case 'lastName':
                case 'phone':
                case 'email':
                    $qb->orderBy("c.{$sortByProperty}", $sortByDirection);
                    break;
            }
        }

        return $qb;
    }
}
