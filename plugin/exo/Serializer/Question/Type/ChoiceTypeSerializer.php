<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Choice;
use UJM\ExoBundle\Entity\InteractionQCM;
use UJM\ExoBundle\Library\Question\Handler\QuestionHandlerInterface;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;
use UJM\ExoBundle\Serializer\ResourceContentSerializer;

/**
 * @DI\Service("ujm_exo.serializer.question_choice")
 * @DI\Tag("ujm_exo.question.serializer")
 */
class ChoiceTypeSerializer implements QuestionHandlerInterface, SerializerInterface
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var ResourceContentSerializer
     */
    private $resourceContentSerializer;

    /**
     * ChoiceTypeSerializer constructor.
     *
     * @param ObjectManager             $om
     * @param ResourceContentSerializer $resourceContentSerializer
     *
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager"),
     *     "resourceContentSerializer" = @DI\Inject("ujm_exo.serializer.resource_content")
     * })
     */
    public function __construct(
        ObjectManager $om,
        ResourceContentSerializer $resourceContentSerializer)
    {
        $this->om = $om;
        $this->resourceContentSerializer = $resourceContentSerializer;
    }

    public function getQuestionMimeType()
    {
        return QuestionType::CHOICE;
    }

    /**
     * Converts a Choice question into a JSON-encodable structure.
     *
     * @param InteractionQCM $choiceQuestion
     * @param array          $options
     *
     * @return \stdClass
     */
    public function serialize($choiceQuestion, array $options = [])
    {
        $questionData = new \stdClass();

        $questionData->random = $choiceQuestion->getShuffle();
        $questionData->multiple = $choiceQuestion->getTypeQCM()->getCode() === 1;

        // Serializes choices
        $this->serializeChoices($choiceQuestion, $options);

        // Serializes score type
        $questionData->score = new \stdClass();
        if (!$choiceQuestion->getWeightResponse()) {
            $questionData->score->type = 'fixed';
            $questionData->score->success = $choiceQuestion->getScoreRightResponse();
            $questionData->score->failure = $choiceQuestion->getScoreFalseResponse();
        } else {
            $questionData->score->type = 'sum';
        }

        if (isset($options['includeSolutions']) && $options['includeSolutions']) {
            $questionData->solutions = $this->serializeSolutions($choiceQuestion);
        }

        return $questionData;
    }

    /**
     * Converts raw data into a Choice question entity.
     *
     * @param \stdClass $data
     * @param array     $options
     *
     * @return InteractionQCM
     */
    public function deserialize($data, array $options = [])
    {
        $choiceQuestion = !empty($options['entity']) ? $options['entity'] : new InteractionQCM();

        $subTypeCode = $data->multiple ? 1 : 2;
        $subType = $this->om->getRepository('UJMExoBundle:TypeQCM')->findOneByCode($subTypeCode);

        $choiceQuestion->setTypeQCM($subType);
        $choiceQuestion->setShuffle($data->random);

        if ($data->score->type === 'sum') {
            $choiceQuestion->setWeightResponse(true);
        } elseif ($data->score->type === 'fixed') {
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
     * @param InteractionQCM $questionType
     * @param array          $options
     *
     * @return array
     */
    private function serializeChoices(InteractionQCM $questionType, array $options = [])
    {
        return array_map(function ($choice) use ($options) {
            /* @var Choice $choice */

            $node = $choice->getResourceNode();
            if (!empty($node)) {
                $choiceData = $this->resourceContentSerializer->serialize($node, $options);
            } else {
                $choiceData = new \stdClass();
                $choiceData->id = (string) $choice->getId();
                $choiceData->type = 'text/html';
                $choiceData->data = $choice->getLabel();
            }

            return $choiceData;
        }, $questionType->getChoices()->toArray());
    }

    /**
     * Deserializes Question choices.
     *
     * @param InteractionQCM $choiceQuestion
     * @param array          $choices
     * @param array          $solutions
     */
    private function deserializeChoices(InteractionQCM $choiceQuestion, array $choices, array $solutions)
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
            if ('text/html' === $choiceData->type) {
                // HTML is directly stored in the choice entity
                $choice->setLabel($choiceData->data);
                $choice->setResourceNode(null);
            } else {
                // Other types require a ResourceNode
                $node = $this->resourceContentSerializer->deserialize($choiceData);

                $choice->setLabel('');
                $choice->setResourceNode($node);
            }

            // Set choice score
            foreach ($solutions as $solution) {
                if ($solution->id === $choiceData->id) {
                    $choice->setWeight($solution->score);

                    if (0 < $solution->score) {
                        $choice->setRightResponse(true);
                    }

                    if (isset($solution->feedback)) {
                        $choice->setFeedback($solution->feedback);
                    }

                    break;
                }
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
     * @param InteractionQCM $choiceQuestion
     *
     * @return array
     */
    private function serializeSolutions(InteractionQCM $choiceQuestion)
    {
        return array_map(function (Choice $choice) use ($choiceQuestion) {
            $solutionData = new \stdClass();
            $solutionData->id = (string) $choice->getId();

            if (!$choiceQuestion->getWeightResponse()) {
                $solutionData->score = $choice->getRightResponse() ? 1 : -1;
            } else {
                $solutionData->score = $choice->getWeight();
            }
            $solutionData->rightResponse = $choice->getRightResponse();

            if ($choice->getFeedback()) {
                $solutionData->feedback = $choice->getFeedback();
            }

            return $solutionData;
        }, $choiceQuestion->getChoices()->toArray());
    }
}
