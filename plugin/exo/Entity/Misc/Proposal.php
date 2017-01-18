<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use UJM\ExoBundle\Entity\QuestionType\MatchQuestion;
use UJM\ExoBundle\Entity\Misc\MatchAssociation;
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
     * @ORM\ManyToMany(targetEntity="UJM\ExoBundle\Entity\Misc\MatchAssociation", mappedBy="proposals")
     */
    private $associations;

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
        $this->uuid = Uuid::uuid4()->toString();
        $this->associations = new ArrayCollection();
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
     * Get associations.
     *
     * @return ArrayCollection
     */
    public function getAssociations()
    {
        return $this->associations;
    }

    /**
     * Add an association.
     *
     * @param MatchAssociation $association
     */
    public function addAssociation(MatchAssociation $association)
    {
        if (!$this->associations->contains($association)) {
            $this->associations->add($association);
            $association->addProposal($this);
        }
    }

    /**
     * Remove an association.
     *
     * @param MatchAssociation $association
     */
    public function removeAssociation(MatchAssociation $association)
    {
        if ($this->associations->contains($association)) {
            $this->associations->removeElement($association);
            $association->removeProposal($this);
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
