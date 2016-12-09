<?php

namespace UJM\ExoBundle\Manager;

use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Question;
use UJM\ExoBundle\Entity\Step;
use UJM\ExoBundle\Entity\StepQuestion;
use UJM\ExoBundle\Repository\StepQuestionRepository;
use UJM\ExoBundle\Serializer\StepSerializer;
use UJM\ExoBundle\Transfer\Json\ValidationException;
use UJM\ExoBundle\Transfer\Json\Validator;
use UJM\ExoBundle\Validator\JsonSchema\StepValidator;

/**
 * @DI\Service("ujm.exo.step_manager")
 */
class StepManager
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var StepValidator
     */
    private $validator;

    /**
     * @var Validator
     *
     * @deprecated use $validator instead
     */
    private $oldValidator;

    /**
     * @var QuestionManager
     *
     * @deprecated it's no longer needed by the class
     */
    private $questionManager;

    /**
     * StepManager constructor.
     *
     * @DI\InjectParams({
     *     "om"              = @DI\Inject("claroline.persistence.object_manager"),
     *     "validator"       = @DI\Inject("ujm_exo.validator.step"),
     *     "oldValidator"    = @DI\Inject("ujm.exo.json_validator"),
     *     "serializer"      = @DI\Inject("ujm_exo.serializer.step"),
     *     "questionManager" = @DI\Inject("ujm.exo.question_manager")
     * })
     *
     * @param ObjectManager   $om
     * @param StepValidator   $validator
     * @param Validator       $oldValidator
     * @param StepSerializer  $serializer
     * @param QuestionManager $questionManager
     */
    public function __construct(
        ObjectManager $om,
        StepValidator $validator,
        Validator $oldValidator,
        StepSerializer $serializer,
        QuestionManager $questionManager)
    {
        $this->om = $om;
        $this->validator = $validator;
        $this->oldValidator = $oldValidator;
        $this->serializer = $serializer;
        $this->questionManager = $questionManager;
    }

    /**
     * Validates and creates a new Step from raw data.
     *
     * @param \stdClass $data
     *
     * @return Step
     *
     * @throws ValidationException
     */
    public function create(\stdClass $data)
    {
        return $this->update(new Step(), $data);
    }

    /**
     * Validates and updates a Step entity with raw data.
     *
     * @param Step      $step
     * @param \stdClass $data
     *
     * @return Step
     *
     * @throws ValidationException
     */
    public function update(Step $step, \stdClass $data)
    {
        // Validate received data
        $errors = $this->validator->validate($data);
        if (count($errors) > 0) {
            throw new ValidationException('Step is not valid', $errors);
        }

        // Update Step with new data
        $this->serializer->deserialize($data, $step);

        // Save to DB
        $this->om->persist($step);
        $this->om->flush();

        return $step;
    }

    /**
     * Exports a Step.
     *
     * @param Step  $step
     * @param array $options
     *
     * @return array
     */
    public function export(Step $step, array $options = [])
    {
        return $this->serializer->serialize($step, $options);
    }

    /**
     * Update the Step metadata.
     *
     * @deprecated use StepManager::update() instead
     *
     * @param Step      $step
     * @param \stdClass $metadata
     *
     * @throws ValidationException
     */
    public function updateMetadata(Step $step, \stdClass $metadata)
    {
        $errors = $this->oldValidator->validateStepMetadata($metadata);

        if (count($errors) > 0) {
            throw new ValidationException('Step metadata are not valid', $errors);
        }

        // Update Step
        $step->setTitle($metadata->title);
        $step->setText($metadata->description);
        $step->setMaxAttempts(!empty($metadata->maxAttempts) ? (int) $metadata->maxAttempts : 0);

        // Save to DB
        $this->om->persist($step);
        $this->om->flush();
    }

    /**
     * Append a Question to a Step.
     *
     * @param Step     $step
     * @param Question $question
     * @param int      $order    if -1 the question will be added at the end of the Step
     */
    public function addQuestion(Step $step, Question $question, $order = -1)
    {
        $step->addQuestion($question, $order);

        $this->om->persist($step);
        $this->om->flush();
    }

    /**
     * Removes the link between a Question and a Step.
     *
     * @param Step     $step
     * @param Question $question
     *
     * @return array
     */
    public function removeQuestion(Step $step, Question $question)
    {
        $errors = [];

        // Retrieve the link between Step and Question
        $stepQuestions = $step->getStepQuestions()->toArray();
        $toDelete = array_filter($stepQuestions, function ($stepQuestion) use ($question) {
            /* @var StepQuestion $stepQuestion */
            return $question->getId() === $stepQuestion->getQuestion()->getId();
        });

        if (!empty($toDelete)) {
            $toDelete = array_values($toDelete); // Reindex array

            $this->om->remove($toDelete[0]);
            $this->om->flush();
        } else {
            $errors[] = [
                'message' => 'The question "'.$question->getId().'". is not linked to step "'.$step->getId().'".',
            ];
        }

        return $errors;
    }

    /**
     * Reorder the Questions of a Step.
     *
     * @param Step  $step
     * @param array $order an ordered array of Question IDs
     *
     * @return array array of errors if something went wrong
     */
    public function reorderQuestions(Step $step, array $order)
    {
        $reorderToo = []; // List of Steps we need to reorder too (because we have transferred some Questions)
        foreach ($order as $pos => $questionId) {
            /** @var StepQuestionRepository $stepQuestionRepo */
            $stepQuestionRepo = $this->om->getRepository('UJMExoBundle:StepQuestion');

            /** @var StepQuestion $stepQuestion */
            $stepQuestion = $stepQuestionRepo->findByExerciseAndQuestion($step->getExercise(), $questionId);
            if (!$stepQuestion) {
                // Question is not linked to the Exercise, there is a problem with the order array
                return [[
                    'message' => 'Can not reorder the Question. Unknown question found.',
                ]];
            }

            $oldStep = $stepQuestion->getStep();
            if ($oldStep !== $step) {
                // The question comes from another Step => destroy old link and create a new One
                $oldStep->removeStepQuestion($stepQuestion);

                $stepQuestion->setStep($step);

                $reorderToo[] = $oldStep;
            }

            // Update order
            $stepQuestion->setOrder($pos);

            $this->om->persist($stepQuestion);
        }

        if (!empty($reorderToo)) {
            // In fact as the client call the server each time a Question is moved, there will be always one Step in this array
            /** @var Step $stepToReorder */
            foreach ($reorderToo as $stepToReorder) {
                $stepQuestions = $stepToReorder->getStepQuestions();
                /** @var StepQuestion $sqToReorder */
                foreach ($stepQuestions as $pos => $sqToReorder) {
                    $sqToReorder->setOrder($pos);
                }
            }
        }

        $this->om->flush();

        return [];
    }

    /**
     * Create a copy of a Step.
     *
     * @deprecated see ExerciseManager:copy()
     *
     * @param Step $step
     *
     * @return Step the copy of the Step
     */
    public function copyStep(Step $step)
    {
        $newStep = new Step();

        // Populate Step properties
        $newStep->setOrder($step->getOrder());
        $newStep->setText($step->getText());
        $newStep->setNbQuestion($step->getNbQuestion());
        $newStep->setShuffle($step->getShuffle());
        $newStep->setDuration($step->getDuration());
        $newStep->setMaxAttempts($step->getMaxAttempts());
        $newStep->setKeepSameQuestion($step->getKeepSameQuestion());

        // Link questions to Step
        /** @var StepQuestion $stepQuestion */
        foreach ($step->getStepQuestions() as $stepQuestion) {
            $newStepQuestion = new StepQuestion();

            $newStepQuestion->setStep($newStep);
            $newStepQuestion->setQuestion($stepQuestion->getQuestion());
            $newStepQuestion->setOrder($stepQuestion->getOrder());
        }

        return $newStep;
    }

    /**
     * Exports a step in a JSON-encodable format.
     *
     * @deprecated use StepManager::export instead
     *
     * @param Step $step
     * @param bool $withSolutions
     *
     * @return array
     */
    public function exportStep(Step $step, $withSolutions = true)
    {
        $stepQuestions = $step->getStepQuestions();

        $items = [];

        /** @var StepQuestion $stepQuestion */
        foreach ($stepQuestions as $stepQuestion) {
            $question = $stepQuestion->getQuestion();
            $items[] = $this->questionManager->exportQuestion($question, $withSolutions);
        }

        return [
            'id' => $step->getId(),
            'meta' => [
                'description' => $step->getText(),
                'maxAttempts' => $step->getMaxAttempts(),
                'title' => $step->getTitle(),
            ],
            'items' => $items,
        ];
    }
}
