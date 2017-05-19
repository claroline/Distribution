<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 5/17/17
 */

namespace Claroline\ExternalSynchronizationBundle\Repository;

use Doctrine\ORM\EntityRepository;

class ExternalUserRepository extends EntityRepository
{
    public function findByExternalIdsAndSourceSlug($externalIds, $sourceSlug)
    {
        if (empty($externalIds)) {
            return [];
        }

        $qb = $this
            ->createQueryBuilder('ext_user')
            ->where('ext_user.sourceSlug = :source')
            ->andWhere('ext_user.externalUserId IN (:ids)')
            ->setParameter('source', $sourceSlug)
            ->setParameter('ids', $externalIds);

        return $qb->getQuery()->getResult();
    }
}
