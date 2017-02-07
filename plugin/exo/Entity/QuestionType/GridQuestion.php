<?php

namespace UJM\ExoBundle\Entity\QuestionType;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Misc\Cell;
use UJM\ExoBundle\Library\Model\PenaltyTrait;
use UJM\ExoBundle\Library\Model\ShuffleTrait;

/**
 * A pair question.
 *
 * @ORM\Entity
 * @ORM\Table(name="ujm_question_grid")
 */
class GridQuestion extends AbstractQuestion
{
    use ShuffleTrait;

    /*
     * The penalty to apply to each wrong answer
     */
    use PenaltyTrait;

    /**
     * List of available cells for the question.
     *
     * @ORM\OneToMany(targetEntity="UJM\ExoBundle\Entity\Misc\Cell", cascade={"all"})
     *
     * @var ArrayCollection
     */
    private $cells;

    /**
     * Sum sub mode ["cell", "row", "col"]
     *
     * @ORM\Column(type="string")
     *
     * @var string
     */
    private $sumMode;

    /**
     * Number of rows to draw
     *
     * @ORM\Column(type="integer")
     *
     * @var integer
     */
    private $rows;

    /**
     * Number of columns to draw
     *
     * @ORM\Column(type="integer")
     *
     * @var integer
     */
    private $cols;

    /**
     * Grid border thickness
     *
     * @ORM\Column(type="integer")
     *
     * @var string
     */
    private $borderThickness = 1;

    /**
     * Grid border color
     *
     * @ORM\Column(type="string")
     *
     * @var string
     */
    private $borderColor = "#eee";


    /**
     * PairQuestion constructor.
     */
    public function __construct()
    {
        $this->cells = new ArrayCollection();
    }

    /**
     * Get cells.
     *
     * @return ArrayCollection
     */
    public function getCells()
    {
        return $this->cells;
    }

    /**
     * Get a cell by its uuid.
     *
     * @param $uuid
     *
     * @return Cell|null
     */
    public function getCell($uuid)
    {
        $found = null;
        foreach ($this->cells as $cell) {
            if ($cell->getUuid() === $uuid) {
                $found = $cell;
                break;
            }
        }

        return $found;
    }

    /**
     * Add cell.
     *
     * @param Cell $cell
     */
    public function addCell(Cell $cell)
    {
        if (!$this->cells->contains($cell)) {
            $this->cells->add($cell);
        }
    }

    /**
     * Remove cell.
     *
     * @param Cell $cell
     */
    public function removeCell(Cell $cell)
    {
        if ($this->cells->contains($cell)) {
            $this->cells->removeElement($cell);
        }
    }

    /**
     * @param string $mode
     */
    public function setSumMode($mode)
    {
        $this->sumMode = $mode;
    }

    /**
     * @return string
     */
    public function getSumMode()
    {
        return $this->sumMode;
    }

    /**
     * Number of rows for the grid
     * @param number $rows
     */
    public function setRows($rows)
    {
        $this->rows = $rows;
    }

    /**
     * Number of rows for the grid
     * @return number
     */
    public function getRows()
    {
        return $this->rows;
    }

    /**
     * Number of cols for the grid
     * @param number $cols
     */
    public function setCols($cols)
    {
        $this->cols = $cols;
    }

    /**
     * Number of cols for the grid
     * @return number
     */
    public function getCols()
    {
        return $this->cols;
    }

    /**
     * Grid border width
     * @param number $thickness
     */
    public function setBorderThickness($thickness)
    {
        $this->borderThickness = $thickness;
    }

    /**
     * @return number
     */
    public function getBorderThickness()
    {
        return $this->borderThickness;
    }

    /**
     * Grid border color
     * @param string $color
     */
    public function setBorderColor($color)
    {
        $this->borderColor = $color;
    }

    /**
     * @return string
     */
    public function getBorderColor()
    {
        return $this->borderColor;
    }

    /**
     * Get styles for the grid
     * @return array
     */
    public function getGridStyle()
    {
        return ['thickness' => $this->borderThickness, 'color' => $this->borderColor];
    }
}
