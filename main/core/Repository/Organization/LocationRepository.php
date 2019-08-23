<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Repository\Organization;

use Claroline\CoreBundle\Entity\Organization\Location;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

class LocationRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Location::class);
    }

    public function findLocationsByTypes($types)
    {
        $dql = '
            SELECT l
            FROM Claroline\CoreBundle\Entity\Organization\Location l
            WHERE l.type IN (:types)
            ORDER BY l.name ASC
        ';
        $query = $this->_em->createQuery($dql);
        $query->setParameter('types', $types);

        return $query->getResult();
    }
}
