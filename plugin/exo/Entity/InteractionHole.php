<?php

namespace UJM\ExoBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Misc\Hole;

/**
 * A Cloze question.
 *
 * @ORM\Entity
 * @ORM\Table(name="ujm_interaction_hole")
 */
class InteractionHole extends AbstractInteraction
{
    const TYPE = 'InteractionHole';

    /**
     * The HTML text with empty holes.
     *
     * @var string
     *
     * @ORM\Column(name="htmlWithoutValue", type="text")
     */
    private $text;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(
     *     targetEntity="UJM\ExoBundle\Entity\Misc\Hole",
     *     mappedBy="interactionHole",
     *     cascade={"persist", "remove"},
     *     orphanRemoval=true
     * )
     */
    private $holes;

    /**
     * InteractionHole constructor.
     */
    public function __construct()
    {
        $this->holes = new ArrayCollection();
    }

    /**
     * @return string
     */
    public static function getQuestionType()
    {
        return self::TYPE;
    }

    /**
     * Gets text.
     *
     * @return string
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * Sets text.
     *
     * @param $text
     */
    public function setText($text)
    {
        $this->text = $text;
    }

    /**
     * Gets holes.
     *
     * @return Hole[]
     */
    public function getHoles()
    {
        return $this->holes;
    }

    /**
     * Adds an hole.
     *
     * @param Hole $hole
     */
    public function addHole(Hole $hole)
    {
        if (!$this->holes->contains($hole)) {
            $this->holes->add($hole);
            $hole->setInteractionHole($this);
        }
    }

    /**
     * Removes an hole.
     *
     * @param Hole $hole
     */
    public function removeHole(Hole $hole)
    {
        if ($this->holes->contains($hole)) {
            $this->holes->removeElement($hole);
        }
    }
}
