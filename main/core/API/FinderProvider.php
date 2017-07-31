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
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder")
 */
class FinderProvider
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var SerializerProvider
     */
    private $serializer;

    /**
     * The list of registered finders in the platform.
     *
     * @var array
     */
    private $finders = [];

    /**
     * FinderProvider constructor.
     *
     * @DI\InjectParams({
     *     "om"         = @DI\Inject("claroline.persistence.object_manager"),
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param ObjectManager      $om
     * @param SerializerProvider $serializer
     */
    public function __construct(
        ObjectManager $om,
        SerializerProvider $serializer)
    {
        $this->om = $om;
        $this->serializer = $serializer;
    }

    /**
     * Registers a new finder.
     *
     * @param FinderInterface $finder
     */
    public function add(FinderInterface $finder)
    {
        $this->finders[$finder->getClass()] = $finder;
    }

    /**
     * Gets a registered finder instance.
     *
     * @param string $class
     *
     * @return FinderInterface
     *
     * @throws \Exception
     */
    public function get($class)
    {
        if (empty($this->finders[$class])) {
            throw new \Exception(
                sprintf('No finder found for class "%s" Maybe you forgot to add the "claroline.finder" tag to your finder.', $class)
            );
        }

        return $this->finders[$class];
    }

    public function search($class, $page, $limit, array $searches = [])
    {
        $data  = $this->fetch($class, $page, $limit, $searches);
        $count = $this->fetch($class, $page, $limit, $searches, true);

        $filters = isset($searches['filters']) ? $searches['filters'] : [];
        $filterObjects = [];
        foreach ($filters as $property => $value) {
            $filterObjects[] = ['value' => $value, 'property' => $property];
        }

        return [
            'class' => $class,
            'total' => $count,
            'results' => array_map(function ($el) {
                return $this->serializer->serialize($el);
            }, $data),
            'page' => $page,
            'limit' => $limit,
            'filters' => $filterObjects,
            'sortBy' => isset($searches['sortBy']) ? $searches['sortBy'] : null,
        ];
    }

    private function fetch($class, $page = null, $limit = null, $searches = [], $count = false)
    {
        /** @var QueryBuilder $qb */
        $qb = $this->om->createQueryBuilder();

        $count ? $qb->select('count(obj)') : $qb->select('obj');
        $qb->from($class, 'obj');
        $filters = isset($searches['filters']) ? $searches['filters'] : [];
        $qb = $this->get($class)->configureQueryBuilder($qb, $filters);

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
