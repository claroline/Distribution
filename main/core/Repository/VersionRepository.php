<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Repository;

use Doctrine\ORM\EntityRepository;

class VersionRepository extends EntityRepository
{
    public function getLatest()
    {
        return $this->createQueryBuilder('e')->
            orderBy('e.date', 'DESC')->
            setMaxResults(1)->
            getQuery()->
            getOneOrNullResult();
    }

    public function getLatestExecuted()
    {
        return $this->createQueryBuilder('e')
            ->orderBy('e.date', 'DESC')
            ->where('e.isUpgraded', false)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
