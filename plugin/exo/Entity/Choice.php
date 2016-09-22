<?php

namespace UJM\ExoBundle\Entity;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @ORM\Table(name="ujm_choice")
 */
class Choice
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $label;

    /**
     * @ORM\Column(type="integer")
     */
    private $ordre;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $weight;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $feedback;

    /**
     * @ORM\Column(name="right_response", type="boolean", nullable=true)
     */
    private $rightResponse;

    /**
     * @ORM\Column(name="position_force", type="boolean", nullable=true)
     */
    private $positionForce;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\Resource\ResourceNode")
     */
    private $resourceNode;

    /**
     * @ORM\ManyToOne(targetEntity="InteractionQCM", inversedBy="choices")
     * @ORM\JoinColumn(name="interaction_qcm_id", referencedColumnName="id")
     */
    private $interactionQCM;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param string $label
     */
    public function setLabel($label)
    {
        $this->label = $label;
    }

    /**
     * @return string
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * @deprecated use setOrder() instead
     *
     * @param int $ordre
     */
    public function setOrdre($ordre)
    {
        $this->ordre = $ordre;
    }

    /**
     * @deprecated use getOrder() instead
     *
     * @return int
     */
    public function getOrdre()
    {
        return $this->ordre;
    }

    /**
     * @param int $order
     */
    public function setOrder($order)
    {
        $this->ordre = $order;
    }

    /**
     * @return int
     */
    public function getOrder()
    {
        return $this->ordre;
    }

    /**
     * @param float $weight
     */
    public function setWeight($weight)
    {
        $this->weight = $weight;
    }

    /**
     * @return float
     */
    public function getWeight()
    {
        return $this->weight;
    }

    /**
     * @param string $feedback
     */
    public function setFeedback($feedback)
    {
        $this->feedback = $feedback;
    }

    /**
     * @return string
     */
    public function getFeedback()
    {
        return $this->feedback;
    }

    /**
     * @return InteractionQCM
     */
    public function getInteractionQCM()
    {
        return $this->interactionQCM;
    }

    /**
     * @param InteractionQCM $interactionQCM
     */
    public function setInteractionQCM(InteractionQCM $interactionQCM)
    {
        $this->interactionQCM = $interactionQCM;
    }

    /**
     * @param bool $rightResponse
     */
    public function setRightResponse($rightResponse)
    {
        $this->rightResponse = $rightResponse;
    }

    /**
     * @return bool
     */
    public function getRightResponse()
    {
        return $this->rightResponse;
    }

    /**
     * @param bool $positionForce
     */
    public function setPositionForce($positionForce)
    {
        $this->positionForce = $positionForce;
    }

    /**
     * @return bool
     */
    public function getPositionForce()
    {
        return $this->positionForce;
    }

    /**
     * @return ResourceNode
     */
    public function getResourceNode()
    {
        return $this->resourceNode;
    }

    /**
     * @param ResourceNode $resourceNode
     */
    public function setResourceNode(ResourceNode $resourceNode = null)
    {
        $this->resourceNode = $resourceNode;
    }
}
