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
use Symfony\Component\EventDispatcher\Event;

class ExportResourceEvent extends Event
{
    /**
     * ExportResourceEvent constructor.
     *
     * @param AbstractResource $resource
     */
    public function __construct(AbstractResource $resource, $data)
    {
        $this->resource = $resource;
        $this->data = $data;
        $this->files = [];
    }

    public function setFiles(array $files)
    {
        $this->files = $files;
    }

    public function getFiles()
    {
        return $this->files;
    }

    public function getData()
    {
        return $this->data;
    }

    public function setData()
    {
        $this->data = $data;
    }
}
