<?php

namespace Claroline\CoreBundle\Entity\Widget;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * WidgetContainer entity.
 *
 * @ORM\Entity()
 * @ORM\Table(name="claro_widget_container")
 */
class WidgetContainer
{
    use Id;
    use Uuid;

    /**
     * The list of content instances.
     *
     * @ORM\OneToMany(targetEntity="Claroline\CoreBundle\Entity\Widget\WidgetInstance", mappedBy="container", cascade={"persist", "remove"})
     * @ORM\OrderBy({"position" = "ASC"})
     *
     * @var ArrayCollection|WidgetInstance[]
     */
    private $instances;

    /**
     * The list of content instances.
     *
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\Tab\HomeTab", invertedBy="container", cascade={"persist", "remove"})
     * @ORM\OrderBy({"position" = "ASC"})
     */
    private $homeTab;

    /**
     * WidgetContainer constructor.
     */
    public function __construct()
    {
        $this->refreshUuid();

        $this->instances = new ArrayCollection();
    }

    /**
     * Get the list of WidgetInstance in the container.
     *
     * @return ArrayCollection|WidgetInstance[]
     */
    public function getInstances()
    {
        return $this->instances;
    }

    /**
     * Add a WidgetInstance into the container.
     *
     * @param WidgetInstance $instance
     */
    public function addInstance(WidgetInstance $instance)
    {
        if (!$this->instances->contains($instance)) {
            $this->instances->add($instance);
            $instance->setContainer($this);
        }
    }

    /**
     * Remove a WidgetInstance from the container.
     *
     * @param WidgetInstance $instance
     */
    public function removeInstance(WidgetInstance $instance)
    {
        if ($this->instances->contains($instance)) {
            $this->instances->removeElement($instance);
        }
    }

    public function setHomeTab(HomeTab $tab)
    {
        $this->homeTab = $homeTab;
    }

    public function getHomeTab()
    {
        return $this->homeTab;
    }
}
