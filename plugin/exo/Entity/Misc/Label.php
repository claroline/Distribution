<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\InteractionMatching;
use UJM\ExoBundle\Library\Model\ContentTrait;
use UJM\ExoBundle\Library\Model\FeedbackTrait;
use UJM\ExoBundle\Library\Model\OrderTrait;
use UJM\ExoBundle\Library\Model\ScoreTrait;

/**
 * Label.
 *
 * @ORM\Entity()
 * @ORM\Table(name="ujm_label")
 */
class Label
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    use OrderTrait;

    use ScoreTrait;

    use FeedbackTrait;

    use ContentTrait;

    /**
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\InteractionMatching", inversedBy="labels")
     * @ORM\JoinColumn(name="interaction_matching_id", referencedColumnName="id")
     */
    private $interactionMatching;

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
     * @return InteractionMatching
     */
    public function getInteractionMatching()
    {
        return $this->interactionMatching;
    }

    /**
     * Set InteractionMatching.
     *
     * @param InteractionMatching $interactionMatching
     */
    public function setInteractionMatching(InteractionMatching $interactionMatching)
    {
        $this->interactionMatching = $interactionMatching;
    }
}
