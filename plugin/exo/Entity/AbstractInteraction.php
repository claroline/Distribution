<?php

namespace UJM\ExoBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Question\Question;

/**
 * @ORM\MappedSuperclass
 */
abstract class AbstractInteraction implements QuestionTypeProviderInterface
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\OneToOne(targetEntity="UJM\ExoBundle\Entity\Question\Question", cascade={"remove"})
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    protected $question;

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
    final public function setQuestion(Question $question)
    {
        $this->question = $question;

        $question->setInteraction($this);
        $question->setType(static::getQuestionType());
    }

    /**
     * @return Question
     */
    public function getQuestion()
    {
        return $this->question;
    }
}
