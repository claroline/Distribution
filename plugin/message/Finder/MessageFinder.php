<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MessageBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractFinder;
use Claroline\MessageController\Entity\Message;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @DI\Service("claroline.api.finder.message")
 * @DI\Tag("claroline.finder")
 */
class MessageFinder extends AbstractFinder
{
    /**
     * ParametersSerializer constructor.
     *
     * @DI\InjectParams({
     *     "tokenStorage" = @DI\Inject("security.token_storage")
     * })
     *
     * @param SerializerProvider        $serializer
     * @param AbstractMessageSerializer $messageSerializer
     */
    public function __construct(TokenStorageInterface $tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;
    }

    public function getClass()
    {
        return Message::class;
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [], array $sortBy = null)
    {
        //need the join to usermessages first
        $qb->join('obj.userMessages', 'um');

        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
                  case 'currentUser':
                      $qb->leftJoin('um.users', 'currentUser');
                      $qb->andWhere('currentUser.id = :currentUserId');
                      $qb->setParameter('currentUserId', $this->token->getUser()->getId());
                      break;
                  case 'users':
                      $qb->leftJoin('um.users', 'user');
                      $qb->andWhere('user.uuid IN (:userIds)');
                      $qb->setParameter('userIds', is_array($filterValue) ? $filterValue : [$filterValue]);
                      break;
                  case 'sent':
                      $qb->andWhere("obj.isSent = :{$filterName}");
                      $qb->setParameter($filterName, $filterValue);
                      break;
                  case 'removed':
                      $qb->andWhere("obj.isRemoved = :{$filterName}");
                      $qb->setParameter($filterName, $filterValue);
                      break;
                  case 'read':
                      $qb->andWhere("obj.isRead = :{$filterName}");
                      $qb->setParameter($filterName, $filterValue);
                      break;
                  case 'after':
                      $qb->andWhere("obj.date >= :{$filterName}");
                      $qb->setParameter($filterName, $filterValue);
                      break;
                  case 'before':
                      $qb->andWhere("obj.date <= :{$filterName}");
                      $qb->setParameter($filterName, $filterValue);
                      break;
                  case 'from':
                      $qb->andWhere("UPPER(obj.senderUserName) LIKE :{$filterName}");
                      $qb->setParameter($filterName, '%'.strtoupper($filterValue).'%');
                      break;
                  default:
                    $this->setDefaults($qb, $filterName, $filterValue);
                }
        }

        return $qb;
    }
}
