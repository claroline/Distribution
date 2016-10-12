<?php

namespace UJM\ExoBundle\Serializer;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Step;
use UJM\ExoBundle\Entity\StepQuestion;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;
use UJM\ExoBundle\Serializer\Question\QuestionSerializer;

/**
 * Serializer for step data.
 *
 * @DI\Service("ujm_exo.serializer.step")
 */
class StepSerializer implements SerializerInterface
{
    /**
     * @var QuestionSerializer
     */
    private $questionSerializer;

    /**
     * StepSerializer constructor.
     *
     * @param QuestionSerializer $questionSerializer
     *
     * @DI\InjectParams({
     *     "questionSerializer" = @DI\Inject("ujm_exo.serializer.question")
     * })
     */
    public function __construct(QuestionSerializer $questionSerializer)
    {
        $this->questionSerializer = $questionSerializer;
    }

    /**
     * Converts a Step into a JSON-encodable structure.
     *
     * @param Step  $step
     * @param array $options
     *
     * @return array
     */
    public function serialize($step, array $options = [])
    {
        $stepData = new \stdClass();
        $stepData->id = $step->getUuid();

        if (!empty($step->getTitle())) {
            $stepData->title = $step->getTitle();
        }

        if (!empty($step->getText())) {
            $stepData->description = $step->getText();
        }

        $stepData->parameters = $this->serializeParameters($step);
        $stepData->items = $this->serializeItems($step, $options);

        return $stepData;
    }

    /**
     * Converts raw data into a Step entity.
     *
     * @param \stdClass $data
     * @param Step      $step
     * @param array     $options
     *
     * @return Step
     */
    public function deserialize($data, $step = null, array $options = [])
    {
        if (empty($step)) {
            $step = new Step();
        }

        $step->setUuid($data->id);

        if (isset($data->title)) {
            $step->setTitle($data->title);
        }

        if (isset($data->description)) {
            $step->setText($data->description);
        }

        if (!empty($data->parameters)) {
            $this->deserializeParameters($step, $data->parameters);
        }

        if (!empty($data->items)) {
            $this->deserializeItems($step, $data->items, $options);
        }

        return $step;
    }

    /**
     * Serializes Step parameters.
     *
     * @param Step $step
     *
     * @return \stdClass
     */
    private function serializeParameters(Step $step)
    {
        $parameters = new \stdClass();

        if ($step->getMaxAttempts()) {
            $parameters->maxAttempts = $step->getMaxAttempts();
        }

        return $parameters;
    }

    /**
     * Deserializes Step parameters.
     *
     * @param Step      $step
     * @param \stdClass $parameters
     */
    private function deserializeParameters(Step $step, \stdClass $parameters)
    {
        if (isset($parameters->maxAttempts)) {
            $step->setMaxAttempts($parameters->maxAttempts);
        }
    }

    /**
     * Serializes Step items.
     * Forwards the item serialization to QuestionSerializer.
     *
     * @param Step  $step
     * @param array $options
     *
     * @return array
     */
    public function serializeItems(Step $step, array $options = [])
    {
        $stepQuestions = $step->getStepQuestions()->toArray();

        return array_map(function (StepQuestion $stepQuestion) use ($options) {
            return $this->questionSerializer->serialize($stepQuestion->getQuestion(), $options);
        }, $stepQuestions);
    }

    /**
     * Deserializes Step items.
     * Forwards the item deserialization to QuestionSerializer.
     *
     * @param Step  $step
     * @param array $items
     * @param array $options
     *
     * @return array
     */
    public function deserializeItems(Step $step, array $items = [], array $options = [])
    {
        $stepQuestions = $step->getStepQuestions()->toArray();

        foreach ($items as $index => $itemData) {
            $item = null;
            $stepQuestion = null;

            // Searches for an existing question entity.
            foreach ($stepQuestions as $entityIndex => $entityStepQuestion) {
                /** @var StepQuestion $entityStepQuestion */
                if ($entityStepQuestion->getQuestion()->getUuid() === $itemData->id) {
                    $stepQuestion = $entityStepQuestion;
                    $item = $stepQuestion->getQuestion();
                    unset($stepQuestions[$entityIndex]);
                    break;
                }
            }

            $entity = $this->questionSerializer->deserialize($itemData, $item, $options);

            if (empty($stepQuestion)) {
                // Creation of a new item (we need to link it to the Step)
                $step->addQuestion($entity, $index);
            } else {
                // Update order of the Question in the Step
                $stepQuestion->setOrder($index);
            }
        }

        // Remaining questions are no longer in the Step
        if (0 < count($stepQuestions)) {
            foreach ($stepQuestions as $stepQuestionToRemove) {
                $step->removeStepQuestion($stepQuestionToRemove);
            }
        }
    }
}
