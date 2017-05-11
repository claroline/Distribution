<?php

namespace Claroline\CoreBundle\Library\Api\Search;

use Claroline\CoreBundle\Library\Repository\SearchableRepositoryInterface;
use Doctrine\Common\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @DI\Service("claroline.factory.api_search")
 */
class SearchFactory
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    /**
     * SearchFactory constructor.
     *
     * @DI\InjectParams({
     *      "om"           = @DI\Inject("claroline.persistence.object_manager"),
     *      "tokenStorage" = @DI\Inject("security.token_storage")
     * })
     *
     * @param ObjectManager         $om
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(
        ObjectManager $om,
        TokenStorageInterface $tokenStorage
    ) {
        $this->om = $om;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * Creates a new search.
     *
     * @param string $entityClass - the root entity for the search
     * @param array  $filters
     *
     * @return ApiSearch
     */
    public function create($entityClass, array $filters = [])
    {
        $repository = $this->om->getRepository($entityClass);
        if (!($repository instanceof SearchableRepositoryInterface)) {
            throw new \LogicException(
                "Repository for {$entityClass} should implement `SearchableRepositoryInterface` to use Searcher."
            );
        }

        return new ApiSearch(
            $repository,
            $this->tokenStorage->getToken()->getUser(),
            $filters
        );
    }
}
