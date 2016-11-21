<?php

namespace UJM\ExoBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Content\Image;
use UJM\ExoBundle\Entity\Misc\Area;

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
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\Content\Image")
     */
    private $image;

    /**
     * @todo remove the mapped by and add a join table
     *
     * @ORM\OneToMany(targetEntity="UJM\ExoBundle\Entity\Misc\Area", mappedBy="interactionGraphic", cascade={"all"}, orphanRemoval=true)
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
     * @return Image
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Sets image.
     *
     * @param Image $image
     */
    public function setImage(Image $image)
    {
        $this->image = $image;
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
     * @param Area $area
     */
    public function addArea(Area $area)
    {
        if (!$this->areas->contains($area)) {
            $this->areas->add($area);
            $area->setInteractionGraphic($this);
        }
    }

    /**
     * Removes an area.
     *
     * @param Area $area
     */
    public function removeArea(Area $area)
    {
        if ($this->areas->contains($area)) {
            $this->areas->removeElement($area);
        }
    }
}
