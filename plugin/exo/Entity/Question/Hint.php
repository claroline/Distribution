<?php

namespace UJM\ExoBundle\Entity\Question;

use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Library\Model\ContentTrait;

/**
 * Hint.
 *
 * @ORM\Entity()
 * @ORM\Table(name="ujm_hint")
 */
class Hint
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    use ContentTrait;

    /**
     * @ORM\Column(type="float")
     */
    private $penalty = 0;

    /**
     * @ORM\ManyToOne(targetEntity="Question", inversedBy="hints")
     */
    private $question;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param string $value
     */
    public function setValue($value)
    {
        $this->value = $value;
    }

    /**
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param float $penalty
     */
    public function setPenalty($penalty)
    {
        $this->penalty = $penalty;
    }

    /**
     * @return float
     */
    public function getPenalty()
    {
        return $this->penalty;
    }

    /**
     * @param Question $question
     */
    public function setQuestion(Question $question)
    {
        $this->question = $question;
    }

    /**
     * @return Question
     */
    public function getQuestion()
    {
        return $this->question;
    }
}
