<?php

namespace Claroline\CoreBundle\Library\Api\Search;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Repository\SearchableRepositoryInterface;

class ApiSearch
{
    /**
     * The repository to search in.
     *
     * @var SearchableRepositoryInterface
     */
    private $repository;

    /**
     * The user which has requested the data (usually the current authenticated user).
     *
     * @var User
     */
    private $user;

    /**
     * The list of filters to apply to the search.
     *
     * @var array
     */
    private $filters = [];

    /**
     * The sorting of the data.
     *
     * @var array
     */
    private $orderBy = [];

    /**
     * A callback to apply to each result.
     *
     * @var callable
     */
    private $postLoadCallback;

    /**
     * Searcher constructor.
     *
     * @param SearchableRepositoryInterface $repository
     * @param User                          $user
     * @param array                         $filters
     */
    public function __construct(
        SearchableRepositoryInterface $repository,
        User $user,
        array $filters = []
    ) {
        $this->repository = $repository;
        $this->user = $user;
        $this->filters = $filters;
    }

    /**
     * Sets an order for the search results.
     *
     * @param array $orderBy
     *
     * @return $this
     */
    public function orderBy(array $orderBy)
    {
        $this->orderBy = $orderBy;

        return $this;
    }

    /**
     * Applies a callback to each result.
     * Useful to format data before returning it in the JSON api for example.
     *
     * @param callable $callback
     *
     * @return $this
     */
    public function postLoad($callback)
    {
        $this->postLoadCallback = $callback;

        return $this;
    }

    /**
     * Gets the results of the search.
     * NB : the DB query will be down know.
     *
     * @param $page
     * @param $number
     *
     * @return array
     */
    public function getResults($page, $number)
    {
        $results = $this->repository->search($this->user, $this->filters, $this->orderBy);
        if (-1 === $number) {
            // we have the whole data set, we just need to count it
            $totalResults = count($results);
        } else {
            // we have a subset of data, we need an extra query to know the total of entries
            $totalResults = $this->repository->count($this->user, $this->filters);
        }

        if (!empty($this->postLoadCallback)) {
            // Apply the defined callback to all results
            $results = array_map(function ($result) {
                return call_user_func($this->postLoadCallback, [$result]);
            }, $results);
        }

        return [
            'results' => $results,
            'totalResults' => $totalResults,
            'pagination' => [
                'current' => $page,
                'pageSize' => $number,
            ],
            'orderBy' => $this->orderBy,
        ];
    }
}
