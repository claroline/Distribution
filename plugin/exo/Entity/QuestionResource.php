<?php

namespace UJM\ExoBundle\Entity;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Doctrine\ORM\Mapping as ORM;

/**
 * A Resource that can help to answer the Question.
 *
 * @ORM\Entity()
 * @ORM\Table(name="ujm_question_resource")
 */
class QuestionResource
{
    /**
     * @var int
     *
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * Order of the Resource in the Question.
     *
     * @var int
     *
     * @ORM\Column(type="integer")
     */
    private $order = 0;

    /**
     * Linked ResourceNode.
     *
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\Resource\ResourceNode")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $resourceNode;

    /**
     * Owning Question.
     *
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\Question", inversedBy="resources")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $question;

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
     * Set order.
     *
     * @param int $order
     */
    public function setOrder($order)
    {
        $this->order = $order;
    }

    /**
     * Get order.
     *
     * @return int
     */
    public function getOrder()
    {
        return $this->order;
    }

    /**
     * Set resource node.
     *
     * @param ResourceNode $resourceNode
     */
    public function setResourceNode(ResourceNode $resourceNode)
    {
        $this->resourceNode = $resourceNode;
    }

    /**
     * Get resource node.
     *
     * @return ResourceNode
     */
    public function getResourceNode()
    {
        return $this->resourceNode;
    }

    /**
     * Set question.
     *
     * @param Question $question
     */
    public function setQuestion(Question $question = null)
    {
        $this->question = $question;
    }

    /**
     * Get question.
     *
     * @return Question
     */
    public function getQuestion()
    {
        return $this->question;
    }
}
