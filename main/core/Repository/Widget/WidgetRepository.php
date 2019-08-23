<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Repository\Widget;

use Claroline\CoreBundle\Entity\Widget\Widget;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

class WidgetRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Widget::class);
    }

    /**
     * Finds all available widgets in the platform.
     * It only grabs widgets from enabled plugins.
     *
     * @param array  $enabledPlugins
     * @param string $context
     *
     * @return array
     */
    public function findAllAvailable(array $enabledPlugins, $context = null)
    {
        $query = $this->createQueryBuilder('w')
            ->leftJoin('w.plugin', 'p')
            ->where('CONCAT(p.vendorName, p.bundleName) IN (:plugins)')
            ->setParameter('plugins', $enabledPlugins);

        if ($context) {
            $query
                ->andWhere('w.context LIKE :context')
                ->setParameter('context', '%'.$context.'%');
        }

        return $query
            ->getQuery()
            ->getResult();
    }
}
