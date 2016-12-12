<?php

namespace UJM\ExoBundle\Manager;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Entity\Attempt\Paper;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Question\Hint;
use UJM\ExoBundle\Library\Attempt\PaperGenerator;
use UJM\ExoBundle\Library\Validator\ValidationException;
use UJM\ExoBundle\Manager\Attempt\AnswerManager;
use UJM\ExoBundle\Manager\Attempt\PaperManager;
use UJM\ExoBundle\Manager\Question\QuestionManager;
use UJM\ExoBundle\Repository\PaperRepository;

/**
 * AttemptManager provides methods to manage user attempts to exercises.
 *
 * @DI\Service("ujm_exo.manager.attempt")
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
     * @var QuestionManager
     */
    private $questionManager;

    /**
     * AttemptManager constructor.
     *
     * @DI\InjectParams({
     *     "om"              = @DI\Inject("claroline.persistence.object_manager"),
     *     "paperManager"    = @DI\Inject("ujm_exo.manager.paper"),
     *     "answerManager"   = @DI\Inject("ujm_exo.manager.answer"),
     *     "questionManager" = @DI\Inject("ujm_exo.manager.question")
     * })
     *
     * @param ObjectManager   $om
     * @param PaperManager    $paperManager
     * @param AnswerManager   $answerManager
     * @param QuestionManager $questionManager
     */
    public function __construct(
        ObjectManager $om,
        PaperManager $paperManager,
        AnswerManager $answerManager,
        QuestionManager $questionManager)
    {
        $this->om = $om;
        $this->paperManager = $paperManager;
        $this->paperRepository = $this->om->getRepository('UJMExoBundle:Attempt\Paper');
        $this->answerManager = $answerManager;
        $this->questionManager = $questionManager;
    }

    /**
     * Checks if a user is allowed to pass a quiz or not.
     *
     * Based on the maximum attempt allowed and the number of already done by the user.
     *
     * @param Exercise $exercise
     * @param User     $user
     *
     * @return bool
     */
    public function canPass(Exercise $exercise, User $user = null)
    {
        $canPass = true;
        if ($user) {
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
     * @param User  $user
     *
     * @return bool
     */
    public function canUpdate(Paper $paper, User $user = null)
    {
        return empty($paper->getEnd())
            && $user === $paper->getUser();
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
        if (null !== $user) {
            // If it's not an anonymous, load the previous unfinished papers
            $papers = $this->paperRepository->findUnfinishedPapers($exercise, $user);
        }

        if (empty($papers)) {
            // Create a new paper for anonymous or if no unfinished
            $paper = PaperGenerator::create($exercise, $user);
        } else {
            if (!$exercise->isInterruptible()) {
                // User is not allowed to continue is previous paper => close the previous and open a new one
                $this->end($papers[0], false);

                $paper = PaperGenerator::create($exercise, $user, $papers[0]);
            } else {
                // User can continue his previous paper
                $paper = $papers[0];
            }
        }

        $this->om->persist($paper);
        $this->om->flush();

        return $paper;
    }

    /**
     * Submits user answers to a paper.
     *
     * @param Paper       $paper
     * @param \stdClass[] $answers
     * @param string      $clientIp
     *
     * @throws ValidationException - if there is any invalid answer
     *
     * @return Answer[]
     */
    public function submit(Paper $paper, array $answers, $clientIp)
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
            $score = $this->questionManager->calculateScore($answer->getQuestion(), $answer);
            $answer->setScore($score);
            $answer->setIp($clientIp);

            $paper->addAnswer($answer);
            $submitted[] = $answer;
        }

        $this->om->persist($paper);
        $this->om->endFlushSuite();

        return $submitted;
    }

    /**
     * Ends a user paper.
     * Sets the end date of the paper and calculates its score.
     *
     * @param Paper $paper
     * @param bool  $finished
     */
    public function end(Paper $paper, $finished = true)
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

    /**
     * Flags an hint has used in the user paper and returns the hint content.
     *
     * @param Paper  $paper
     * @param Hint   $hint
     * @param string $clientIp
     *
     * @return mixed
     */
    public function useHint(Paper $paper, Hint $hint, $clientIp)
    {
        if (!$this->paperRepository->hasHint($paper, $hint)) {
            // Hint is not related to a question of the current attempt
            throw new \LogicException("Hint {$hint->getId()} and paper {$paper->getId()} are not related");
        }

        // Retrieve or create the answer for the question
        $answer = $paper->getAnswer($hint->getQuestion()->getUuid());
        if (empty($answer)) {
            $answer = new Answer();
            $answer->setTries(0); // Using an hint is not a try. This will be updated when user will submit his answer
            $answer->setQuestion($hint->getQuestion());
            $answer->setIp($clientIp);

            // Link the new answer to the paper
            $paper->addAnswer($answer);
        }

        $score = $this->questionManager->calculateScore($answer->getQuestion(), $answer);
        $answer->addUsedHint($hint);
        $answer->setScore($score);

        $this->om->persist($answer);
        $this->om->flush();

        // TODO : this needs to be properly exported as it can also include a ResourceNode
        // We need to return an encoded Content
        return $hint->getData();
    }
}
