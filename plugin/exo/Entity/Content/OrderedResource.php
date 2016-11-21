<?php

namespace UJM\ExoBundle\Entity\Content;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Doctrine\ORM\Mapping as ORM;

/**
 * Base class to create an ordered list of ResourceNodes in an entity.
 *
 * @ORM\MappedSuperclass()
 */
abstract class OrderedResource
{
    /**
     * Order of the Resource in the Question.
     *
     * @var int
     *
     * @ORM\Column(type="integer")
     */
    protected $order = 0;

    /**
     * Linked ResourceNode.
     *
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\Resource\ResourceNode")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    protected $resourceNode;

    /**
     * Gets id.
     *
     * @return int
     */
    abstract public function getId();

    /**
     * Sets order.
     *
     * @param int $order
     */
    public function setOrder($order)
    {
        $this->order = $order;
    }

    /**
     * Gets order.
     *
     * @return int
     */
    public function getOrder()
    {
        return $this->order;
    }

    /**
     * Sets resource node.
     *
     * @param ResourceNode $resourceNode
     */
    public function setResourceNode(ResourceNode $resourceNode)
    {
        $this->resourceNode = $resourceNode;
    }

    /**
     * Gets resource node.
     *
     * @return ResourceNode
     */
    public function getResourceNode()
    {
        return $this->resourceNode;
    }
}
