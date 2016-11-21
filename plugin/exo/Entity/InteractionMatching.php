<?php

namespace UJM\ExoBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use UJM\ExoBundle\Entity\Misc\Label;
use UJM\ExoBundle\Entity\Misc\Proposal;

/**
 * @ORM\Entity
 * @ORM\Table(name="ujm_interaction_matching")
 */
class InteractionMatching extends AbstractInteraction
{
    const TYPE = 'InteractionMatching';

    /**
     * @var bool
     *
     * @ORM\Column(type="boolean")
     */
    private $shuffle = false;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(
     *     targetEntity="UJM\ExoBundle\Entity\Misc\Label",
     *     mappedBy="interactionMatching",
     *     cascade={"all"},
     *     orphanRemoval=true
     * )
     */
    private $labels;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(
     *     targetEntity="UJM\ExoBundle\Entity\Misc\Proposal",
     *     mappedBy="interactionMatching",
     *     cascade={"all"},
     *     orphanRemoval=true
     * )
     */
    private $proposals;

    /**
     * @ORM\ManyToOne(targetEntity="TypeMatching")
     * @ORM\JoinColumn(name="type_matching_id", referencedColumnName="id")
     */
    private $typeMatching;

    /**
     * InteractionMatching constructor.
     */
    public function __construct()
    {
        $this->labels = new ArrayCollection();
        $this->proposals = new ArrayCollection();
    }

    /**
     * @return string
     */
    public static function getQuestionType()
    {
        return self::TYPE;
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
     * @return TypeMatching
     */
    public function getTypeMatching()
    {
        return $this->typeMatching;
    }

    /**
     * @param TypeMatching $typeMatching
     */
    public function setTypeMatching(TypeMatching $typeMatching)
    {
        $this->typeMatching = $typeMatching;
    }

    /**
     * @return ArrayCollection
     */
    public function getLabels()
    {
        return $this->labels;
    }

    /**
     * @param Label $label
     */
    public function addLabel(Label $label)
    {
        $this->labels->add($label);
        $label->setInteractionMatching($this);
    }

    /**
     * @return ArrayCollection
     */
    public function getProposals()
    {
        return $this->proposals;
    }

    /**
     * Adds a proposal.
     *
     * @param Proposal $proposal
     */
    public function addProposal(Proposal $proposal)
    {
        if (!$this->proposals->contains($proposal)) {
            $this->proposals->add($proposal);
            $proposal->setInteractionMatching($this);
        }
    }

    /**
     * Removes a proposal.
     *
     * @param Proposal $proposal
     */
    public function removeProposal(Proposal $proposal)
    {
        if ($this->proposals->contains($proposal)) {
            $this->proposals->removeElement($proposal);
        }
    }
}
