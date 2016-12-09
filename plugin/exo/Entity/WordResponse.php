<?php

namespace UJM\ExoBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * UJM\ExoBundle\Entity\WordResponse.
 *
 * @ORM\Entity(repositoryClass="UJM\ExoBundle\Repository\WordResponseRepository")
 * @ORM\Table(name="ujm_word_response")
 */
class WordResponse
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
     * @ORM\Column(name="response", type="string", length=255)
     */
    private $text;

    /**
     * @var bool
     *
     * @ORM\Column(name="caseSensitive", type="boolean", nullable=true)
     */
    private $caseSensitive;

    /**
     * @var float
     *
     * @ORM\Column(name="score", type="float")
     */
    private $score;

    /**
     * @deprecated this relation needs to be removed as it is not needed
     *
     * @var InteractionOpen
     *
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\InteractionOpen", inversedBy="wordResponses")
     * @ORM\JoinColumn(name="interaction_open_id", referencedColumnName="id")
     */
    private $interactionopen;

    /**
     * @deprecated this relation needs to be removed as it is not needed
     *
     * @var Hole
     *
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\Hole", inversedBy="wordResponses")
     * @ORM\JoinColumn(name="hole_id", referencedColumnName="id")
     */
    private $hole;

    /**
     * @var string
     *
     * @ORM\Column(name="feedback", type="text", nullable=true)
     */
    private $feedback;

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
     * Get text.
     *
     * @return string
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * Set text.
     *
     * @param string $text
     */
    public function setText($text)
    {
        $this->text = $text;
    }

    /**
     * Get response.
     *
     * @deprecated use getText() instead
     *
     * @return string
     */
    public function getResponse()
    {
        return $this->text;
    }

    /**
     * Set response.
     *
     * @deprecated use setText() instead
     *
     * @param string $response
     */
    public function setResponse($response)
    {
        $this->text = $response;
    }

    /**
     * Is the keyword case sensitive ?
     *
     * @return bool
     */
    public function isCaseSensitive()
    {
        return $this->caseSensitive;
    }

    /**
     * Get caseSensitive.
     *
     * @deprecated use isCaseSensitive() instead
     *
     * @return bool
     */
    public function getCaseSensitive()
    {
        return $this->caseSensitive;
    }

    /**
     * Set caseSensitive.
     *
     * @param bool $caseSensitive
     */
    public function setCaseSensitive($caseSensitive)
    {
        $this->caseSensitive = $caseSensitive;
    }

    /**
     * Get score.
     *
     * @return float
     */
    public function getScore()
    {
        return $this->score;
    }

    /**
     * Set score.
     *
     * @param float $score
     */
    public function setScore($score)
    {
        $this->score = $score;
    }

    /**
     * @deprecated this entity do not need to know open question as they also can be linked to holes
     *
     * @return InteractionOpen
     */
    public function getInteractionOpen()
    {
        return $this->interactionopen;
    }

    /**
     * @deprecated this entity do not need to know open question as they also can be linked to holes
     *
     * @param InteractionOpen $interactionOpen
     */
    public function setInteractionOpen(InteractionOpen $interactionOpen)
    {
        $this->interactionopen = $interactionOpen;
    }

    /**
     * @deprecated this entity do not need to know holes as they also can be linked to open questions
     *
     * @return Hole
     */
    public function getHole()
    {
        return $this->hole;
    }

    /**
     * @deprecated this entity do not need to know holes as they also can be linked to open questions
     *
     * @param Hole $hole
     */
    public function setHole(Hole $hole)
    {
        $this->hole = $hole;
    }

    /**
     * Get feedback.
     *
     * @return string
     */
    public function getFeedback()
    {
        return $this->feedback;
    }

    /**
     * Set feedback.
     *
     * @param string $feedback
     */
    public function setFeedback($feedback)
    {
        $this->feedback = $feedback;
    }
}
