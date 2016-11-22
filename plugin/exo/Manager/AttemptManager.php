<?php

namespace UJM\ExoBundle\Manager;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Entity\Attempt\Paper;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Question\Hint;
use UJM\ExoBundle\Entity\Question\Question;
use UJM\ExoBundle\Library\Validator\ValidationException;
use UJM\ExoBundle\Manager\Attempt\AnswerManager;
use UJM\ExoBundle\Manager\Attempt\PaperManager;
use UJM\ExoBundle\Repository\PaperRepository;

/**
 * AttemptManager provides methods to manage user attempts to exercises.
 * 
 * @DI\Service("ujm_exo.manager.exercise")
 */
class AttemptManager
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var PaperManager
     */
    private $paperManager;

    /**
     * @var PaperRepository
     */
    private $paperRepository;

    /**
     * @var AnswerManager
     */
    private $answerManager;

    /**
     * AttemptManager constructor.
     *
     * @DI\InjectParams({
     *     "om"            = @DI\Inject("claroline.persistence.object_manager"),
     *     "paperManager"  = @DI\Inject("ujm_exo.manager.paper"),
     *     "answerManager" = @DI\Inject("ujm_exo.manager.answer")
     * })
     *
     * @param ObjectManager $om
     * @param PaperManager  $paperManager
     * @param AnswerManager $answerManager
     */
    public function __construct(
        ObjectManager $om,
        PaperManager $paperManager,
        AnswerManager $answerManager)
    {
        $this->om = $om;
        $this->paperManager = $paperManager;
        $this->paperRepository = $this->om->getRepository('UJMExoBundle:Attempt\Paper');
        $this->answerManager = $answerManager;
    }

    /**
     * Checks if a user is allowed to pass a quiz or not.
     *
     * Based on the maximum attempt allowed and the number of already done by the user.
     *
     * @param Exercise $exercise
     * @param User $user
     *
     * @return bool
     */
    public function canPass(Exercise $exercise, User $user = null)
    {
        $canPass = true;

        if (!$this->isAdmin($exercise) && $user) {
            $max = $exercise->getMaxAttempts();
            $nbFinishedPapers = $this->paperManager->countUserFinishedPapers($exercise, $user);

            if ($max > 0 && $nbFinishedPapers >= $max) {
                $canPass = false;
            }
        }

        return $canPass;
    }

    /**
     * Checks if a user can submit answers to a paper or use hints.
     *
     * A user can submit to a paper only if it is its own and the paper is not closed (= no end).
     * ATTENTION : As is, anonymous have access to all the other anonymous Papers !!!
     *
     * @param Paper $paper
     * @param User $user
     *
     * @return bool
     */
    public function canUpdate(Paper $paper, User $user = null)
    {
        return $paper->getEnd() || $user !== $paper->getUser();
    }

    /**
     * Gets the list of questions picked for the attempt.
     *
     * The list may vary from one paper to another based on
     * the exercise generation config (eg. random, pick subset of steps).
     *
     * @param Paper $paper
     *
     * @return Question[]
     */
    public function getQuestions(Paper $paper)
    {
        $questions = [];


        return $questions;
    }

    /**
     * Starts or continues an exercise paper.
     *
     * Returns an unfinished paper if the user has one (and exercise allows continue)
     * or creates a new paper in the other cases.
     * Note : an anonymous user will never be able to continue a paper
     *
     * @param Exercise $exercise - the exercise to play
     * @param User     $user     - the user who wants to play the exercise
     *
     * @return Paper
     */
    public function startOrContinue(Exercise $exercise, User $user = null)
    {
        $papers = [];
        if ($user) {
            // If it's not an anonymous, load the previous unfinished papers
            $papers = $this->paperRepository->findUnfinishedPapers($exercise, $user);
        }

        if (count($papers) === 0) {
            // Create a new paper for anonymous or if no unfinished
            $paper = $this->generate($exercise, $user);
        } else {
            if (!$exercise->isInterruptible()) {
                // User is not allowed to continue is previous paper => open a new one and close the previous
                $this->close($papers[0], false);

                $paper = $this->generate($exercise, $user);
            } else {
                // User can continue his previous paper
                $paper = $papers[0];
            }
        }

        return $paper;
    }

    /**
     * Generates a new user attempt to an exercise.
     *
     * @param Exercise $exercise
     * @param User $user
     *
     * @return Paper
     */
    public function generate(Exercise $exercise, User $user = null)
    {
        // Get the number of the new Paper
        $paperNum = 1;
        if ($user) {
            $lastPaper = $this->paperRepository->findLastPaper($exercise, $user);
            if ($lastPaper) {
                $paperNum = $lastPaper->getNumber() + 1;
            }
        }

        // Generate the list of Steps and Questions for the Paper
        $order = '';
        if (!empty($lastPaper) && $exercise->getKeepSteps()) {
            // Get steps order from the last user Paper
            $order = $lastPaper->getStructure();
        } else {
            // Generate paper step order
            $questions = $this->pickQuestions($exercise);
            foreach ($questions as $question) {
                $order .= $question->getId().';';
            }
        }

        // Create the new Paper entity
        $paper = new Paper();
        $paper->setExercise($exercise);
        $paper->setUser($user);
        $paper->setNumber($paperNum);
        $paper->setStructure($order);
        $paper->setAnonymized($exercise->getAnonymous());

        $this->om->persist($paper);
        $this->om->flush();

        return $paper;
    }

    /**
     * Submits user answers to a paper.
     *
     * @param Paper $paper
     * @param \stdClass[] $answers
     *
     * @throws ValidationException - if there is any invalid answer
     *
     * @return Answer[]
     */
    public function submit(Paper $paper, array $answers)
    {
        $submitted = [];

        $this->om->startFlushSuite();

        foreach ($answers as $answerData) {
            $existingAnswer = $paper->getAnswer($answerData->questionId);

            try {
                if (empty($existingAnswer)) {
                    $answer = $this->answerManager->create($answerData);
                } else {
                    $answer = $this->answerManager->update($existingAnswer, $answerData);
                    $answer->setTries($answer->getTries() + 1);
                }
            } catch (ValidationException $e) {
                throw new ValidationException('Submitted answers are invalid', $e->getErrors());
            }

            // Correct and mark answer

            $submitted[] = $answer;
        }
        
        $this->om->endFlushSuite();

        return $submitted;
    }

    /**
     * Closes a user paper.
     * Sets the end date of the paper and calculates its score.
     *
     * @param Paper $paper
     * @param bool $finished
     */
    public function close(Paper $paper, $finished = true)
    {
        if (!$paper->getEnd()) {
            $paper->setEnd(new \DateTime());
        }

        $paper->setInterrupted(!$finished);
        $paper->setScore($this->paperManager->calculateScore($paper));

        $this->om->persist($paper);
        $this->om->flush();

        $this->paperManager->checkPaperEvaluated($paper);
    }

    public function useHint(Paper $paper, Hint $hint)
    {
        if (!$this->paperRepository->hasHint($paper, $hint)) {
            throw new \LogicException("Hint {$hint->getId()} and paper {$paper->getId()} are not related");
        }

        // Retrieve or create the answer for the question
        $answer = $paper->getAnswer($hint->getQuestion()->getUuid());
        if (empty($answer)) {
            $answer = new Answer();
            $answer->setQuestion($hint->getQuestion());

            // Link the new answer to the paper
            $paper->addAnswer($answer);
        }

        $answer->addUsedHint($hint);

        $this->om->persist($answer);
        $this->om->flush();

        // TODO : this needs to be properly exported as it can also include a ResourceNode
        // We need to return an encoded Content
        return $hint->getValue();
    }
}
