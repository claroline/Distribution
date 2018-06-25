<?php

namespace Claroline\CoreBundle\Entity\Widget;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Doctrine\Common\Collections\ArrayCollection;

class WidgetContainer
{
    use Id;
    use Uuid;

    /**
     * The name of the widget.
     *
     * @ORM\Column(name="widget_name", nullable=true)
     *
     * @var string
     */
    private $name;

    /**
     * The display layout of the container.
     *
     * @var array
     */
    private $layout = [];

    /**
     * The color of the text inside the widget.
     *
     * @ORM\Column(nullable=true)
     *
     * @var string
     */
    private $color = null;

    /**
     * The type of the background (none, color, image).
     *
     * @ORM\Column()
     *
     * @var string
     */
    private $backgroundType = 'none';

    /**
     * The background data (either the color or the image url).
     *
     * @ORM\Column(nullable=true)
     *
     * @var string
     */
    private $background = null;

    /**
     * @var ArrayCollection|WidgetInstance[]
     */
    private $instances;

    /**
     * WidgetContainer constructor.
     */
    public function __construct()
    {
        $this->refreshUuid();

        $this->instances = new ArrayCollection();
    }

    /**
     * Get name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set name.
     *
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    public function getLayout()
    {
        return $this->layout;
    }

    public function setLayout()
    {

    }

    /**
     * Get color.
     *
     * @return string
     */
    public function getColor()
    {
        return $this->color;
    }

    /**
     * Set color.
     *
     * @param string $color
     */
    public function setColor($color)
    {
        $this->color = $color;
    }

    /**
     * Get background type.
     *
     * @return string
     */
    public function getBackgroundType()
    {
        return $this->backgroundType;
    }

    /**
     * Set background type.
     *
     * @param string $backgroundType
     */
    public function setBackgroundType($backgroundType)
    {
        $this->backgroundType = $backgroundType;
    }

    /**
     * Get background.
     *
     * @return string
     */
    public function getBackground()
    {
        return $this->background;
    }

    /**
     * Set background.
     *
     * @param string $background
     */
    public function setBackground($background)
    {
        $this->background = $background;
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
}
