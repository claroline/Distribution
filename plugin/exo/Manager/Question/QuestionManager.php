<?php

namespace UJM\ExoBundle\Manager\Question;

use Claroline\CoreBundle\Entity\User;
use Doctrine\Common\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Question\Question;
use UJM\ExoBundle\Library\Attempt\CorrectedAnswer;
use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Question\QuestionDefinitionsCollection;
use UJM\ExoBundle\Library\Validator\ValidationException;
use UJM\ExoBundle\Manager\Attempt\ScoreManager;
use UJM\ExoBundle\Repository\AnswerRepository;
use UJM\ExoBundle\Repository\QuestionRepository;
use UJM\ExoBundle\Serializer\Question\HintSerializer;
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
     * @var ScoreManager
     */
    private $scoreManager;

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
     * @var AnswerRepository
     */
    private $answerRepository;

    /**
     * @var QuestionDefinitionsCollection
     */
    private $questionDefinitions;

    /**
     * @var HintSerializer
     */
    private $hintSerializer;

    /**
     * QuestionManager constructor.
     *
     * @DI\InjectParams({
     *     "om"                  = @DI\Inject("claroline.persistence.object_manager"),
     *     "scoreManager"        = @DI\Inject("ujm_exo.manager.score"),
     *     "validator"           = @DI\Inject("ujm_exo.validator.question"),
     *     "serializer"          = @DI\Inject("ujm_exo.serializer.question"),
     *     "questionDefinitions" = @DI\Inject("ujm_exo.collection.question_definitions"),
     *     "hintSerializer"      = @DI\Inject("ujm_exo.serializer.hint")
     * })
     *
     * @param ObjectManager                 $om
     * @param ScoreManager                  $scoreManager
     * @param QuestionValidator             $validator
     * @param QuestionSerializer            $serializer
     * @param QuestionDefinitionsCollection $questionDefinitions
     * @param HintSerializer                $hintSerializer
     */
    public function __construct(
        ObjectManager $om,
        ScoreManager $scoreManager,
        QuestionValidator $validator,
        QuestionSerializer $serializer,
        QuestionDefinitionsCollection $questionDefinitions,
        HintSerializer $hintSerializer
    ) {
        $this->om = $om;
        $this->scoreManager = $scoreManager;
        $this->repository = $this->om->getRepository('UJMExoBundle:Question\Question');
        $this->answerRepository = $this->om->getRepository('UJMExoBundle:Attempt\Answer');
        $this->validator = $validator;
        $this->serializer = $serializer;
        $this->questionDefinitions = $questionDefinitions;
        $this->hintSerializer = $hintSerializer;
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
     * @param \stdClass $questionData
     * @param Answer    $answer
     *
     * @return float
     */
    public function calculateScore(\stdClass $questionData, Answer $answer)
    {
        // Get entities for score calculation
        $question = $this->serializer->deserialize($questionData);

        // Let the question correct the answer
        $definition = $this->questionDefinitions->get($question->getMimeType());
        $corrected = $definition->correctAnswer($question->getInteraction(), json_decode($answer->getData()));
        if (!$corrected instanceof CorrectedAnswer) {
            $corrected = new CorrectedAnswer();
        }

        // Add hints
        foreach ($answer->getUsedHints() as $hintId) {
            // Get hint definition from question data
            $hint = null;
            foreach ($questionData->hints as $questionHint) {
                if ($hintId === $questionHint->id) {
                    $hint = $questionHint;
                    break;
                }
            }
            $corrected->addPenalty(
                $this->hintSerializer->deserialize($hint)
            );
        }

        return $this->scoreManager->calculate(json_decode($question->getScoreRule()), $corrected);
    }

    /**
     * Calculates the total score of a question.
     *
     * @param \stdClass $questionData
     *
     * @return float
     */
    public function calculateTotal(\stdClass $questionData)
    {
        // Get entities for score calculation
        $question = $this->serializer->deserialize($questionData);

        // Get the expected answer for the question
        $definition = $this->questionDefinitions->get($question->getMimeType());
        $expected = $definition->expectAnswer($question->getInteraction());

        return $this->scoreManager->calculateTotal(json_decode($question->getScoreRule()), $expected);
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
        $answers = $this->answerRepository->findByQuestion($question, $exercise);

        // Number of Users that have seen the question
        $questionStats->seen = count($answers);

        // Grab answer data to pass it decoded to the question type
        // it doesn't need to know the whole Answer object
        $answersData = [];

        // Number of Users that have responded to the question (no blank answer)
        $questionStats->answered = 0;
        if (!empty($answers)) {
            for ($i = 0; $i < $questionStats->seen; ++$i) {
                $answer = $answers[$i];
                if (!empty($answer->getData())) {
                    ++$questionStats->answered;

                    $answersData[] = json_decode($answer->getData());
                }
            }

            // Let the handler of the question type parse and compile the data
            $definition = $this->questionDefinitions->get($question->getMimeType());
            $questionStats->solutions = $definition->getStatistics($question->getInteraction(), $answersData);
        }

        return $questionStats;
    }
}
