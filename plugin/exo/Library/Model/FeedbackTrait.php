<?php

namespace UJM\ExoBundle\Library\Model;

/**
 * FeedbackTrait
 * Gives the ability to an entity to have a feedback
 */
trait FeedbackTrait
{
    /**
     * Feedback content.
     * 
     * @var string
     *
     * @ORM\Column(name="feedback", type="text", nullable=true)
     */
    private $feedback = null;

    /**
     * Sets feedback.
     *
     * @param string $feedback
     */
    public function setFeedback($feedback)
    {
        $this->feedback = $feedback;
    }

    /**
     * Gets feedback.
     *
     * @return string
     */
    public function getFeedback()
    {
        return $this->feedback;
    }
}
