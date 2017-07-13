<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace UJM\ExoBundle\Entity\Item\Item;

use Claroline\CoreBundle\API\FinderInterface;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @DI\Service("claroline.API.finder.item")
 * @DI\Tag("claroline.finder")
 */
class Item implements FinderInterface
{
    /**
     * @DI\InjectParams({
     *     "authChecker"      = @DI\Inject("security.authorization_checker"),
     *     "tokenStorage"     = @DI\Inject("security.token_storage")
     * })
     */
    public function __construct(AuthorizationCheckerInterface $authChecker, TokenStorageInterface $tokenStorage)
    {
        $this->authChecker = $authChecker;
        $this->tokenStorage = $tokenStorage;
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [])
    {
        if (!$this->authChecker->isGranted('ROLE_ADMIN')) {
            /** @var User $currentUser */
            $currentUser = $this->tokenStorage->getToken()->getUser();

            $qb = $this->createQueryBuilder('q');

            if (empty($filters) || empty($filters->self_only)) {
                // Includes shared questions
                if (!empty($filters) && !empty($filters->creators)) {
                    // Search by creators
                } else {
                    // Get all questions of the current user
                    $qb->leftJoin('UJM\ExoBundle\Entity\Item\Shared', 's', Join::WITH, 'q = s.question');
                    $qb->where('(q.creator = :user OR s.user = :user)');
                    $qb->setParameter('user', $currentUser);
                }
            } else {
                // Only Get questions created by the User
                $qb->where('q.creator = :user');
                $qb->setParameter('user', $currentUser);
            }

            // Type
            if (!empty($filters) && !empty($filters->types)) {
                $qb
                    ->andWhere('q.mimeType IN (:types)')
                    ->setParameter('types', $filters->types);
            }

            // in any case exclude every mimeType that does not begin with [application] from results
            $qb
                ->andWhere('q.mimeType LIKE :includedTypesPrefix')
                ->setParameter('includedTypesPrefix', 'application%');

            // Title / Content
            if (!empty($filters) && !empty($filters->title)) {
                $qb
                    ->andWhere('(q.content LIKE :text OR q.title LIKE :text)')
                    ->setParameter('text', '%'.addcslashes($filters->title, '%_').'%');
            }

            // Categories
            if (!empty($filters) && !empty($filters->categories)) {
                $qb->andWhere('q.category IN (:categories)');
                $qb->setParameter('categories', $filters->categories);
            }

            // Exercises
            if (!empty($filters) && !empty($filters->exercises)) {
                $qb
                    ->join('q.stepQuestions', 'sq')
                    ->join('sq.step', 's')
                    ->join('s.exercise', 'e')
                    ->andWhere('e.uuid IN (:exercises)');

                $qb->setParameter('exercises', $filters->exercises);
            }

            // Model
            if (!empty($filters) && !empty($filters->model_only)) {
                $qb->andWhere('q.model = true');
            }
        }

        return $qb;
    }

    public function getClass()
    {
        return 'UJM\ExoBundle\Entity\Item\Item';
    }
}
