<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Event\Resource;

use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Event dispatched by the resource controller when a resource copy is asked.
 */
class CopyResourceEvent extends Event
{
    /** @var AbstractResource */
    private $resource;

    /** @var ResourceNode */
    private $copiedNode;

    /** @var AbstractResource */
    private $copy;

    /** @var bool */
    private $isPopulated = false;

    /**
     * If true the copy will be published.
     *
     * @var bool
     */
    private $publish = false;

    /**
     * CopyResourceEvent constructor.
     *
     * @param \Claroline\CoreBundle\Entity\Resource\ResourceNode $copiedNode
     */
    public function __construct(AbstractResource $resource, AbstractResource $copy)
    {
        $this->resource = $resource;
        $this->copy = $copy;

        // By default, use the same published state as the copied node
        if ($this->resource->getResourceNode()) {
            $this->publish = $this->resource->getResourceNode()->isPublished();
        }
    }

    /**
     * Returns the new parent of the resource.
     *
     * @return \Claroline\CoreBundle\Entity\Resource\ResourceNode
     *
     * @deprecated this can be retieve directly from the `copiedNode`
     */
    public function getParent()
    {
        return $this->copy->getResourceNode()->getParent();
    }

    public function getCopy()
    {
        return $this->copy;
    }

    /**
     * Returns the resource to be copied.
     *
     * @return \Claroline\CoreBundle\Entity\Resource\AbstractResource
     */
    public function getResource()
    {
        return $this->resource;
    }

    /**
     * Sets the copy of the original resource.
     */
    public function setCopy(AbstractResource $copy)
    {
        $this->isPopulated = true;
        $this->copy = $copy;
    }

    public function isPopulated()
    {
        return $this->isPopulated;
    }

    /**
     * Is the copied resource need to be published or not ?
     *
     * @return bool
     */
    public function getPublish()
    {
        return $this->publish;
    }

    public function setPublish($publish)
    {
        $this->publish = $publish;
    }
}
