<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use UJM\ExoBundle\Entity\ItemType\GridQuestion;
use UJM\ExoBundle\Library\Model\UuidTrait;

/**
 * GridItem.
 *
 * @ORM\Entity
 * @ORM\Table(name="ujm_cell")
 */
class Cell
{
    /**
     * Unique identifier of the item.
     *
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @var int
     */
    private $id;

    use UuidTrait;

    /**
     * Data associated to the cell.
     *
     * @ORM\Column(type="text", nullable=true)
     *
     * @var string
     */
    private $data = null;

    /**
     * X coordinate of the item in the grid.
     *
     * @ORM\Column(type="integer", nullable=true)
     *
     * @var int
     */
    private $coordsX = null;

    /**
     * Y coordinate of the item in the grid.
     *
     * @ORM\Column(type="integer", nullable=true)
     *
     * @var int
     */
    private $coordsY = null;

    /**
     * Font color in the cell.
     *
     * @ORM\Column(type="string", nullable=false)
     *
     * @var string
     */
    private $color = '#000';

    /**
     * Cell background color.
     *
     * @ORM\Column(type="string", nullable=false)
     *
     * @var string
     */
    private $background = '#fff';

    /**
     * The list of texts attached to the cell.
     *
     * @ORM\OneToMany(
     *     targetEntity="UJM\ExoBundle\Entity\Misc\CellChoice",
     *     mappedBy="cell",
     *     cascade={"all"},
     *     orphanRemoval=true
     * )
     *
     * @var ArrayCollection
     */
    private $choices = null;

    /**
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\ItemType\GridQuestion", inversedBy="cells")
     * @ORM\JoinColumn(name="question_id", referencedColumnName="id")
     */
    private $question;

    /**
     * Cell constructor.
     */
    public function __construct()
    {
        $this->uuid = Uuid::uuid4()->toString();
        $this->choices = new ArrayCollection();
    }

    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param GridQuestion $question
     */
    public function setQuestion(GridQuestion $question)
    {
        $this->question = $question;
    }

    /**
     * @return GridQuestion
     */
    public function getQuestion()
    {
        return $this->question;
    }

    /**
     * @return string
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * @param string $data
     */
    public function setData($data)
    {
        $this->data = $data;
    }

    /**
     * Get X coordinate.
     *
     * @return int
     */
    public function getCoordsX()
    {
        return $this->coordsX;
    }

    /**
     * Set X coordinate.
     *
     * @param int $coordsX
     */
    public function setCoordsX($coordsX)
    {
        $this->coordsX = $coordsX;
    }

    /**
     * Get Y coordinate.
     *
     * @return int
     */
    public function getCoordsY()
    {
        return $this->coordsY;
    }

    /**
     * Set Y coordinate.
     *
     * @param $coordsY
     */
    public function setCoordsY($coordsY)
    {
        $this->coordsY = $coordsY;
    }

    /**
     * Get coordinates.
     *
     * @return array
     */
    public function getCoords()
    {
        return (is_int($this->coordsX) || is_int($this->coordsY)) ?
            [$this->coordsX, $this->coordsY] : null;
    }

    /**
     * Cell background color.
     *
     * @param string $color
     */
    public function setBackground($color)
    {
        $this->background = $color;
    }

    /**
     * @return string
     */
    public function getBackground()
    {
        return $this->background;
    }

    /**
     * Cell font color.
     *
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
     * Get styles for the cell.
     *
     * @return array
     */
    public function getCellStyle()
    {
        return ['background' => $this->background, 'color' => $this->color];
    }

    /**
     * @param CellChoice $choice
     */
    public function addChoice(CellChoice $choice)
    {
        if (!$this->choices->contains($choice)) {
            $this->choices->add($choice);
        }
    }

    /**
     * @param CellChoice $choice
     */
    public function removeChoice(CellChoice $choice)
    {
        if ($this->choices->contains($choice)) {
            $this->choices->removeElement($choice);
        }
    }

    /**
     * Get a cell choice by text.
     *
     * @param string $text
     *
     * @return Cell|null
     */
    public function getChoice($text)
    {
        $found = null;
        foreach ($this->choices as $choice) {
            /** @var CellChoice $choice */
          if (($choice->isCaseSensitive() && $choice->getText() === $text)
              || strtolower($choice->getText()) === strtolower($text)) {
              $found = $choice;
              break;
          }
        }

        return $found;
    }

    /**
     * @return ArrayCollection
     */
    public function getChoices()
    {
        return $this->choices;
    }
}
