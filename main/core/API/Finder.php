<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\API;

use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * @DI\Service("claroline.API.finder")
 */
class Finder
{
    private $finders;
    private $container;
    private $serializer;

    /**
     * @DI\InjectParams({
     *     "container"      = @DI\Inject("service_container"),
     *     "om"     = @DI\Inject("claroline.persistence.object_manager"),
     *     "serializer" = @DI\Inject("claroline.API.serializer")
     * })
     */
    public function __construct(ContainerInterface $container, ObjectManager $om, Serializer $serializer)
    {
        $this->container = $container;
        $this->om = $om;
        $this->serializer = $serializer;
    }

    public function addFinder($finder)
    {
        $this->finders[] = $finder;
    }

    public function getFinder($class)
    {
        foreach ($this->finders as $finder) {
            if ($finder->getClass() === $class) {
                return $finder;
            }
        }
    }

    public function search($class, $page, $limit, array $searches = null)
    {
        $serializer = $this->serializer;

        if (!$searches) {
            $searches = $this->container->get('request')->query->all();
        }

        $filters = isset($searches['filters']) ? $searches['filters'] : [];

        $data = $this->fetch($class, $page, $limit, $searches);
        //maybe do only 1 request later
        $count = $this->fetch($class, $page, $limit, $searches, true);

        $data = array_map(function ($el) use ($serializer) {
            return $serializer->serialize($el);
        }, $data);

        return [
          'data' => $data,
          'total' => $count,
          'page' => $page,
          'limit' => $limit,
          'class' => $class,
          'searches' => $filters,
        ];
    }

    private function fetch($class, $page = null, $limit = null, $searches = [], $count = false)
    {
        /** @var QueryBuilder $qb */
        $qb = $this->om->createQueryBuilder();

        $count ? $qb->select('count(obj)') : $qb->select('obj');
        $qb->from($class, 'obj');
        $filters = isset($searches['filters']) ? $searches['filters'] : [];
        $qb = $this->getFinder($class)->configureQueryBuilder($qb, $filters);

        if (!empty($searches['sortBy'])) {
            // reverse order starts by a -
            if ('-' === substr($searches['sortBy'], 0, 1)) {
                $qb->orderBy('obj.'.substr($searches['sortBy'], 1), 'ASC');
            } else {
                $qb->orderBy('obj.'.$searches['sortBy'], 'DESC');
            }
        }

        $query = $qb->getQuery();

        if ($page !== null && $limit !== null && !$count) {
            //react table all is -1
          if ($limit > -1) {
              $query->setMaxResults($limit);
          }
            $query->setFirstResult($page * $limit);
        }

        return $count ? (int) $query->getSingleScalarResult() : $query->getResult();
    }
}
