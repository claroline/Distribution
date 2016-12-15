<?php

namespace UJM\ExoBundle\Manager\Attempt;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Entity\Attempt\Paper;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Question\Question;
use UJM\ExoBundle\Event\Log\LogExerciseEvaluatedEvent;
use UJM\ExoBundle\Library\Mode\CorrectionMode;
use UJM\ExoBundle\Library\Mode\MarkMode;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Validator\ValidationException;
use UJM\ExoBundle\Manager\Question\QuestionManager;
use UJM\ExoBundle\Repository\PaperRepository;
use UJM\ExoBundle\Serializer\Attempt\PaperSerializer;

/**
 * @DI\Service("ujm_exo.manager.paper")
 */
class PaperManager
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var PaperRepository
     */
    private $repository;

    /**
     * @var EventDispatcherInterface
     */
    private $eventDispatcher;

    /**
     * @var PaperSerializer
     */
    private $serializer;

    /**
     * @var QuestionManager
     */
    private $questionManager;

    /**
     * PaperManager constructor.
     *
     * @DI\InjectParams({
     *     "om"              = @DI\Inject("claroline.persistence.object_manager"),
     *     "eventDispatcher" = @DI\Inject("event_dispatcher"),
     *     "serializer"      = @DI\Inject("ujm_exo.serializer.paper"),
     *     "questionManager" = @DI\Inject("ujm_exo.manager.question")
     * })
     *
     * @param ObjectManager            $om
     * @param EventDispatcherInterface $eventDispatcher
     * @param PaperSerializer          $serializer
     * @param QuestionManager          $questionManager
     */
    public function __construct(
        ObjectManager $om,
        EventDispatcherInterface $eventDispatcher,
        PaperSerializer $serializer,
        QuestionManager $questionManager)
    {
        $this->om = $om;
        $this->repository = $om->getRepository('UJMExoBundle:Attempt\Paper');
        $this->eventDispatcher = $eventDispatcher;
        $this->serializer = $serializer;
        $this->questionManager = $questionManager;
    }

    /**
     * Exports a user paper.
     * NB: This method only returns the paper object, if you also need the list of questions, see `exportWithQuestions`.
     *
     * @param Paper $paper
     * @param array $options
     *
     * @return \stdClass
     */
    public function export(Paper $paper, array $options = [])
    {
        // Adds user score if available and the method options do not already request it
        if (!in_array(Transfer::INCLUDE_USER_SCORE, $options)
            && $this->isScoreAvailable($paper->getExercise(), $paper)) {
            $options[] = Transfer::INCLUDE_USER_SCORE;
        }

        return $this->serializer->serialize($paper, $options);
    }

    /**
     * Export a user paper and the list of questions used for the attempt.
     * The question list is needed to display a paper to user or to play an attempt.
     *
     * @param Paper $paper
     * @param array $options
     *
     * @return array
     */
    public function exportWithQuestions(Paper $paper, array $options = [])
    {
        // Adds solutions if available and the method options do not already request it
        if (!in_array(Transfer::INCLUDE_SOLUTIONS, $options)
            && $this->isSolutionAvailable($paper->getExercise(), $paper)) {
            $options[] = Transfer::INCLUDE_SOLUTIONS;
        }

        return [
            'paper' => $this->serializer->serialize($paper, $options),
            'questions' => array_map(function (Question $question) use ($options) {
                return $this->questionManager->export($question, $options);
            }, $this->getQuestions($paper)),
        ];
    }

    /**
     * Gets the list of questions picked for the paper.
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
        $ids = explode(';', substr($paper->getStructure(), 0, -1));

        $questions = [];
        foreach ($ids as $id) {
            $question = $this->om->getRepository('UJMExoBundle:Question\Question')->find($id);
            if ($question) {
                $questions[] = $question;
            }
        }

        return $questions;
    }

    /**
     * @deprecated this needs to be moved in the attempt manager or elsewhere
     *
     * @param Question $question
     * @param Paper    $paper
     * @param int      $score
     */
    public function recordScore(Question $question, Paper $paper, $score)
    {
        /** @var Answer $response */
        $response = $this->om->getRepository('UJMExoBundle:Attempt\Answer')
            ->findOneBy(['paper' => $paper, 'question' => $question]);

        $response->setScore($score);

        // TODO : Apply penalties to the score

        $scorePaper = $paper->getScore();
        $scoreExercise = $scorePaper + $response->getScore();
        $paper->setScore($scoreExercise);

        $this->om->persist($paper);
        $this->om->persist($response);
        $this->om->flush();

        $this->checkPaperEvaluated($paper);
    }

    /**
     * Check if a Paper is full evaluated and dispatch a Log event if yes.
     *
     * @param Paper $paper
     *
     * @return bool
     */
    public function checkPaperEvaluated(Paper $paper)
    {
        $fullyEvaluated = $this->repository->isFullyEvaluated($paper);
        if ($fullyEvaluated) {
            $event = new LogExerciseEvaluatedEvent($paper->getExercise(), [
                'result' => $paper->getScore(),
                'resultMax' => $this->calculateTotal($paper),
            ]);

            $this->eventDispatcher->dispatch('log', $event);
        }

        return $fullyEvaluated;
    }

    /**
     * Calculates the score of a Paper.
     *
     * @param Paper $paper
     * @param float $base
     *
     * @return float
     */
    public function calculateScore(Paper $paper, $base = null)
    {
        $score = $this->repository->findScore($paper);
        if (!empty($base)) {
            $scoreTotal = $this->calculateTotal($paper);
            if ($scoreTotal !== $base) {
                $score = ($score / $scoreTotal) * $base;
            }
        }

        return $score;
    }

    /**
     * Calculates the total score of a Paper.
     *
     * @param Paper $paper
     *
     * @return float
     */
    public function calculateTotal(Paper $paper)
    {
        $total = 0;

        $questions = $this->getQuestions($paper);
        foreach ($questions as $question) {
            $total += $this->questionManager->calculateTotal($question);
        }

        return $total;
    }

    /**
     * Returns the papers for a given exercise, in a JSON format.
     *
     * @param Exercise $exercise
     * @param User     $user
     *
     * @return array
     */
    public function exportExercisePapers(Exercise $exercise, User $user = null)
    {
        if (!empty($user)) {
            // Load papers for of a singe user
            $papers = $this->repository->findBy([
                'exercise' => $exercise,
                'user' => $user,
            ]);
        } else {
            // Load all papers submitted for the exercise
            $papers = $this->repository->findBy([
                'exercise' => $exercise,
            ]);
        }

        $questions = [];
        foreach ($papers as $paper) {
            $paperQuestions = $this->getQuestions($paper);

            $questions = array_merge($questions, $paperQuestions);
            $questions = array_unique($questions); // Remove duplicated questions
        }

        return [
            'papers' => array_map(function (Paper $paper) {
                return $this->export($paper);
            }, $papers),
            'questions' => array_map(function (Question $question) {
                return $this->questionManager->export($question);
            }, $questions),
        ];
    }

    /**
     * Deletes all the papers associated with an exercise.
     *
     * @param Exercise $exercise
     *
     * @throws ValidationException if the exercise has been published at least once
     */
    public function deleteAll(Exercise $exercise)
    {
        if ($exercise->wasPublishedOnce()) {
            throw new ValidationException('Papers cannot be deleted', [[
                'path' => '',
                'message' => 'exercise has been published once.',
            ]]);
        }

        $papers = $this->repository->findBy([
            'exercise' => $exercise,
        ]);

        foreach ($papers as $paper) {
            $this->om->remove($paper);
        }

        $this->om->flush();
    }

    /**
     * Deletes a paper.
     *
     * @param Paper $paper
     *
     * @throws ValidationException if the exercise has been published at least once
     */
    public function delete(Paper $paper)
    {
        if ($paper->getExercise()->wasPublishedOnce()) {
            // Question is used, we can't delete it
            throw new ValidationException('Paper can not be deleted', [[
                'path' => '',
                'message' => 'exercise has been published once.',
            ]]);
        }

        $this->om->remove($paper);
        $this->om->flush();
    }

    /**
     * Returns the number of finished papers already done by the user for a given exercise.
     *
     * @param Exercise $exercise
     * @param User     $user
     *
     * @return array
     */
    public function countUserFinishedPapers(Exercise $exercise, User $user)
    {
        return $this->repository->countUserFinishedPapers($exercise, $user);
    }

    /**
     * Returns the number of papers already done for a given exercise.
     *
     * @param Exercise $exercise
     *
     * @return array
     */
    public function countExercisePapers(Exercise $exercise)
    {
        return $this->repository->countExercisePapers($exercise);
    }

    /**
     * Check if the solution of the Paper is available to User.
     *
     * @param Exercise $exercise
     * @param Paper    $paper
     *
     * @return bool
     */
    public function isSolutionAvailable(Exercise $exercise, Paper $paper)
    {
        $correctionMode = $exercise->getCorrectionMode();
        switch ($correctionMode) {
            case CorrectionMode::AFTER_END:
                $available = !empty($paper->getEnd());
                break;

            case CorrectionMode::AFTER_LAST_ATTEMPT:
                $available = 0 === $exercise->getMaxAttempts() || $paper->getNumber() === $exercise->getMaxAttempts();
                break;

            case CorrectionMode::AFTER_DATE:
                $now = new \DateTime();
                $available = empty($exercise->getDateCorrection()) || $now >= $exercise->getDateCorrection();
                break;

            case CorrectionMode::NEVER:
            default:
                $available = false;
                break;
        }

        return $available;
    }

    /**
     * Check if the score of the Paper is available to User.
     *
     * @param Exercise $exercise
     * @param Paper    $paper
     *
     * @return bool
     */
    public function isScoreAvailable(Exercise $exercise, Paper $paper)
    {
        $markMode = $exercise->getMarkMode();
        switch ($markMode) {
            case MarkMode::AFTER_END:
                $available = !empty($paper->getEnd());
                break;
            case MarkMode::NEVER:
                $available = false;
                break;
            case MarkMode::WITH_CORRECTION:
            default:
                $available = $this->isSolutionAvailable($exercise, $paper);
                break;
        }

        return $available;
    }
}
