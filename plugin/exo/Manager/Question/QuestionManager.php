<?php

namespace UJM\ExoBundle\Manager\Question;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\ResourceManager;
use Doctrine\Common\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Question;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Manager\HintManager;
use UJM\ExoBundle\Repository\QuestionRepository;
use UJM\ExoBundle\Serializer\Question\QuestionSerializer;
use UJM\ExoBundle\Transfer\Json\QuestionHandlerCollector;
use UJM\ExoBundle\Library\Validator\ValidationException;
use UJM\ExoBundle\Validator\JsonSchema\Question\QuestionValidator;

/**
 * @DI\Service("ujm.exo.question_manager")
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
     * @var UrlGeneratorInterface
     *
     * @deprecated only used by deprecated method exportQuestion()
     */
    private $router;

    /**
     * @var ResourceManager
     *
     * @deprecated only used by deprecated method exportQuestion()
     */
    private $rm;

    /**
     * @var QuestionValidator
     */
    private $validator;

    /**
     * @var QuestionSerializer
     */
    private $serializer;

    /**
     * @var QuestionHandlerCollector
     *
     * @deprecated
     */
    private $handlerCollector;

    /**
     * @var HintManager
     *
     * @deprecated it's no longer needed by the class
     */
    private $hintManager;

    /**
     * QuestionManager constructor.
     *
     * @DI\InjectParams({
     *     "router"       = @DI\Inject("router"),
     *     "om"           = @DI\Inject("claroline.persistence.object_manager"),
     *     "validator"    = @DI\Inject("ujm_exo.validator.question"),
     *     "serializer"   = @DI\Inject("ujm_exo.serializer.question"),
     *     "collector"    = @DI\Inject("ujm.exo.question_handler_collector"),
     *     "rm"           = @DI\Inject("claroline.manager.resource_manager"),
     *     "hintManager"  = @DI\Inject("ujm.exo.hint_manager"),
     * })
     *
     * @param UrlGeneratorInterface    $router
     * @param ObjectManager            $om
     * @param QuestionValidator        $validator
     * @param QuestionSerializer       $serializer
     * @param QuestionHandlerCollector $collector
     * @param ResourceManager          $rm
     * @param HintManager              $hintManager
     */
    public function __construct(
        UrlGeneratorInterface $router,
        ObjectManager $om,
        QuestionValidator $validator,
        QuestionSerializer $serializer,
        QuestionHandlerCollector $collector,
        ResourceManager $rm,
        HintManager $hintManager
    ) {
        $this->router = $router;
        $this->om = $om;
        $this->repository = $this->om->getRepository('UJMExoBundle:Question');
        $this->validator = $validator;
        $this->serializer = $serializer;
        $this->handlerCollector = $collector;
        $this->rm = $rm;
        $this->hintManager = $hintManager;
    }

    /**
     * Searches questions for a User.
     *
     * @param User $user
     * @param array $filters
     * @param int $page
     * @param int $number
     * @param array $orderBy
     *
     * @return array
     */
    public function search(User $user, array $filters = [], $page = 0, $number = -1, array $orderBy = [])
    {
        return [
            'questions' => $this->repository->search($user, $filters, $page, $number, $orderBy),
            'total' => 100
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

        // Update Exercise with new data
        $this->serializer->deserialize($data, $question);

        // Save to DB
        $this->om->persist($question);
        $this->om->flush();

        return $question;
    }

    /**
     * Exports a Question.
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
     * Exports a question in a JSON-encodable format.
     *
     * @deprecated use export() instead
     *
     * @param Question $question
     * @param bool     $withSolution
     * @param bool     $forPaperList
     *
     * @return \stdClass
     *
     * @throws \Exception if the question type export is not implemented
     */
    public function exportQuestion(Question $question, $withSolution = true, $forPaperList = false)
    {
        $handler = $this->handlerCollector->getHandlerForInteractionType($question->getType());
        $rm = $this->rm;

        $data = new \stdClass();
        $data->id = $question->getId();
        $data->type = $handler->getQuestionMimeType();
        $data->title = $question->getTitle();
        $data->description = $question->getDescription();
        $data->invite = $question->getInvite();
        $data->supplementary = $question->getSupplementary();
        $data->specification = $question->getSpecification();
        $data->objects = array_map(function ($object) use ($rm) {
            $resourceObjectData = new \stdClass();
            $resourceObjectData->id = (string) $object->getResourceNode()->getId();
            $resourceObjectData->type = $object->getResourceNode()->getResourceType()->getName();
            switch ($object->getResourceNode()->getResourceType()->getName()) {
                case 'text':
                    if ($rm->getResourceFromNode($object->getResourceNode())->getRevisions()[0]) {
                        $resourceObjectData->data = $rm->getResourceFromNode($object->getResourceNode())->getRevisions()[0]->getContent();
                    }

                    break;
                default:
                    $resourceObjectData->url = $this->router->generate(
                        'claro_resource_open',
                        ['resourceType' => $object->getResourceNode()->getResourceType()->getName(), 'node' => $object->getResourceNode()->getId()]
                    );

                    break;
            }

            return $resourceObjectData;
        }, $question->getObjects()->toArray());

        if (count($question->getHints()) > 0) {
            $data->hints = array_map(function ($hint) use ($withSolution) {
                return $this->hintManager->exportHint($hint, $withSolution);
            }, $question->getHints()->toArray());
        }

        if ($withSolution && $question->getFeedback()) {
            $data->feedback = $question->getFeedback();
        }

        $handler->convertInteractionDetails($question, $data, $withSolution, $forPaperList);

        return $data;
    }

    /**
     * Get question statistics inside an Exercise.
     *
     * @param Question $question
     * @param Exercise $exercise
     *
     * @return \stdClass
     */
    public function generateQuestionStats(Question $question, Exercise $exercise)
    {
        $questionStats = new \stdClass();

        // We load all the answers for the question (we need to get the entities as the response in DB are not processable as is)
        $answers = $this->om->getRepository('UJMExoBundle:Attempt\Answer')->findByExerciseAndQuestion($exercise, $question);

        // Number of Users that have seen the question in their exercise
        $questionStats->seen = count($answers);

        // Number of Users that have responded to the question (no blank answer)
        $questionStats->answered = 0;
        if (!empty($answers)) {
            /* @var Answer $answer */
            for ($i = 0; $i < $questionStats->seen; ++$i) {
                if (!empty($answers[$i]->getResponse())) {
                    ++$questionStats->answered;
                } else {
                    // Remove element (to avoid processing in custom handlers)
                    unset($answers[$i]);
                }
            }

            // Let the Handler of the question type parse and compile the data
            $handler = $this->handlerCollector->getHandlerForInteractionType($question->getType());
            $questionStats->solutions = $handler->generateStats($question, $answers);
        }

        return $questionStats;
    }

    public function exportQuestionAnswers(Question $question)
    {
        $handler = $this->handlerCollector->getHandlerForInteractionType($question->getType());
        // question info
        $data = new \stdClass();
        $data->id = $question->getId();
        $data->feedback = $question->getFeedback() ? $question->getFeedback() : '';

        $handler->convertQuestionAnswers($question, $data);

        return $data;
    }

    /**
     * Ensures the format of the answer is correct and returns a list of
     * validation errors, if any.
     *
     * @param Question $question
     * @param mixed    $data
     *
     * @return array
     *
     * @throws \UJM\ExoBundle\Transfer\Json\UnregisteredHandlerException
     */
    public function validateAnswerFormat(Question $question, $data)
    {
        $handler = $this->handlerCollector->getHandlerForInteractionType($question->getType());

        return $handler->validateAnswerFormat($question, $data);
    }
}
