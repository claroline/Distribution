<?php

namespace Claroline\CoreBundle\Repository\Theme;

use Claroline\CoreBundle\Entity\Theme\Theme;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

class ThemeRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Theme::class);
    }

    /**
     * Returns the themes corresponding to an array of UUIDs.
     *
     * @param array $uuids
     *
     * @return Theme[]
     */
    public function findByUuids(array $uuids)
    {
        return $this->createQueryBuilder('t')
            ->where('t.uuid IN (:uuids)')
            ->setParameter('uuids', $uuids)
            ->getQuery()
            ->getResult();
    }
}
