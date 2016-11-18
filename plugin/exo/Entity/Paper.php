<?php

namespace UJM\ExoBundle\Entity;

use Claroline\CoreBundle\Entity\User;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="UJM\ExoBundle\Repository\PaperRepository")
 * @ORM\Table(name="ujm_paper")
 */
class Paper
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="num_paper", type="integer")
     */
    private $numPaper;

    /**
     * @ORM\Column(type="datetime")
     */
    private $start;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $end;

    /**
     * @ORM\Column(name="ordre_question", type="text", nullable=true)
     */
    private $ordreQuestion;

    /**
     * @ORM\Column(name="interupt", type="boolean", nullable=true)
     */
    private $interrupted = true;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $score;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=true)
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\Exercise")
     */
    private $exercise;

    /**
     * @ORM\Column(name="anonymous", type="boolean", nullable=true)
     */
    private $anonymous = false;

    public function __construct()
    {
        $this->start = new \DateTime();
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $numPaper
     */
    public function setNumPaper($numPaper)
    {
        $this->numPaper = $numPaper;
    }

    /**
     * @return int
     */
    public function getNumPaper()
    {
        return $this->numPaper;
    }

    /**
     * @param \DateTime $start
     */
    public function setStart(\DateTime $start)
    {
        $this->start = $start;
    }

    /**
     * @return \Datetime
     */
    public function getStart()
    {
        return $this->start;
    }

    /**
     * @param \Datetime $end
     */
    public function setEnd($end)
    {
        $this->end = $end;
    }

    /**
     * @return \Datetime
     */
    public function getEnd()
    {
        return $this->end;
    }

    /**
     * @param string $ordreQuestion
     */
    public function setOrdreQuestion($ordreQuestion)
    {
        $this->ordreQuestion = $ordreQuestion;
    }

    /**
     * @return string
     */
    public function getOrdreQuestion()
    {
        return $this->ordreQuestion;
    }

    /**
     * @param bool $interrupted
     */
    public function setInterrupted($interrupted)
    {
        $this->interrupted = $interrupted;
    }

    /**
     * @return bool
     */
    public function isInterrupted()
    {
        return $this->interrupted;
    }

    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param User $user
     */
    public function setUser(User $user = null)
    {
        $this->user = $user;
    }

    /**
     * @return Exercise
     */
    public function getExercise()
    {
        return $this->exercise;
    }

    /**
     * @param Exercise $exercise
     */
    public function setExercise(Exercise $exercise)
    {
        $this->exercise = $exercise;
    }

    /**
     * @param float $score
     */
    public function setScore($score)
    {
        $this->score = $score;
    }

    /**
     * @return float
     */
    public function getScore()
    {
        return $this->score;
    }

    /**
     * Set anonymous.
     *
     * @param bool $anonymous
     */
    public function setAnonymous($anonymous)
    {
        $this->anonymous = $anonymous;
    }

    /**
     * Get anonymous.
     */
    public function getAnonymous()
    {
        return $this->anonymous;
    }
}
