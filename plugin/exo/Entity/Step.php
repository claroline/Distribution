<?php

namespace UJM\ExoBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use UJM\ExoBundle\Entity\Question\Question;
use UJM\ExoBundle\Library\Model\OrderTrait;

/**
 * Represents a Step in an Exercise.
 *
 * @ORM\Entity(repositoryClass="UJM\ExoBundle\Repository\StepRepository")
 * @ORM\Table(name="ujm_step")
 */
class Step
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
     * @ORM\Column("uuid", type="string", length=36, unique=true)
     */
    private $uuid;

    use OrderTrait;

    /**
     * @var int
     *
     * @ORM\Column(type="string", nullable=true)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(type="text", nullable=true)
     */
    private $description;

    /**
     * @var int
     *
     * @ORM\Column(name="nbQuestion", type="integer")
     */
    private $nbQuestion = 0;

    /**
     * @ORM\Column(name="keepSameQuestion", type="boolean", nullable=true)
     */
    private $keepSameQuestion;

    /**
     * @var bool
     *
     * @ORM\Column(name="shuffle", type="boolean", nullable=true)
     */
    private $shuffle = false;

    /**
     * @var int
     *
     * @ORM\Column(name="duration", type="integer")
     */
    private $duration = 0;

    /**
     * @var int
     *
     * @ORM\Column(name="max_attempts", type="integer")
     */
    private $maxAttempts = 5;

    /**
     * @ORM\ManyToOne(targetEntity="Exercise", inversedBy="steps")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $exercise;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="StepQuestion", mappedBy="step", cascade={"persist", "remove"}, orphanRemoval=true)
     * @ORM\OrderBy({"order" = "ASC"})
     */
    private $stepQuestions;

    public function __construct()
    {
        $this->uuid = Uuid::uuid4();
        $this->stepQuestions = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Gets UUID.
     *
     * @return string
     */
    public function getUuid()
    {
        return $this->uuid;
    }

    /**
     * Sets UUID.
     *
     * @param $uuid
     */
    public function setUuid($uuid)
    {
        $this->uuid = $uuid;
    }

    /**
     * Set title.
     *
     * @param string $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * Get title.
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set description.
     *
     * @param string $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * Get description.
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set nbQuestion.
     *
     * @param int $nbQuestion
     */
    public function setNbQuestion($nbQuestion)
    {
        $this->nbQuestion = $nbQuestion;
    }

    /**
     * Get nbQuestion.
     *
     * @return int
     */
    public function getNbQuestion()
    {
        return $this->nbQuestion;
    }

    /**
     * Set keepSameQuestion.
     *
     * @param bool $keepSameQuestion
     */
    public function setKeepSameQuestion($keepSameQuestion)
    {
        $this->keepSameQuestion = $keepSameQuestion;
    }

    /**
     * Get keepSameQuestion.
     */
    public function getKeepSameQuestion()
    {
        return $this->keepSameQuestion;
    }

    /**
     * Set shuffle.
     *
     * @param bool $shuffle
     */
    public function setShuffle($shuffle)
    {
        $this->shuffle = $shuffle;
    }

    /**
     * Get shuffle.
     */
    public function getShuffle()
    {
        return $this->shuffle;
    }

    /**
     * Set duration.
     *
     * @param int $duration
     */
    public function setDuration($duration)
    {
        $this->duration = $duration;
    }

    /**
     * Get duration.
     *
     * @return int
     */
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * Set maxAttempts.
     *
     * @param int $maxAttempts
     */
    public function setMaxAttempts($maxAttempts)
    {
        $this->maxAttempts = $maxAttempts;
    }

    /**
     * Get maxAttempts.
     *
     * @return int
     */
    public function getMaxAttempts()
    {
        return $this->maxAttempts;
    }

    /**
     * @param Exercise $exercise
     */
    public function setExercise(Exercise $exercise)
    {
        $this->exercise = $exercise;
    }

    /**
     * @return Exercise
     */
    public function getExercise()
    {
        return $this->exercise;
    }

    /**
     * @return ArrayCollection
     */
    public function getStepQuestions()
    {
        return $this->stepQuestions;
    }

    /**
     * @param StepQuestion $stepQuestion
     */
    public function addStepQuestion(StepQuestion $stepQuestion)
    {
        if (!$this->stepQuestions->contains($stepQuestion)) {
            $this->stepQuestions->add($stepQuestion);
        }
    }

    /**
     * @param StepQuestion $stepQuestion
     */
    public function removeStepQuestion(StepQuestion $stepQuestion)
    {
        if ($this->stepQuestions->contains($stepQuestion)) {
            $this->stepQuestions->removeElement($stepQuestion);
        }
    }

    /**
     * Shortcuts to get the list of questions of the step.
     * 
     * @return array
     */
    public function getQuestions()
    {
        $stepQuestions = $this->stepQuestions->toArray();

        return array_map(function (StepQuestion $stepQuestion) {
            return $stepQuestion->getQuestion();
        }, $stepQuestions);
    }

    /**
     * Shortcuts to add Questions to Step.
     * Avoids the need to manually initialize a StepQuestion object to hold the relation.
     *
     * @param Question $question - the question to add to the step
     * @param int      $order    - the position of question in step. If -1 the question will be added at the end of the Step
     */
    public function addQuestion(Question $question, $order = -1)
    {
        $stepQuestion = new StepQuestion();

        $stepQuestion->setStep($this);
        $stepQuestion->setQuestion($question);

        if (-1 === $order) {
            // Calculate current Question order
            $order = count($this->getStepQuestions());
        }

        $stepQuestion->setOrder($order);
    }
}
