<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\QuestionType\MatchQuestion;
use UJM\ExoBundle\Library\Attempt\AnswerPartInterface;
use UJM\ExoBundle\Library\Model\FeedbackTrait;
use UJM\ExoBundle\Library\Model\ScoreTrait;

/**
 * Label.
 *
 * @ORM\Entity()
 * @ORM\Table(name="ujm_association")
 */
class Association implements AnswerPartInterface
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    use ScoreTrait;

    use FeedbackTrait;

    /**
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\QuestionType\MatchQuestion", inversedBy="associations")
     * @ORM\JoinColumn(name="interaction_matching_id", referencedColumnName="id")
     */
    private $interactionMatching;



    public function __construct()
    {
        $this->proposals = new ArrayCollection();
        $this->labels = new ArrayCollection();
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
     * Get InteractionMatching.
     *
     * @return MatchQuestion
     */
    public function getInteractionMatching()
    {
        return $this->interactionMatching;
    }

    /**
     * Set InteractionMatching.
     *
     * @param MatchQuestion $interactionMatching
     */
    public function setInteractionMatching(MatchQuestion $interactionMatching)
    {
        $this->interactionMatching = $interactionMatching;
    }

    /**
     * Add label.
     *
     * @param Label $label
     */
    public function addLabel(Label $label)
    {
        if (!$this->labels->contains($label)) {
            $this->labels->add($label);
            $label->addAssociation($this);
        }
    }

    /**
     * Remove label.
     *
     * @param Label $label
     */
    public function removeLabel(Label $label)
    {
        if ($this->labels->contains($label)) {
            $this->labels->removeElement($label);
            $label->removeAssociation($this);
        }
    }

    /**
     * Get labels.
     *
     * @return ArrayCollection
     */
    public function getLabels()
    {
        return $this->labels;
    }

    /**
     * Add proposal.
     *
     * @param Proposal $proposal
     */
    public function addProposal(Proposal $proposal)
    {
        if (!$this->proposals->contains($proposal)) {
            $this->proposals->add($proposal);
            $proposal->addAssociation($this);
        }
    }

    /**
     * Remove proposal.
     *
     * @param Proposal $proposal
     */
    public function removeProposal(Proposal $proposal)
    {
        if ($this->proposals->contains($proposal)) {
            $this->proposals->removeElement($proposal);
            $proposal->removeAssociation($this);
        }
    }

    /**
     * Get proposals.
     *
     * @return ArrayCollection
     */
    public function getProposals()
    {
        return $this->proposals;
    }
}
