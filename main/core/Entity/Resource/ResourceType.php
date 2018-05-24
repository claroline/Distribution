<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Entity\Resource;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\CoreBundle\Entity\Plugin;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="Claroline\CoreBundle\Repository\ResourceTypeRepository")
 * @ORM\Table(name="claro_resource_type")
 */
class ResourceType
{
    use Id;

    /**
     * @ORM\Column(unique=true)
     */
    private $name;

    /**
     * The entity class of resources of this type.
     *
     * @var string
     *
     * @ORM\Column(length=256)
     */
    private $class;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Claroline\CoreBundle\Entity\Resource\MaskDecoder",
     *     mappedBy="resourceType",
     *     cascade={"persist"}
     * )
     *
     * @var ArrayCollection|MaskDecoder[]
     */
    private $maskDecoders;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Claroline\CoreBundle\Entity\Resource\MenuAction",
     *     mappedBy="resourceType",
     *     cascade={"persist"}
     * )
     */
    private $actions;

    /**
     * @ORM\Column(name="is_exportable", type="boolean")
     */
    private $exportable = false;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\Plugin")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $plugin;

    /**
     * @ORM\Column(type="integer")
     */
    private $defaultMask = 1;

    /**
     * @ORM\Column(name="is_enabled", type="boolean")
     */
    private $isEnabled = true;

    /**
     * @ORM\ManyToMany(
     *     targetEntity="Claroline\CoreBundle\Entity\Resource\ResourceRights",
     *     mappedBy="resourceTypes"
     * )
     *
     * @todo find a way to remove it (it's used in some DQL queries)
     */
    protected $rights;

    /**
     * ResourceType constructor.
     */
    public function __construct()
    {
        $this->actions = new ArrayCollection();
        $this->maskDecoders = new ArrayCollection();
    }

    /**
     * Returns the resource type name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Sets the resource type name.
     *
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * Returns the resource class name.
     *
     * @return string
     */
    public function getClass()
    {
        return $this->class;
    }

    /**
     * Sets the resource class name.
     *
     * @param string $class
     */
    public function setClass($class)
    {
        $this->class = $class;
    }

    public function setPlugin(Plugin $plugin)
    {
        $this->plugin = $plugin;
    }

    public function getPlugin()
    {
        return $this->plugin;
    }

    public function getActions()
    {
        return $this->actions;
    }

    public function addAction(MenuAction $action)
    {
        $this->actions->add($action);
    }

    public function setExportable($exportable)
    {
        $this->exportable = $exportable;
    }

    public function isExportable()
    {
        return $this->exportable;
    }

    /**
     * @return MaskDecoder[]|ArrayCollection
     */
    public function getMaskDecoders()
    {
        return $this->maskDecoders;
    }

    public function addMaskDecoder(MaskDecoder $maskDecoder)
    {
        if (!$this->maskDecoders->contains($maskDecoder)) {
            $this->maskDecoders->add($maskDecoder);
        }
    }

    public function removeMaskDecoder(MaskDecoder $maskDecoder)
    {
        if ($this->maskDecoders->contains($maskDecoder)) {
            $this->maskDecoders->removeElement($maskDecoder);
        }
    }

    public function setDefaultMask($mask)
    {
        $this->defaultMask = $mask;
    }

    public function getDefaultMask()
    {
        return $this->defaultMask;
    }

    /**
     * @param $isEnabled
     *
     * @deprecated
     */
    public function setIsEnabled($isEnabled)
    {
        $this->setEnabled($isEnabled);
    }

    public function setEnabled($enabled)
    {
        $this->isEnabled = $enabled;
    }

    public function isEnabled()
    {
        return $this->isEnabled;
    }
}
