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

use Claroline\CoreBundle\Entity\Facet\GeneralFacetPreference;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

class GeneralFacetPreferenceRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, GeneralFacetPreference::class);
    }

    public function getAdminPublicProfilePreferenceByRole(array $roles)
    {
        if (in_array('ROLE_ADMIN', $roles)) {
            return [
                'baseData' => true,
                'email' => true,
                'phone' => true,
                'sendMail' => true,
                'sendMessage' => true,
            ];
        }

        $dql = "SELECT
            MAX(p.baseData) as baseData,
            MAX(p.email) as email,
            MAX(p.phone) as phone,
            MAX(p.email) as sendMail,
            MAX(p.sendMessage) as sendMessage
            FROM Claroline\CoreBundle\Entity\Facet\GeneralFacetPreference p
            JOIN p.role as role
            WHERE role.name in (:rolenames)
        ";

        $query = $this->_em->createQuery($dql);
        $query->setParameter('rolenames', $roles);

        return $query->getSingleResult();
    }
}
