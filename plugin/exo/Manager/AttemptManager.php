<?php

namespace UJM\ExoBundle\Manager;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Entity\Attempt\Paper;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Question\Question;
use UJM\ExoBundle\Library\Validator\ValidationException;
use UJM\ExoBundle\Serializer\Answer\AnswerSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Answer\AnswerValidator;

/**
 * @DI\Service("ujm_exo.manager.exercise")
 */
class AttemptManager
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var AnswerValidator
     */
    private $answerValidator;

    /**
     * @var AnswerSerializer
     */
    private $answerSerializer;

    /**
     * @var PaperManager
     */
    private $paperManager;

    /**
     * AttemptManager constructor.
     *
     * @DI\InjectParams({
     *     "om"               = @DI\Inject("claroline.persistence.object_manager"),
     *     "answerValidator"  = @DI\Inject("ujm_exo.validator.answer"),
     *     "answerSerializer" = @DI\Inject("ujm_exo.serializer.answer"),
     *     "paperManager"     = @DI\Inject("ujm_exo.manager.paper")
     * })
     *
     * @param ObjectManager    $om
     * @param AnswerValidator  $answerValidator
     * @param AnswerSerializer $answerSerializer
     * @param PaperManager     $paperManager
     */
    public function __construct(
        ObjectManager $om,
        AnswerValidator $answerValidator,
        AnswerSerializer $answerSerializer,
        PaperManager $paperManager)
    {
        $this->om = $om;
        $this->answerValidator = $answerValidator;
        $this->answerSerializer = $answerSerializer;
        $this->paperManager = $paperManager;
    }

    /**
     * Checks an user is allowed to pass a quiz.
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

    public function submit(Paper $paper, \stdClass $answer)
    {
        // Validate received data
        $errors = $this->answerValidator->validate($answer);
        if (count($errors) > 0) {
            throw new ValidationException('Answer is not valid', $errors);
        }
    }

    /**
     * Records or updates an answer for a given question and paper.
     *
     * @param Paper    $paper
     * @param Question $question
     * @param mixed    $data
     * @param string   $ip
     */
    public function recordAnswer(Paper $paper, Question $question, $data, $ip)
    {
        $handler = $this->handlerCollector->getHandlerForInteractionType($question->getType());

        $answer = $this->om->getRepository('UJMExoBundle:Attempt\Answer')
            ->findOneBy(['paper' => $paper, 'question' => $question]);

        if (!$answer) {
            $answer = new Answer();
            $answer->setPaper($paper);
            $answer->setQuestion($question);
            $answer->setIp($ip);
        } else {
            $answer->setNbTries($answer->getNbTries() + 1);
        }

        $handler->storeAnswerAndMark($question, $answer, $data);
        if (-1 !== $answer->getScore()) {
            // Only apply penalties if the answer has been marked
            $this->applyPenalties($paper, $question, $answer);
        }

        $this->om->persist($answer);
        $this->om->flush();
    }
}
