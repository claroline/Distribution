<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AppBundle\API\Finder;

use Doctrine\ORM\QueryBuilder;

interface FinderInterface
{
    /**
     * The queried object is already named "obj".
     *
     * @param QueryBuilder $qb
     * @param array        $searches
     * @param array|null   $sortBy
     */
    public function configureQueryBuilder(QueryBuilder $qb, array $searches, array $sortBy = null);

    /** @return string */
    public function getClass();

    /**
     * Allow us to make optimize sql directly by mapping serialized property path to their own database colum.
     *
     * @return array
     */
    public function getExtraFieldMapping();
}
