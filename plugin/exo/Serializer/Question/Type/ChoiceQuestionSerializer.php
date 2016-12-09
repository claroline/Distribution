<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Misc\Choice;
use UJM\ExoBundle\Entity\QuestionType\ChoiceQuestion;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;
use UJM\ExoBundle\Serializer\ResourceContentSerializer;

/**
 * @DI\Service("ujm_exo.serializer.question_choice")
 */
class ChoiceQuestionSerializer implements SerializerInterface
{
    /**
     * @var ResourceContentSerializer
     */
    private $resourceContentSerializer;

    /**
     * ChoiceQuestionSerializer constructor.
     *
     * @param ResourceContentSerializer $resourceContentSerializer
     *
     * @DI\InjectParams({
     *     "resourceContentSerializer" = @DI\Inject("ujm_exo.serializer.resource_content")
     * })
     */
    public function __construct(ResourceContentSerializer $resourceContentSerializer)
    {
        $this->resourceContentSerializer = $resourceContentSerializer;
    }

    /**
     * Converts a Choice question into a JSON-encodable structure.
     *
     * @param ChoiceQuestion $choiceQuestion
     * @param array          $options
     *
     * @return \stdClass
     */
    public function serialize($choiceQuestion, array $options = [])
    {
        $questionData = new \stdClass();

        $questionData->random = $choiceQuestion->getShuffle();
        $questionData->multiple = $choiceQuestion->isMultiple();

        // Serializes choices
        $questionData->choices = $this->serializeChoices($choiceQuestion, $options);

        // Serializes score type
        $questionData->score = new \stdClass();
        if (!$choiceQuestion->getWeightResponse()) {
            $questionData->score->type = 'fixed';
            $questionData->score->success = $choiceQuestion->getScoreRightResponse();
            $questionData->score->failure = $choiceQuestion->getScoreFalseResponse();
        } else {
            $questionData->score->type = 'sum';
        }

        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
            $questionData->solutions = $this->serializeSolutions($choiceQuestion);
        }

        return $questionData;
    }

    /**
     * Converts raw data into a Choice question entity.
     *
     * @param \stdClass      $data
     * @param ChoiceQuestion $choiceQuestion
     * @param array          $options
     *
     * @return ChoiceQuestion
     */
    public function deserialize($data, $choiceQuestion = null, array $options = [])
    {
        if (empty($choiceQuestion)) {
            $choiceQuestion = new ChoiceQuestion();
        }

        $choiceQuestion->setMultiple($data->multiple);
        $choiceQuestion->setShuffle($data->random);

        if ('sum' === $data->score->type) {
            $choiceQuestion->setWeightResponse(true);
        } elseif ('fixed' === $data->score->type) {
            $choiceQuestion->setWeightResponse(false);
            $choiceQuestion->setScoreRightResponse($data->score->success);
            $choiceQuestion->setScoreFalseResponse($data->score->failure);
        }

        $this->deserializeChoices($choiceQuestion, $data->choices, $data->solutions);

        return $choiceQuestion;
    }

    /**
     * Shuffles and serializes the Question choices.
     * To avoid shuffling, set `$options['randomize']` to false (eg. we don't want shuffle for papers).
     *
     * @param ChoiceQuestion $choiceQuestion
     * @param array          $options
     *
     * @return array
     */
    private function serializeChoices(ChoiceQuestion $choiceQuestion, array $options = [])
    {
        return array_map(function (Choice $choice) use ($options) {
            $node = $choice->getResourceNode();
            if (!empty($node)) {
                $choiceData = $this->resourceContentSerializer->serialize($node, $options);
            } else {
                $choiceData = new \stdClass();
                $choiceData->id = (string) $choice->getId();
                $choiceData->type = 'text/html';
                $choiceData->data = $choice->getData();
            }

            return $choiceData;
        }, $choiceQuestion->getChoices()->toArray());
    }

    /**
     * Deserializes Question choices.
     *
     * @param ChoiceQuestion $choiceQuestion
     * @param array          $choices
     * @param array          $solutions
     */
    private function deserializeChoices(ChoiceQuestion $choiceQuestion, array $choices, array $solutions)
    {
        $choiceEntities = $choiceQuestion->getChoices()->toArray();

        foreach ($choices as $index => $choiceData) {
            $choice = null;

            // Searches for an existing choice entity.
            foreach ($choiceEntities as $entityIndex => $entityChoice) {
                /** @var Choice $entityChoice */
                if ((string) $entityChoice->getId() === $choiceData->id) {
                    $choice = $entityChoice;
                    unset($choiceEntities[$entityIndex]);
                    break;
                }
            }

            if (null === $choice) {
                // Create a new choice
                $choice = new Choice();
            }

            $choice->setOrder($index);

            // Set choice content
            if ('text/html' === $choiceData->type || 'text/plain' === $choiceData->type) {
                // HTML is directly stored in the choice entity
                $choice->setData($choiceData->data);
                $choice->setResourceNode(null);
            } else {
                // Other types require a ResourceNode
                $node = $this->resourceContentSerializer->deserialize($choiceData);

                $choice->setData('');
                $choice->setResourceNode($node);
            }

            // Set choice score and feedback
            $choice->setScore(0);
            foreach ($solutions as $solution) {
                if ($solution->id === $choiceData->id) {
                    $choice->setScore($solution->score);
                    if (isset($solution->feedback)) {
                        $choice->setFeedback($solution->feedback);
                    }

                    break;
                }
            }

            if (0 < $choice->getScore()) {
                $choice->setExpected(true);
            }

            $choiceQuestion->addChoice($choice);
        }

        // Remaining choices are no longer in the Question
        foreach ($choiceEntities as $choiceToRemove) {
            $choiceQuestion->removeChoice($choiceToRemove);
        }
    }

    /**
     * Serializes Question solutions.
     *
     * @param ChoiceQuestion $choiceQuestion
     *
     * @return array
     */
    private function serializeSolutions(ChoiceQuestion $choiceQuestion)
    {
        return array_map(function (Choice $choice) {
            $solutionData = new \stdClass();
            $solutionData->id = (string) $choice->getId();
            $solutionData->score = $choice->getScore();

            if ($choice->getFeedback()) {
                $solutionData->feedback = $choice->getFeedback();
            }

            return $solutionData;
        }, $choiceQuestion->getChoices()->toArray());
    }
}
