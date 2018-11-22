<?php

namespace Claroline\CoreBundle\Event;

use Claroline\AppBundle\API\Utils\FileBag;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Symfony\Component\EventDispatcher\Event;

class ExportObjectEvent extends Event
{
    /**
     * TODO: write doc.
     */
    public function __construct(
        $object,
        FileBag $fileBag,
        array $data = []
    ) {
        $this->object = $object;
        $this->data = $data;
        $this->fileBag = $fileBag;
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

    public function addFile($path, $file)
    {
        $this->fileBag->add($file);
    }

    public function overwrite($key, $value)
    {
        var_dump('overwrite '.$key.' with '.$value);
    }
}
