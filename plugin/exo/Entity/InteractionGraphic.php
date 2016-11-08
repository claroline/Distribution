<?php

namespace UJM\ExoBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * A Graphic question.
 *
 * @ORM\Entity
 * @ORM\Table(name="ujm_interaction_graphic")
 */
class InteractionGraphic extends AbstractInteraction
{
    const TYPE = 'InteractionGraphic';

    /**
     * @ORM\ManyToOne(targetEntity="Picture")
     */
    private $image;

    /**
     * @ORM\OneToMany(targetEntity="Coords", mappedBy="interactionGraphic", cascade={"all"}, orphanRemoval=true)
     */
    private $areas;

    /**
     * Constructs a new instance of choices.
     */
    public function __construct()
    {
        $this->areas = new ArrayCollection();
    }

    /**
     * @return string
     */
    public static function getQuestionType()
    {
        return self::TYPE;
    }

    /**
     * Gets image.
     *
     * @return Picture
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Sets image.
     *
     * @param Picture $image
     */
    public function setImage(Picture $image)
    {
        $this->image = $image;
    }

    /**
     * @deprecated use getImage() instead
     *
     * @return Picture
     */
    public function getPicture()
    {
        return $this->image;
    }

    /**
     * @deprecated use setImage() instead
     *
     * @param Picture $picture
     */
    public function setPicture(Picture $picture)
    {
        $this->image = $picture;
    }

    /**
     * Gets areas.
     *
     * @return ArrayCollection
     */
    public function getAreas()
    {
        return $this->areas;
    }

    /**
     * Adds an area.
     *
     * @param Coords $area
     */
    public function addArea(Coords $area)
    {
        if (!$this->areas->contains($area)) {
            $this->areas->add($area);
            $area->setInteractionGraphic($this);
        }
    }

    /**
     * Removes an area.
     *
     * @param Coords $area
     */
    public function removeArea(Coords $area)
    {
        if ($this->areas->contains($area)) {
            $this->areas->removeElement($area);
        }
    }

    /**
     * @deprecated use getAreas() instead
     *
     * @return ArrayCollection
     */
    public function getCoords()
    {
        return $this->areas;
    }

    /**
     * @deprecated use addArea() instead
     *
     * @param Coords $coords
     */
    public function addCoord(Coords $coords)
    {
        $this->areas->add($coords);
        $coords->setInteractionGraphic($this);
    }

    public function __clone()
    {
        if ($this->id) {
            $this->id = null;
            $this->question = clone $this->question;
            $newCoords = new ArrayCollection();

            foreach ($this->areas as $coords) {
                $newCoords = clone $coords;
                $newCoords->setInteractionGraphic($this);
                $newCoords->add($newCoords);
            }

            $this->areas = $newCoords;
        }
    }
}
