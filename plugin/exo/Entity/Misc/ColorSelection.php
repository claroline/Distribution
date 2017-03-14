<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Library\Model\FeedbackTrait;
use UJM\ExoBundle\Library\Model\ScoreTrait;

/**
 * Choice.
 *
 * @ORM\Entity()
 * @ORM\Table(name="ujm_color_selection")
 */
class ColorSelection
{
    use ScoreTrait;

    use FeedbackTrait;

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="Selection", inversedBy="colorSelections")
     * @ORM\JoinColumn(name="selection_id", referencedColumnName="id")
     */
    private $selection;

    /**
     * @ORM\ManyToOne(targetEntity="Color", inversedBy="colorSelections")
     * @ORM\JoinColumn(name="color_id", referencedColumnName="id")
     */
    private $color;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return SelectionQuestion
     */
    public function getSelection()
    {
        return $this->selection;
    }

    /**
     * @param SelectionQuestion $interactionSelection
     */
    public function setSelection(Selection $selection)
    {
        $this->selection = $selection;
    }

    public function setColor(Color $color)
    {
        $this->color = $color;
    }

    public function getColor()
    {
        return $this->color;
    }
}
