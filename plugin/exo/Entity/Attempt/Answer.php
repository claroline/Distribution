<?php

namespace UJM\ExoBundle\Entity\Attempt;

use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Paper;
use UJM\ExoBundle\Entity\Question;

/**
 * @ORM\Entity(repositoryClass="UJM\ExoBundle\Repository\AnswerRepository")
 * @ORM\Table(name="ujm_response")
 */
class Answer
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column
     */
    private $ip;

    /**
     * The score obtained for this question.
     *
     * @ORM\Column(type="float")
     */
    private $mark;

    /**
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
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\Paper", inversedBy="answers")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $paper;

    /**
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\Question")
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
     * @deprecated
     *
     * @param float $mark
     */
    public function setMark($mark)
    {
        $this->mark = $mark;
    }

    /**
     * @deprecated
     *
     * @return float
     */
    public function getMark()
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
