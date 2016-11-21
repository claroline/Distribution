<?php

namespace UJM\ExoBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Question\Question;
use UJM\ExoBundle\Library\Model\OrderTrait;

/**
 * UJM\ExoBundle\Entity\StepQuestion.
 *
 * @ORM\Entity(repositoryClass="UJM\ExoBundle\Repository\StepQuestionRepository")
 * @ORM\Table(name="ujm_step_question")
 */
class StepQuestion
{
    use OrderTrait;
    
    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\Step", inversedBy="stepQuestions")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $step;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\Question\Question", cascade={"persist"})
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $question;

    /**
     * Set Step.
     *
     * @param Step $step
     */
    public function setStep(Step $step)
    {
        $this->step = $step;

        $step->addStepQuestion($this);
    }

    /**
     * Get Step.
     *
     * @return Step
     */
    public function getStep()
    {
        return $this->step;
    }

    /**
     * Set Question.
     *
     * @param Question $question
     */
    public function setQuestion(Question $question)
    {
        $this->question = $question;
    }

    /**
     * Get Question.
     *
     * @return Question
     */
    public function getQuestion()
    {
        return $this->question;
    }
}
