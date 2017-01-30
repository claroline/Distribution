<?php

/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 1/16/17
 */

namespace Claroline\CoreBundle\Repository\Icon;

use Claroline\CoreBundle\Entity\Icon\IconSet;
use Claroline\CoreBundle\Entity\Icon\IconSetTypeEnum;
use Claroline\CoreBundle\Entity\Resource\ResourceIcon;
use Doctrine\ORM\EntityRepository;

class IconItemRepository extends EntityRepository
{
    public function findIconsForDefaultResourceIconSet($excludeMimeTypes = null, $includeMimeTypes = null)
    {
        $qb = $this->createQueryBuilder('icon')
            ->select('icon')
            ->join('icon.iconSet', 'st')
            ->andWhere('st.default = :isDefault')
            ->andWhere('st.cname = :defaultCName')
            ->andWhere('st.type = :resourceType')
            ->setParameter('isDefault', true)
            ->setParameter('defaultCName', 'claroline')
            ->setParameter('resourceType', IconSetTypeEnum::RESOURCE_ICON_SET);

        if (!empty($excludeMimeTypes)) {
            $qb->andWhere($qb->expr()->notIn('icon.mimeType', $excludeMimeTypes));
        } elseif (!empty($includeMimeTypes)) {
            $qb->andWhere($qb->expr()->in('icon.mimeType', $excludeMimeTypes));
        }

        return $qb->getQuery()->getResult();
    }

    public function deleteAllByMimeType($mimeType)
    {
        $qb = $this->createQueryBuilder('icon')
            ->delete()
            ->where('icon.mimeType = :mimeType')
            ->setParameter('mimeType', $mimeType);

        return $qb->getQuery()->getResult();
    }

    public function updateResourceIconsByIconSetIcons(IconSet $iconSet)
    {
        return $this->getEntityManager()->getConnection()->executeUpdate(
            'UPDATE claro_resource_icon ri, claro_icon_item ii
              SET ri.relative_url = ii.relative_url
              WHERE ri.id = ii.resource_icon_id
              AND ii.icon_set_id = :id',
            ['id' => $iconSet->getId()]
        );
    }

    public function updateResourceIconForAllSets(ResourceIcon $icon)
    {
        $qb = $this->createQueryBuilder('icon')
            ->update()
            ->set('icon.resourceIcon', ':icon')
            ->where('icon.mimeType = :mimeType')
            ->andWhere('icon.isShortcut = :isShortcut')
            ->setParameter('icon', $icon)
            ->setParameter('mimeType', $icon->getMimeType())
            ->setParameter('isShortcut', $icon->isShortcut());

        return $qb->getQuery()->getResult();
    }
}
