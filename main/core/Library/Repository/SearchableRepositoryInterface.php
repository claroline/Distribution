<?php

namespace Claroline\CoreBundle\Library\Repository;

use Claroline\CoreBundle\Entity\User;

interface SearchableRepositoryInterface
{
    /**
     * Counts the total results of a search (without pagination settings).
     *
     * @param User  $currentUser
     * @param array $searchFilters
     *
     * @return mixed
     */
    public function count(User $currentUser, array $searchFilters = []);

    /**
     * Searches entities based on current User and search filters.
     * NB: query is automatically paginated.
     *
     * @param User  $currentUser
     * @param array $filters
     * @param array $orderBy
     *
     * @return mixed
     */
    public function search(User $currentUser, array $filters = [], array $orderBy = []);
}
