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

class ContentRepository extends EntityRepository
{
    public function updateContentByType($content, $type)
    {
        $dql = '
            UPDATE Claroline\CoreBundle\Entity\Content c
            SET c.content = :content
            WHERE c.type = :type
        ';
        $query = $this->_em->createQuery($dql);
        $query->setParameter('content', $content);
        $query->setParameter('type', $type);
        $query->execute();
    }
}
