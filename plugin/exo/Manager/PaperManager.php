<?php

namespace UJM\ExoBundle\Manager;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Attempt\Paper;
use UJM\ExoBundle\Entity\Question\Question;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Entity\StepQuestion;
use UJM\ExoBundle\Event\Log\LogExerciseEvaluatedEvent;
use UJM\ExoBundle\Library\Mode\CorrectionMode;
use UJM\ExoBundle\Library\Mode\MarkMode;
use UJM\ExoBundle\Manager\Question\QuestionManager;
use UJM\ExoBundle\Repository\PaperRepository;

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
     * @var EventDispatcherInterface
     */
    private $eventDispatcher;

    /**
     * @var QuestionManager
     */
    private $questionManager;

    /**
     * @DI\InjectParams({
     *     "om"              = @DI\Inject("claroline.persistence.object_manager"),
     *     "eventDispatcher" = @DI\Inject("event_dispatcher"),
     *     "questionManager" = @DI\Inject("ujm_exo.manager.question")
     * })
     *
     * @param ObjectManager            $om
     * @param EventDispatcherInterface $eventDispatcher
     * @param QuestionManager          $questionManager
     */
    public function __construct(
        ObjectManager $om,
        EventDispatcherInterface $eventDispatcher,
        QuestionManager $questionManager) {
        $this->om = $om;
        $this->eventDispatcher = $eventDispatcher;
        $this->questionManager = $questionManager;
    }

    public function export(Paper $paper, array $options = [])
    {
        return $this->serializer->serialize($paper, $options);
    }

    /**
     * Returns the JSON representation of an exercise with its last associated paper
     * for a given user. If no paper exists, a new one is created.
     *
     * @param Exercise $exercise
     * @param User     $user
     *
     * @return Paper
     */
    public function openPaper(Exercise $exercise, User $user = null)
    {
        $papers = [];
        if ($user) {
            // If it's not an anonymous, load the previous unfinished papers
            $papers = $this->om->getRepository('UJMExoBundle:Attempt\Paper')->findUnfinishedPapers($user, $exercise);
        }

        if (count($papers) === 0) {
            // Create a new paper for anonymous or if no unfinished
            $paper = $this->createPaper($exercise, $user);
        } else {
            if (!$exercise->getDispButtonInterrupt()) {
                // User is not allowed to continue is previous paper => open a new one and close the previous
                $this->closePaper($papers[0]);

                $paper = $this->createPaper($exercise, $user);
            } else {
                $paper = $papers[0];
            }
        }

        return $paper;
    }

    /**
     * Creates a new exercise paper for a given user.
     *
     * @param Exercise $exercise
     * @param User     $user
     *
     * @return Paper
     */
    public function createPaper(Exercise $exercise, User $user = null)
    {
        // Get the number of the new Paper
        $paperNum = 1;
        if ($user) {
            $lastPaper = $this->om->getRepository('UJMExoBundle:Attempt\Paper')->findOneBy(
                ['user' => $user, 'exercise' => $exercise],
                ['start' => 'DESC']
            );

            if ($lastPaper) {
                $paperNum = $lastPaper->getNumber() + 1;
            }
        }

        // Generate the list of Steps and Questions for the Paper
        $order = '';
        if (!empty($lastPaper) && $exercise->getKeepSteps()) {
            // Get steps order from the last user Paper
            $order = $lastPaper->getOrdreQuestion();
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
        $paper->setOrdreQuestion($order);
        $paper->setAnonymous($exercise->getAnonymous());

        $this->om->persist($paper);
        $this->om->flush();

        return $paper;
    }

    /**
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

        // Apply penalties to the score
        $this->applyPenalties($paper, $question, $response);

        $scorePaper = $paper->getScore();
        $scoreExercise = $scorePaper + $response->getScore();
        $paper->setScore($scoreExercise);

        $this->om->persist($paper);
        $this->om->persist($response);
        $this->om->flush();

        $this->checkPaperEvaluated($paper);
    }

    /**
     * Terminates a user paper.
     *
     * @param Paper $paper
     */
    public function finishPaper(Paper $paper)
    {
        if (!$paper->getEnd()) {
            $paper->setEnd(new \DateTime());
        }

        $paper->setInterrupted(false);
        $paper->setScore($this->calculateScore($paper));

        $this->om->flush();

        $this->checkPaperEvaluated($paper);
    }

    /**
     * Close a Paper that is not finished (because the Exercise does not allow interruption).
     *
     * @param Paper $paper
     */
    public function closePaper(Paper $paper)
    {
        if (!$paper->getEnd()) {
            $paper->setEnd(new \DateTime());
        }

        $paper->setInterrupted(true); // keep track that the user has not finished
        $paper->setScore($this->calculateScore($paper));

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
        /** @var PaperRepository $repo */
        $repo = $this->om->getRepository('UJMExoBundle:Attempt\Paper');

        $fullyEvaluated = $repo->isFullyEvaluated($paper);
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
        /** @var PaperRepository $repo */
        $repo = $this->om->getRepository('UJMExoBundle:Attempt\Paper');

        $score = $repo->findScore($paper);
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

        return 10;
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
        $isAdmin = true;
        $search = [
            'exercise' => $exercise,
        ];

        if (!empty($user)) {
            // Load papers for a single non admin User
            $isAdmin = false;
            $search['user'] = $user;
        }

        $papers = $this->om->getRepository('UJMExoBundle:Attempt\Paper')
            ->findBy($search);

        $exportPapers = [];
        $exportQuestions = [];
        foreach ($papers as $paper) {
            $exportPapers[] = $this->exportPaper($paper, $isAdmin);

            $paperQuestions = new \stdClass();
            $paperQuestions->paperId = $paper->getId();
            $paperQuestions->questions = $this->exportPaperQuestions($paper, $isAdmin, true);

            $exportQuestions[] = $paperQuestions;
        }

        return [
            'papers' => $exportPapers,
            'questions' => $exportQuestions,
        ];
    }

    /**
     * Returns one specific paper details.
     *
     * @param Paper $paper
     * @param bool  $withScore If true, the score will be exported even if it's not available (for Admins)
     *
     * @return array
     */
    public function exportPaper(Paper $paper, $withScore = false)
    {
        $scoreAvailable = $withScore || $this->isScoreAvailable($paper->getExercise(), $paper);

        $_paper = [
            'id' => $paper->getId(),
            'number' => $paper->getNumber(),
            'user' => $this->showUserPaper($paper),
            'start' => $paper->getStart()->format('Y-m-d\TH:i:s'),
            'end' => $paper->getEnd() ? $paper->getEnd()->format('Y-m-d\TH:i:s') : null,
            'interrupted' => $paper->isInterrupted(),
            'score' => $scoreAvailable ? $paper->getScore() : null,
            'order' => $this->getStepsQuestions($paper),
            'questions' => $this->exportPaperAnswers($paper, $scoreAvailable),
        ];

        return $_paper;
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
        return $this->om->getRepository('UJMExoBundle:Attempt\Paper')
            ->countUserFinishedPapers($exercise, $user);
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
        return $this->om->getRepository('UJMExoBundle:Attempt\Paper')
            ->countExercisePapers($exercise);
    }

    /**
     * Export the Questions linked to the Paper.
     *
     * @param Paper $paper
     * @param bool  $withSolution
     * @param bool  $forPaperList
     *
     * @return array
     */
    public function exportPaperQuestions(Paper $paper, $withSolution = false, $forPaperList = false)
    {
        $solutionAvailable = $withSolution || $this->isSolutionAvailable($paper->getExercise(), $paper);

        $export = [];
        $questions = $this->getPaperQuestions($paper);
        foreach ($questions as $question) {
            $exportedQuestion = $this->questionManager->exportQuestion($question, $solutionAvailable, $forPaperList);

            $exportedQuestion->stats = null;
            if ($paper->getExercise()->hasStatistics()) {
                $exportedQuestion->stats = $this->questionManager->generateQuestionStats($question, $paper->getExercise());
            }

            $export[] = $exportedQuestion;
        }

        return $export;
    }

    /**
     * Export submitted answers for each Question of the Paper.
     *
     * @param Paper $paper
     * @param bool  $withScore Do we need to export the score of the Paper ?
     *
     * @return array
     */
    public function exportPaperAnswers(Paper $paper, $withScore = false)
    {
        $questions = $this->getPaperQuestions($paper);
        $paperQuestions = [];

        foreach ($questions as $question) {
            $paperQuestion = $this->exportPaperAnswer($question, $paper, $withScore);
            if (!empty($paperQuestion)) {
                $paperQuestions[] = $paperQuestion;
            }
        }

        return $paperQuestions;
    }

    /**
     * Get the Questions linked to a Paper.
     *
     * @param Paper $paper
     *
     * @return Question[]
     */
    private function getPaperQuestions(Paper $paper)
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
     * Returns array of array with the indexes "step" and "question".
     *
     * @param Paper $paper
     *
     * @return array
     */
    public function getStepsQuestions(Paper $paper)
    {
        $questions = $this->getPaperQuestions($paper);
        $exercise = $paper->getExercise();

        // to keep the questions order
        $deleted = []; // Questions not linked to the exercise anymore
        $stepsQuestions = []; // Questions linked to a Step of the Exercise (the keys are the step IDs)
        foreach ($questions as $question) {
            // Check if the question is attached to a Step

            /** @var StepQuestion $stepQuestion */
            $stepQuestion = $this->om->getRepository('UJMExoBundle:StepQuestion')->findByExerciseAndQuestion($exercise, $question);
            if ($stepQuestion) {
                // Question linked to a Step
                $step = $stepQuestion->getStep();
                if (!isset($stepsQuestions[$step->getId()])) {
                    $stepsQuestions[$step->getId()] = [
                        'id' => $step->getId(),
                        'items' => [],
                    ];
                }

                $stepsQuestions[$step->getId()]['items'][] = $question->getId();
            } else {
                $deleted[] = $question->getId();
            }
        }

        // Remove step ids indexes to avoid receiving an array with undefined values in JS
        $steps = array_values($stepsQuestions);

        // Append deleted questions at the end of the Exercise
        if (!empty($deleted)) {
            $steps[] = [
                'id' => 'deleted',
                'items' => $deleted,
            ];
        }

        return $steps;
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

    /**
     * Returns a question list according to the *shuffle* and
     * *nbQuestions* parameters of an exercise, i.e. filtered
     * and/or randomized if needed.
     *
     * @param Exercise $exercise
     *
     * @return array
     */
    public function pickQuestions(Exercise $exercise)
    {
        $finalQuestions = [];

        $steps = $this->pickSteps($exercise);
        foreach ($steps as $step) {
            $finalQuestions = array_merge($finalQuestions, $step->getQuestions());
        }

        return $finalQuestions;
    }

    /**
     * Returns a step list according to the *shuffle* and
     * nbStep* parameters of an exercise, i.e. filtered
     * and/or randomized if needed.
     *
     * @param Exercise $exercise
     *
     * @return array
     */
    public function pickSteps(Exercise $exercise)
    {
        $steps = $exercise->getSteps()->toArray();

        if ($exercise->getShuffle()) {
            shuffle($steps);
        }

        if (($stepToPick = $exercise->getPickSteps()) > 0) {
            $steps = $this->pickItem($stepToPick, $steps);
        }

        return $steps;
    }

    /**
     * Returns item (step or question) list according to the *shuffle* and
     * *nbItem* parameters of an exercise or a step, i.e. filtered
     * and/or randomized if needed.
     *
     * @param int   $itemToPick
     * @param array $listItem   array of steps or array of question
     *
     * @return array
     */
    private function pickItem($itemToPick, array $listItem)
    {
        $newListItem = [];
        while ($itemToPick > 0) {
            $index = rand(0, count($listItem) - 1);
            $newListItem[] = $listItem[$index];
            unset($listItem[$index]);
            $listItem = array_values($listItem); // "re-index" the array
            --$itemToPick;
        }

        return $newListItem;
    }
}
