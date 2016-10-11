<?php

namespace UJM\ExoBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * UJM\ExoBundle\Entity\Coords.
 *
 * @todo rename entity into Area
 *
 * @ORM\Entity
 * @ORM\Table(name="ujm_coords")
 */
class Coords
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column
     */
    private $value;

    /**
     * @ORM\Column
     */
    private $shape;

    /**
     * @ORM\Column
     */
    private $color;

    /**
     * @ORM\Column(name="score_coords", type="float")
     */
    private $score;

    /**
     * @ORM\ManyToOne(targetEntity="InteractionGraphic", inversedBy="areas")
     * @ORM\JoinColumn(name="interaction_graphic_id", referencedColumnName="id")
     */
    private $interactionGraphic;

    /**
     * @ORM\Column(type="float")
     */
    private $size;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $feedback;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param string $value
     */
    public function setValue($value)
    {
        $this->value = $value;
    }

    /**
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param string $shape
     */
    public function setShape($shape)
    {
        $this->shape = $shape;
    }

    /**
     * @return string
     */
    public function getShape()
    {
        return $this->shape;
    }

    /**
     * @param string $color
     */
    public function setColor($color)
    {
        $this->color = $color;
    }

    /**
     * @return string
     */
    public function getColor()
    {
        return $this->color;
    }

    /**
     * Sets score.
     *
     * @param float $score
     */
    public function setScore($score)
    {
        $this->score = $score;
    }

    /**
     * Gets score.
     *
     * @return float
     */
    public function getScore()
    {
        return $this->score;
    }

    /**
     * @deprecated use setScore() instead
     *
     * @param float $scoreCoords
     */
    public function setScoreCoords($scoreCoords)
    {
        $this->score = $scoreCoords;
    }

    /**
     * @deprecated use getScore() instead
     *
     * @return float
     */
    public function getScoreCoords()
    {
        return $this->score;
    }

    /**
     * @param float $size
     */
    public function setSize($size)
    {
        $this->size = $size;
    }

    /**
     * @return float
     */
    public function getSize()
    {
        return $this->size;
    }

    /**
     * @return InteractionGraphic
     */
    public function getInteractionGraphic()
    {
        return $this->interactionGraphic;
    }

    /**
     * @param InteractionGraphic $interactionGraphic
     */
    public function setInteractionGraphic(InteractionGraphic $interactionGraphic)
    {
        $this->interactionGraphic = $interactionGraphic;
    }

    /**
     * @return string
     */
    public function getFeedback()
    {
        return $this->feedback;
    }

    /**
     * @param $feedback
     */
    public function setFeedback($feedback)
    {
        $this->feedback = $feedback;
    }
}
