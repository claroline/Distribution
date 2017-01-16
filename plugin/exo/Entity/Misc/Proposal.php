<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use UJM\ExoBundle\Entity\QuestionType\MatchQuestion;
use UJM\ExoBundle\Library\Model\ContentTrait;
use UJM\ExoBundle\Library\Model\OrderTrait;

/**
 * Proposal.
 *
 * @ORM\Entity()
 * @ORM\Table(name="ujm_proposal")
 */
class Proposal
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column("uuid", type="string", length=36, unique=true)
     */
    private $uuid;

    use OrderTrait;

    use ContentTrait;

    /**
     * @var ArrayCollection
     *
     * @ORM\ManyToMany(targetEntity="UJM\ExoBundle\Entity\Misc\Label")
     * @ORM\JoinColumn(name="label_id", referencedColumnName="id")
     * @ORM\JoinTable(name="ujm_proposal_label")
     */
    private $expectedLabels;

    /**
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\QuestionType\MatchQuestion", inversedBy="proposals")
     * @ORM\JoinColumn(name="interaction_matching_id", referencedColumnName="id")
     */
    private $interactionMatching;

    /**
     * Proposal constructor.
     */
    public function __construct()
    {
        $this->expectedLabels = new ArrayCollection();
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
     * Gets UUID.
     *
     * @return string
     */
    public function getUuid()
    {
        return $this->uuid;
    }

    /**
     * Sets UUID.
     *
     * @param $uuid
     */
    public function setUuid($uuid)
    {
        $this->uuid = $uuid;
    }

    /**
     * Get InteractionMatching.
     *
     * @return ArrayCollection
     */
    public function getExpectedLabels()
    {
        return $this->expectedLabels;
    }

    /**
     * Set Label.
     *
     * @param Label $label
     */
    public function addExpectedLabel(Label $label)
    {
        if (!$this->expectedLabels->contains($label)) {
            $this->expectedLabels->add($label);
        }
    }

    /**
     * Remove Label.
     *
     * @param Label $label
     */
    public function removeExpectedLabel(Label $label)
    {
        if ($this->expectedLabels->contains($label)) {
            $this->expectedLabels->removeElement($label);
        }
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
}
