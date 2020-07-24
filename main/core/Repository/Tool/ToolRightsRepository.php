<?php
/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Repository\Tool;

use Claroline\CoreBundle\Entity\Tool\Tool;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Doctrine\ORM\EntityRepository;

class ToolRightsRepository extends EntityRepository
{
    /**
     * Returns the maximum rights on a given resource for a set of roles.
     * Used by the ResourceVoter.
     *
     * @param string[]  $roles
     * @param Tool      $tool
     * @param Workspace $workspace
     *
     * @return int
     */
    public function findMaximumRights(array $roles, Tool $tool, Workspace $workspace = null)
    {
        //add the role anonymous for everyone !
        if (!in_array('ROLE_ANONYMOUS', $roles)) {
            $roles[] = 'ROLE_ANONYMOUS';
        }

        $results = $this->_em
            ->createQuery('
                SELECT tr.mask
                FROM Claroline\CoreBundle\Entity\Tool\ToolRights AS tr
                JOIN tr.role AS role
                JOIN tr.orderedTool AS ot
                JOIN ot.tool AS t
                WHERE t.id = :toolId
                  AND ot.workspace = :workspace
                  AND role.name IN (:roles)
            ')
            ->setParameter('workspace', $workspace)
            ->setParameter('toolId', $tool->getId())
            ->setParameter('roles', $roles)
            ->getResult();

        $mask = 0;
        foreach ($results as $result) {
            $mask |= $result['mask'];
        }

        return $mask;
    }
}
