<?php

namespace UJM\ExoBundle\Manager\Question;

use Claroline\CoreBundle\Entity\User;
use Doctrine\Common\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Question\Question;
use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Validator\ValidationException;
use UJM\ExoBundle\Repository\QuestionRepository;
use UJM\ExoBundle\Serializer\Question\QuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Question\QuestionValidator;

/**
 * @DI\Service("ujm_exo.manager.question")
 */
class QuestionManager
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var QuestionRepository
     */
    private $repository;

    /**
     * @var QuestionValidator
     */
    private $validator;

    /**
     * @var QuestionSerializer
     */
    private $serializer;

    /**
     * QuestionManager constructor.
     *
     * @DI\InjectParams({
     *     "om"           = @DI\Inject("claroline.persistence.object_manager"),
     *     "validator"    = @DI\Inject("ujm_exo.validator.question"),
     *     "serializer"   = @DI\Inject("ujm_exo.serializer.question")
     * })
     *
     * @param ObjectManager      $om
     * @param QuestionValidator  $validator
     * @param QuestionSerializer $serializer
     */
    public function __construct(
        ObjectManager $om,
        QuestionValidator $validator,
        QuestionSerializer $serializer
    ) {
        $this->om = $om;
        $this->repository = $this->om->getRepository('UJMExoBundle:Question\Question');
        $this->validator = $validator;
        $this->serializer = $serializer;
    }

    /**
     * Searches questions for a User.
     *
     * @param User  $user
     * @param array $filters
     * @param int   $page
     * @param int   $number
     * @param array $orderBy
     *
     * @return array
     */
    public function search(User $user, array $filters = [], $page = 0, $number = -1, array $orderBy = [])
    {
        return [
            'questions' => $this->repository->search($user, $filters, $page, $number, $orderBy),
            'total' => 100,
        ];
    }

    /**
     * Validates and creates a new Question from raw data.
     *
     * @param \stdClass $data
     *
     * @return Question
     *
     * @throws ValidationException
     */
    public function create(\stdClass $data)
    {
        return $this->update(new Question(), $data);
    }

    /**
     * Validates and updates a Question entity with raw data.
     *
     * @param Question  $question
     * @param \stdClass $data
     *
     * @return Question
     *
     * @throws ValidationException
     */
    public function update(Question $question, \stdClass $data)
    {
        // Validate received data
        $errors = $this->validator->validate($data, [Validation::REQUIRE_SOLUTIONS]);
        if (count($errors) > 0) {
            throw new ValidationException('Question is not valid', $errors);
        }

        // Update Question with new data
        $this->serializer->deserialize($data, $question);

        // Save to DB
        $this->om->persist($question);
        $this->om->flush();

        return $question;
    }

    /**
     * Exports a question.
     *
     * @param Question $question
     * @param array    $options
     *
     * @return \stdClass
     */
    public function export(Question $question, array $options = [])
    {
        return $this->serializer->serialize($question, $options);
    }

    /**
     * Deletes a Question.
     * It's only possible if the Question is not used in an Exercise.
     *
     * @param Question $question
     *
     * @throws ValidationException
     */
    public function delete(Question $question)
    {
        $exercises = $this->repository->findUsedBy($question);
        if (count($exercises) > 0) {
            // Question is used, we can't delete it
            throw new ValidationException('Question can not be deleted', [
                'path' => '',
                'message' => "Question {$question->getUuid()} is linked to exercises.",
            ]);
        }

        $this->om->remove($question);
        $this->om->flush();
    }

    /**
     * Calculates the score of an answer to a question.
     *
     * @param Question $question
     * @param mixed    $answer
     *
     * @return float
     */
    public function calculateScore(Question $question, $answer)
    {
        // TODO : implement

        return 0;
    }

    /**
     * Calculates the total score of a question.
     *
     * @param Question $question
     *
     * @return float
     */
    public function calculateTotal(Question $question)
    {
        // TODO : implement

        return 0;
    }

    /**
     * Get question statistics inside an Exercise.
     *
     * @param Question $question
     * @param Exercise $exercise
     *
     * @return \stdClass
     */
    public function getStatistics(Question $question, Exercise $exercise = null)
    {
        $questionStats = new \stdClass();

        // We load all the answers for the question (we need to get the entities as the response in DB are not processable as is)
        $answers = $this->om->getRepository('UJMExoBundle:Attempt\Answer')->findByExerciseAndQuestion($exercise, $question);

        // Number of Users that have seen the question in their exercise
        $questionStats->seen = count($answers);

        // Number of Users that have responded to the question (no blank answer)
        $questionStats->answered = 0;
        if (!empty($answers)) {
            for ($i = 0; $i < $questionStats->seen; ++$i) {
                /* @var Answer $answer */
                $answer = $answer[$i];
                if (!empty($answer->getData())) {
                    ++$questionStats->answered;
                } else {
                    // Remove element (to avoid processing in custom handlers)
                    unset($answer);
                }
            }

            // Let the Handler of the question type parse and compile the data
            $handler = $this->handlerCollector->getHandlerForInteractionType($question->getType());
            $questionStats->solutions = $handler->generateStats($question, $answers);
        }

        return $questionStats;
    }
}
