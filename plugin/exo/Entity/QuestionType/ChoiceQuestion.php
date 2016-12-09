<?php

namespace UJM\ExoBundle\Entity\QuestionType;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Misc\Choice;
use UJM\ExoBundle\Library\Model\ShuffleTrait;

/**
 * A choice question.
 *
 * @ORM\Entity
 * @ORM\Table(name="ujm_interaction_qcm")
 */
class ChoiceQuestion extends AbstractQuestion
{
    /**
     * Is it a multiple or a unique choice question ?
     *
     * @ORM\Column(type="boolean")
     *
     * @var bool
     */
    private $multiple = false;

    use ShuffleTrait;

    /**
     * @ORM\Column(name="score_right_response", type="float", nullable=true)
     */
    private $scoreRightResponse;

    /**
     * @ORM\Column(name="score_false_response", type="float", nullable=true)
     */
    private $scoreFalseResponse;

    /**
     * @ORM\Column(name="weight_response", type="boolean")
     */
    private $weightResponse = false;

    /**
     * @ORM\OneToMany(
     *     targetEntity="UJM\ExoBundle\Entity\Misc\Choice",
     *     mappedBy="interactionQCM",
     *     cascade={"persist", "remove"},
     *     orphanRemoval=true
     * )
     * @ORM\OrderBy({"order" = "ASC"})
     */
    private $choices;

    /**
     * Constructs a new instance of choices.
     */
    public function __construct()
    {
        $this->choices = new ArrayCollection();
    }

    /**
     * Is multiple ?
     *
     * @return bool
     */
    public function isMultiple()
    {
        return $this->multiple;
    }

    /**
     * Sets multiple.
     *
     * @param bool $multiple
     */
    public function setMultiple($multiple)
    {
        $this->multiple = $multiple;
    }

    /**
     * @param float $scoreRightResponse
     */
    public function setScoreRightResponse($scoreRightResponse)
    {
        $this->scoreRightResponse = $scoreRightResponse;
    }

    /**
     * @return float
     */
    public function getScoreRightResponse()
    {
        return $this->scoreRightResponse;
    }

    /**
     * @param float $scoreFalseResponse
     */
    public function setScoreFalseResponse($scoreFalseResponse)
    {
        $this->scoreFalseResponse = $scoreFalseResponse;
    }

    /**
     * @return float
     */
    public function getScoreFalseResponse()
    {
        return $this->scoreFalseResponse;
    }

    /**
     * @param bool $weightResponse
     */
    public function setWeightResponse($weightResponse)
    {
        $this->weightResponse = $weightResponse;
    }

    /**
     * @return bool
     */
    public function getWeightResponse()
    {
        return $this->weightResponse;
    }

    /**
     * @return ArrayCollection
     */
    public function getChoices()
    {
        return $this->choices;
    }

    /**
     * @param Choice $choice
     */
    public function addChoice(Choice $choice)
    {
        if (!$this->choices->contains($choice)) {
            $this->choices->add($choice);
            $choice->setInteractionQCM($this);
        }
    }

    /**
     * @param Choice $choice
     */
    public function removeChoice(Choice $choice)
    {
        if ($this->choices->contains($choice)) {
            $this->choices->removeElement($choice);
        }
    }
}
