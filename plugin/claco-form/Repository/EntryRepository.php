<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ClacoFormBundle\Repository;

use Claroline\ClacoFormBundle\Entity\ClacoForm;
use Claroline\ClacoFormBundle\Entity\Entry;
use Claroline\CoreBundle\Entity\User;
use Doctrine\ORM\EntityRepository;

class EntryRepository extends EntityRepository
{
    public function findPublishedEntries(ClacoForm $clacoForm)
    {
        $dql = '
            SELECT e
            FROM Claroline\ClacoFormBundle\Entity\Entry e
            JOIN e.clacoForm c
            WHERE c = :clacoForm
            AND e.status = :status
        ';
        $query = $this->_em->createQuery($dql);
        $query->setParameter('clacoForm', $clacoForm);
        $query->setParameter('status', Entry::PUBLISHED);

        return $query->getResult();
    }

    public function findManageableEntries(ClacoForm $clacoForm, User $user)
    {
        $dql = '
            SELECT e
            FROM Claroline\ClacoFormBundle\Entity\Entry e
            JOIN e.clacoForm c
            LEFT JOIN e.categories cat
            LEFT JOIN cat.managers m
            WHERE c = :clacoForm
            AND (
                e.user = :user
                OR m = :user
            )
        ';
        $query = $this->_em->createQuery($dql);
        $query->setParameter('clacoForm', $clacoForm);
        $query->setParameter('user', $user);

        return $query->getResult();
    }

    public function findPublishedAndManageableEntries(ClacoForm $clacoForm, User $user)
    {
        $dql = '
            SELECT e
            FROM Claroline\ClacoFormBundle\Entity\Entry e
            JOIN e.clacoForm c
            LEFT JOIN e.categories cat
            LEFT JOIN cat.managers m
            WHERE c = :clacoForm
            AND (
                e.status = :status
                OR e.user = :user
                OR m = :user
            )
        ';
        $query = $this->_em->createQuery($dql);
        $query->setParameter('clacoForm', $clacoForm);
        $query->setParameter('status', Entry::PUBLISHED);
        $query->setParameter('user', $user);

        return $query->getResult();
    }
}
