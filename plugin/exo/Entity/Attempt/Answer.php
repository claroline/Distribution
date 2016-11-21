<?php

namespace UJM\ExoBundle\Entity\Attempt;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Question\Hint;
use UJM\ExoBundle\Entity\Question\Question;

/**
 * An answer represents a user answer to a question.
 *
 * @ORM\Entity(repositoryClass="UJM\ExoBundle\Repository\AnswerRepository")
 * @ORM\Table(name="ujm_response")
 */
class Answer
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
     * @var string
     * 
     * @ORM\Column
     */
    private $ip;

    /**
     * The score obtained for this question.
     *
     * @var float
     *
     * @ORM\Column(name="mark", type="float")
     */
    private $mark;

    /**
     * @var int
     *
     * @ORM\Column(name="nb_tries", type="integer")
     */
    private $nbTries = 1;

    /**
     * The answer data formatted in string for DB storage.
     *
     * @var string
     *
     * @ORM\Column(type="text", nullable=true)
     */
    private $response;

    /**
     * The list of hints used to answer the question.
     *
     * @var ArrayCollection
     *
     * @ORM\ManyToMany(targetEntity="UJM\ExoBundle\Entity\Question\Hint")
     * @ORM\JoinTable(
     *     name="ujm_answer_hints",
     *     joinColumns={@ORM\JoinColumn(name="answer_id", referencedColumnName="id")},
     *     inverseJoinColumns={@ORM\JoinColumn(name="hint_id", referencedColumnName="id", unique=true)}
     * )
     */
    private $usedHints;

    /**
     * @var Paper
     *
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\Attempt\Paper", inversedBy="answers")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $paper;

    /**
     * The question that is answered.
     *
     * @var Question
     *
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\Question\Question")
     */
    private $question;

    /**
     * Answer constructor.
     */
    public function __construct()
    {
        $this->usedHints = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param string $ip
     */
    public function setIp($ip)
    {
        $this->ip = $ip;
    }

    /**
     * @return string
     */
    public function getIp()
    {
        return $this->ip;
    }

    /**
     * Sets score.
     *
     * @param float $score
     */
    public function setScore($score)
    {
        $this->mark = $score;
    }

    /**
     * Gets score.
     *
     * @return float
     */
    public function getScore()
    {
        return $this->mark;
    }

    /**
     * @param int $nbTries
     */
    public function setNbTries($nbTries)
    {
        $this->nbTries = $nbTries;
    }

    /**
     * @return int
     */
    public function getNbTries()
    {
        return $this->nbTries;
    }

    /**
     * Sets data.
     *
     * @param string $data
     */
    public function setData($data)
    {
        $this->response = $data;
    }

    /**
     * Gets data.
     *
     * @return string
     */
    public function getData()
    {
        return $this->response;
    }

    /**
     * @deprecated
     *
     * @param string $response
     */
    public function setResponse($response)
    {
        $this->response = $response;
    }

    /**
     * @deprecated
     *
     * @return string
     */
    public function getResponse()
    {
        return $this->response;
    }

    public function getUsedHints()
    {
        return $this->usedHints;
    }

    /**
     * Adds an Hint.
     *
     * @param Hint $hint
     */
    public function addUsedHint(Hint $hint)
    {
        if (!$this->usedHints->contains($hint)) {
            $this->usedHints->add($hint);
        }
    }

    /**
     * Removes an Hint.
     *
     * @param Hint $hint
     */
    public function removeUsedHint(Hint $hint)
    {
        if ($this->usedHints->contains($hint)) {
            $this->usedHints->removeElement($hint);
        }
    }

    /**
     * @param Paper $paper
     */
    public function setPaper(Paper $paper)
    {
        $this->paper = $paper;
    }

    /**
     * @return Paper
     */
    public function getPaper()
    {
        return $this->paper;
    }

    /**
     * @return Question
     */
    public function getQuestion()
    {
        return $this->question;
    }

    /**
     * @param Question $question
     */
    public function setQuestion(Question $question)
    {
        $this->question = $question;
    }
}
