<?php

namespace UJM\ExoBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Misc\Choice;

/**
 * @ORM\Entity
 * @ORM\Table(name="ujm_interaction_qcm")
 */
class InteractionQCM extends AbstractInteraction
{
    const TYPE = 'InteractionQCM';

    /**
     * @ORM\Column(type="boolean")
     */
    private $shuffle = false;

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
     * @ORM\OneToMany(targetEntity="UJM\ExoBundle\Entity\Misc\Choice", mappedBy="interactionQCM", cascade={"persist", "remove"}, orphanRemoval=true)
     * @ORM\OrderBy({"order" = "ASC"})
     */
    private $choices;

    /**
     * @deprecated the only purpose of this is to know if it's a multiple or unique choice question (a boolean is sufficient)
     *
     * @ORM\ManyToOne(targetEntity="TypeQCM")
     * @ORM\JoinColumn(name="type_qcm_id", referencedColumnName="id")
     */
    private $typeQCM;

    /**
     * Constructs a new instance of choices.
     */
    public function __construct()
    {
        $this->choices = new ArrayCollection();
    }

    /**
     * @return string
     */
    public static function getQuestionType()
    {
        return self::TYPE;
    }

    /**
     * @deprecated will be removed in the next release
     *
     * @return TypeQCM
     */
    public function getTypeQCM()
    {
        return $this->typeQCM;
    }

    /**
     * @deprecated will be removed in the next release
     *
     * @param TypeQCM $typeQCM
     */
    public function setTypeQCM(TypeQCM $typeQCM)
    {
        $this->typeQCM = $typeQCM;
    }

    /**
     * @param bool $shuffle
     */
    public function setShuffle($shuffle)
    {
        $this->shuffle = $shuffle;
    }

    /**
     * @return bool
     */
    public function getShuffle()
    {
        return $this->shuffle;
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
