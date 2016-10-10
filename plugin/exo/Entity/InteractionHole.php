<?php

namespace UJM\ExoBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

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
     * HTML with holes filled with solutions.
     *
     * @deprecated it's not needed to store this as it's never used and can be recalculated
     *
     * @ORM\Column(type="text")
     */
    private $html;

    /**
     * The HTML text with empty holes.
     *
     * @ORM\Column(name="htmlWithoutValue", type="text")
     */
    private $text;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Hole",
     *     mappedBy="interactionHole",
     *     cascade={"persist", "remove"},
     *     orphanRemoval=true
     * )
     * @ORM\OrderBy({"position" = "ASC"})
     */
    private $holes;

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
     * @deprecated the underlying property will be removed in the next release
     *
     * @param string $html
     */
    public function setHtml($html)
    {
        $this->html = $html;
    }

    /**
     * @deprecated the underlying property will be removed in the next release
     *
     * @return string
     */
    public function getHtml()
    {
        return $this->html;
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
     * @deprecated use setText() instead
     *
     * @param string $htmlWithoutValue
     */
    public function setHtmlWithoutValue($htmlWithoutValue)
    {
        $this->text = $htmlWithoutValue;
    }

    /**
     * @deprecated use getText() instead
     *
     * @return string
     */
    public function getHtmlWithoutValue()
    {
        return $this->text;
    }

    /**
     * Gets holes.
     *
     * @return ArrayCollection
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
        $this->holes->add($hole);
        $hole->setInteractionHole($this);
    }

    /**
     * Removes an hole.
     *
     * @param Hole $hole
     */
    public function removeHole(Hole $hole)
    {
        $this->holes->removeElement($hole);
    }

    public function __clone()
    {
        if ($this->id) {
            $this->id = null;
            $this->question = clone $this->question;
            $newHoles = new ArrayCollection();

            foreach ($this->holes as $hole) {
                $newHole = clone $hole;
                $newHole->setInteractionHole($this);
                $newHoles->add($newHole);
            }

            $this->holes = $newHoles;
        }
    }
}
