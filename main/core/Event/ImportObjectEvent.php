<?php

namespace Claroline\CoreBundle\Event;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Symfony\Component\EventDispatcher\Event;

class ImportObjectEvent extends Event
{
    /**
     * TODO: write doc.
     */
    public function __construct(
    ) {
    }

    /**
     * Gets the resource node being serialized.
     *
     * @return ResourceNode
     */
    public function getObject()
    {
        return $this->object;
    }

    public function setData($data)
    {
        $this->data = $data;
    }

    public function getData()
    {
        return $this->data;
    }

    public function addFile($path, $file)
    {
        $this->fileBag->add($path, $file);
    }

    public function getFileBag()
    {
        return $this->fileBag;
    }
}
