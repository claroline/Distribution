<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Entity\Home;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints as DoctrineAssert;

/**
 * @ORM\Entity(repositoryClass="Claroline\CoreBundle\Repository\HomeTabConfigRepository")
 * @ORM\Table(
 *     name="claro_home_tab_config",
 *     uniqueConstraints={
 *         @ORM\UniqueConstraint(
 *             name="home_tab_config_unique_home_tab_user_workspace_type",
 *             columns={"home_tab_id", "user_id", "workspace_id", "type"}
 *         )
 *     }
 * )
 * @DoctrineAssert\UniqueEntity({"homeTab", "user", "workspace", "type"})
 */
class HomeTabConfig
{
    public function __construct()
    {
        $this->refreshUuid();

        $this->centerTitle = false;
    }

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(nullable=true)
     */
    protected $name;

    /**
     * @ORM\Column(nullable=false, type="text")
     */
    protected $longTitle;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $centerTitle = false;

    /**
     * @ORM\Column(nullable=true)
     */
    protected $icon;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\CoreBundle\Entity\Tab\HomeTab",
     *     cascade={"persist"}
     * )
     * @ORM\JoinColumn(name="home_tab_id", nullable=false, onDelete="CASCADE")
     */
    protected $homeTab;

    /**
     * @ORM\Column()
     */
    protected $type;

    /**
     * @ORM\Column(type="boolean", name="is_visible")
     */
    protected $visible = true;

    /**
     * @ORM\Column(type="boolean", name="is_locked")
     */
    protected $locked = false;

    /**
     * @ORM\Column(type="integer", name="tab_order")
     */
    protected $tabOrder;

    /**
     * @ORM\Column(type="json_array", nullable=true)
     */
    protected $details;

    /**
     * @ORM\ManyToMany(
     *     targetEntity="Claroline\CoreBundle\Entity\Role"
     * )
     * @ORM\JoinTable(name="claro_home_tab_roles")
     */
    protected $roles;

    public function getRoles()
    {
        return $this->roles->toArray();
    }

    public function addRole(Role $role)
    {
        if (!$this->roles->contains($role)) {
            $this->roles->add($role);
        }
    }

    public function removeRole(Role $role)
    {
        $this->roles->removeElement($role);
    }

    public function emptyRoles()
    {
        $this->roles->clear();
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getHomeTab()
    {
        return $this->homeTab;
    }

    public function setHomeTab($homeTab)
    {
        $this->homeTab = $homeTab;
    }

    public function isVisible()
    {
        return $this->visible;
    }

    public function setVisible($visible)
    {
        $this->visible = $visible;
    }

    public function isLocked()
    {
        return $this->locked;
    }

    public function setLocked($locked)
    {
        $this->locked = $locked;
    }

    public function getTabOrder()
    {
        return $this->tabOrder;
    }

    public function setTabOrder($tabOrder)
    {
        $this->tabOrder = $tabOrder;
    }

    public function getType()
    {
        return $this->type;
    }

    public function setType($type)
    {
        $this->type = $type;
    }

    public function getDetails()
    {
        return $this->details;
    }

    public function setDetails($details)
    {
        $this->details = $details;
    }

    /**
     * Alias of setTabOrder.
     */
    public function setPosition($position)
    {
        $this->setTabOrder($position);
    }
}
