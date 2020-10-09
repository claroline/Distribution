<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\InstallationBundle\Repository;

use Claroline\CoreBundle\Entity\Update\UpdaterExecution;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class UpdaterExecutionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UpdaterExecution::class);
    }

    public function hasBeenExecuted(string $updaterClass): bool
    {
        return 0 < $this->count(['updaterClass' => $updaterClass]);
    }

    public function markAsExecuted(string $updaterClass): void
    {
        $em = $this->getEntityManager();

        $em->persist(new UpdaterExecution($updaterClass));
        $em->flush();
    }
}
