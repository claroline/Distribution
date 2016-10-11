<?php

namespace UJM\ExoBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * UJM\ExoBundle\Entity\StepQuestion.
 *
 * @ORM\Entity(repositoryClass="UJM\ExoBundle\Repository\StepQuestionRepository")
 * @ORM\Table(name="ujm_step_question")
 */
class StepQuestion
{
    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\Step", inversedBy="stepQuestions")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $step;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\Question", inversedBy="stepQuestions", cascade={"persist"})
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $question;

    /**
     * Order of the Question in the Step.
     *
     * @var int
     *
     * @ORM\Column(name="ordre", type="integer")
     */
    private $order;

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

    /**
     * Set order.
     *
     * @deprecated use setOrder instead
     *
     * @param int $order
     */
    public function setOrdre($order)
    {
        $this->order = $order;
    }

    /**
     * Get order.
     *
     * @deprecated use getOrder instead
     *
     * @return int
     */
    public function getOrdre()
    {
        return $this->order;
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
}
