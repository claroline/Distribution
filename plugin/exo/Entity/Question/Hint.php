<?php

namespace UJM\ExoBundle\Entity\Question;

use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Library\Model\ContentTrait;
use UJM\ExoBundle\Library\Model\PenaltyTrait;

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
     *
     * @var int
     */
    private $id;

    use ContentTrait;

    use PenaltyTrait;

    /**
     * @ORM\ManyToOne(targetEntity="Question", inversedBy="hints")
     *
     * @var Question
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
