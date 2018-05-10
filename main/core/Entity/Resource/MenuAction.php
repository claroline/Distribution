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
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="claro_menu_action")
 */
class MenuAction
{
    use Id;

    /**
     * @ORM\Column(nullable=true)
     *
     * @var string
     */
    private $name;

    /**
     * @ORM\Column(type="integer")
     *
     * @var int
     */
    private $mask;

    /**
     * @ORM\Column(name="group_name", nullable=true)
     *
     * @var string
     */
    private $group;

    /**
     * @ORM\Column(type="boolean")
     *
     * @var string
     */
    private $bulk = false;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\CoreBundle\Entity\Resource\ResourceType",
     *     inversedBy="actions",
     *     cascade={"persist"}
     * )
     * @ORM\JoinColumn(name="resource_type_id", onDelete="SET NULL")
     */
    private $resourceType;

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    public function getResourceType()
    {
        return $this->resourceType;
    }

    /**
     * @param ResourceType $resourceType
     */
    public function setResourceType(ResourceType $resourceType = null)
    {
        $this->resourceType = $resourceType;
    }

    /**
     * @param $value
     *
     * @deprecated
     */
    public function setValue($value)
    {
        $this->mask = $value;
    }

    /**
     * @return int
     *
     * @deprecated
     */
    public function getValue()
    {
        return $this->mask;
    }

    /**
     * @param int $mask
     */
    public function setMask($mask)
    {
        $this->mask = $mask;
    }

    /**
     * @return int
     */
    public function getMask()
    {
        return $this->mask;
    }

    /**
     * @param string $group
     */
    public function setGroup($group)
    {
        $this->group = $group;
    }

    /**
     * @return string
     */
    public function getGroup()
    {
        return $this->group;
    }

    public function isBulk()
    {
        return $this->bulk;
    }

    public function setBulk($bulk)
    {
        $this->bulk = $bulk;
    }
}
