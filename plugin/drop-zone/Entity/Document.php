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
use Claroline\CoreBundle\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
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
     * @ORM\Column(name="document_type", type="integer", nullable=false)
     */
    protected $type;

    /**
     * @ORM\Column(name="file_array", type="json_array", nullable=true)
     */
    protected $file;

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

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\User")
     * @ORM\JoinColumn(name="user_id", nullable=true, onDelete="SET NULL")
     */
    protected $user;

    /**
     * @ORM\Column(name="drop_date", type="datetime", nullable=false)
     */
    protected $dropDate;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Claroline\DropZoneBundle\Entity\DropzoneToolDocument",
     *     mappedBy="document"
     * )
     */
    protected $toolDocuments;

    public function __construct()
    {
        $this->refreshUuid();
        $this->toolDocuments = new ArrayCollection();
    }

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

    public function getFile()
    {
        return $this->file;
    }

    public function setFile(array $file = null)
    {
        $this->file = $file;
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

    public function getUser()
    {
        return $this->user;
    }

    public function setUser(User $user)
    {
        $this->user = $user;
    }

    public function getDropDate()
    {
        return $this->dropDate;
    }

    public function setDropDate(\DateTime $dropDate)
    {
        $this->dropDate = $dropDate;
    }

    public function getData()
    {
        $data = null;

        switch ($this->type) {
            case self::DOCUMENT_TYPE_FILE:
                $data = $this->getFile();
                break;
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
                $this->setFile($data);
                break;
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

    public function getToolDocuments()
    {
        return $this->toolDocuments->toArray();
    }

    public function addToolDocument(DropzoneToolDocument $toolDocument)
    {
        if (!$this->toolDocuments->contains($toolDocument)) {
            $this->toolDocuments->add($toolDocument);
        }
    }

    public function removeToolDocument(DropzoneToolDocument $toolDocument)
    {
        if ($this->toolDocuments->contains($toolDocument)) {
            $this->toolDocuments->removeElement($toolDocument);
        }
    }

    public function emptyToolDocuments()
    {
        $this->toolDocuments->clear();
    }
}
