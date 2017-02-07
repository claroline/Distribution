<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use UJM\ExoBundle\Library\Model\ContentTrait;
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

    use ContentTrait;

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
     * Font color in the cell
     *
     * @ORM\Column(type="string", nullable=false)
     *
     * @var string
     */
    private $color = "#000";

    /**
     * Cell background color
     *
     * @ORM\Column(type="string", nullable=false)
     *
     * @var string
     */
    private $background = "#fff";

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
    private $choices;

    /**
     * Many cells have One Product.
     * @ManyToOne(targetEntity="UJM\ExoBundle\Entity\GridQuestion", inversedBy="cells")
     * @JoinColumn(name="question_id", referencedColumnName="id")
     */
    private $question;

    /**
     * GridItem constructor.
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
}
