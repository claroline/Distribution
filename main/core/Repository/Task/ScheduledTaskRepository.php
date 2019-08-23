<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Repository\Task;

use Claroline\CoreBundle\Entity\Task\ScheduledTask;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

class ScheduledTaskRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, ScheduledTask::class);
    }

    public function findTasksToExecute()
    {
        $dql = '
            SELECT t
            FROM Claroline\CoreBundle\Entity\Task\ScheduledTask t
            WHERE t.executionDate IS NULL
            AND t.scheduledDate < :now
        ';
        $query = $this->_em->createQuery($dql);
        $query->setParameter('now', new \DateTime());

        return $query->getResult();
    }
}
