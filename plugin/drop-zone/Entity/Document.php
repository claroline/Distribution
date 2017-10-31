<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\DropZoneBundle\Entity;

use Claroline\CoreBundle\Entity\Model\UuidTrait;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="claro_dropzonebundle_document")
 */
class Document
{
    use UuidTrait;

    const DOCUMENT_TYPE_FILE = 0;
    const DOCUMENT_TYPE_TEXT = 1;
    const DOCUMENT_TYPE_URL = 2;
    const DOCUMENT_TYPE_RESOURCE = 3;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(
     *      targetEntity="Claroline\DropZoneBundle\Entity\Drop",
     *      inversedBy="documents"
     * )
     * @ORM\JoinColumn(name="drop_id", nullable=false, onDelete="CASCADE")
     */
    protected $drop;

    /**
     * @ORM\Column(name="document_type", type="string", nullable=false)
     */
    protected $type;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $url;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    protected $content;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\Resource\ResourceNode")
     * @ORM\JoinColumn(name="resource_id", nullable=true, onDelete="SET NULL")
     */
    protected $resource;

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getDrop()
    {
        return $this->drop;
    }

    public function setDrop(Drop $drop)
    {
        $this->drop = $drop;
    }

    public function getType()
    {
        return $this->type;
    }

    public function setType($type)
    {
        $this->type = $type;
    }

    public function getUrl()
    {
        return $this->url;
    }

    public function setUrl($url)
    {
        $this->url = $url;
    }

    public function getContent()
    {
        return $this->content;
    }

    public function setContent($content)
    {
        $this->content = $content;
    }

    public function getResource()
    {
        return $this->resource;
    }

    public function setResource(ResourceNode $resource = null)
    {
        $this->resource = $resource;
    }

    public function getData()
    {
        $data = null;

        switch ($this->type) {
            case self::DOCUMENT_TYPE_FILE:
            case self::DOCUMENT_TYPE_URL:
                $data = $this->getUrl();
                break;
            case self::DOCUMENT_TYPE_TEXT:
                $data = $this->getContent();
                break;
            case self::DOCUMENT_TYPE_RESOURCE:
                $data = $this->getResource();
                break;
        }

        return $data;
    }

    public function setData($data)
    {
        switch ($this->type) {
            case self::DOCUMENT_TYPE_FILE:
            case self::DOCUMENT_TYPE_URL:
                $this->setUrl($data);
                break;
            case self::DOCUMENT_TYPE_TEXT:
                $this->setContent($data);
                break;
            case self::DOCUMENT_TYPE_RESOURCE:
                $this->setResource($data);
                break;
        }
    }
}
