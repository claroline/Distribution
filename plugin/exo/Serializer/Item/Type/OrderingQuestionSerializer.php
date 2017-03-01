<?php

namespace UJM\ExoBundle\Serializer\Item\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\ItemType\Ordering;
use UJM\ExoBundle\Entity\Misc\OrderingItem;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;
use UJM\ExoBundle\Serializer\Content\ContentSerializer;

/**
 * @DI\Service("ujm_exo.serializer.question_ordering")
 */
class OrderingQuestionSerializer implements SerializerInterface
{
    /**
     * @var ContentSerializer
     */
    private $contentSerializer;

    /**
     * OrderingQuestionSerializer constructor.
     *
     * @param ContentSerializer $contentSerializer
     *
     * @DI\InjectParams({
     *     "contentSerializer" = @DI\Inject("ujm_exo.serializer.content")
     * })
     */
    public function __construct(ContentSerializer $contentSerializer)
    {
        $this->contentSerializer = $contentSerializer;
    }

    /**
     * Converts an Ordering question into a JSON-encodable structure.
     *
     * @param Ordering       $question
     * @param array          $options
     *
     * @return \stdClass
     */
    public function serialize($question, array $options = [])
    {
        $questionData = new \stdClass();

        $questionData->mode = $question->getMode();
        $questionData->direction = $question->getDirection();
        // Serializes items
        $questionData->items = $this->serializeItems($question, $options);

        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
            $questionData->solutions = $this->serializeSolutions($question);
        }

        return $questionData;
    }

    /**
     * Serializes the question items.
     *
     * @param Ordering       $question
     * @param array          $options
     *
     * @return array
     */
    private function serializeItems(Ordering $question, array $options = [])
    {
        return array_map(function (OrderingItem $item) use ($options) {
            $itemData = $this->contentSerializer->serialize($item, $options);
            $itemData->id = $item->getUuid();

            return $itemData;
        }, $question->getItems()->toArray());
    }

    /**
     * Serializes Question solutions.
     *
     * @param Ordering $question
     *
     * @return array
     */
    private function serializeSolutions(Ordering $question)
    {
        return array_map(function (OrderingItem $item) {
            $solutionData = new \stdClass();
            $solutionData->id = $item->getUuid();
            $solutionData->score = $item->getScore();

            if ($item->getFeedback()) {
                $solutionData->feedback = $item->getFeedback();
            }

            if ($item->getOrder()) {
                $solutionData->order = $item->getOrder();
            }

            return $solutionData;
        }, $choiceQuestion->getChoices()->toArray());
    }

    /**
     * Converts raw data into an Ordering question entity.
     *
     * @param \stdClass      $data
     * @param Ordering       $question
     * @param array          $options
     *
     * @return Ordering
     */
    public function deserialize($data, $question = null, array $options = [])
    {
        if (empty($question)) {
            $question = new Ordering();
        }

        $this->deserializeItems($question, $data->items, $data->solutions, $options);

        return $question;
    }

    /**
     * Deserializes Question choices.
     *
     * @param ChoiceQuestion $choiceQuestion
     * @param array          $choices
     * @param array          $solutions
     * @param array          $options
     */
    private function deserializeItems(Ordering $question, array $items, array $solutions, array $options = [])
    {
        $itemEntities = $question->getItems()->toArray();

        foreach ($items as $index => $itemData) {
            $item = null;

            // Searches for an existing item entity.
            foreach ($itemEntities as $entityIndex => $entityItem) {
                /** @var OrderingItem $entityItem */
                if ($entityItem->getUuid() === $itemData->id) {
                    $item = $entityItem;
                    unset($itemEntities[$entityIndex]);
                    break;
                }
            }

            if (empty($item)) {
                // Create a new item
                $item = new OrderingItem();
            }

            // Force client ID if needed
            if (!in_array(Transfer::USE_SERVER_IDS, $options)) {
                $item->setUuid($itemData->id);
            }

            // Deserialize item content
            $item = $this->contentSerializer->deserialize($itemData, $item, $options);

            // Set item score feedback and order
            foreach ($solutions as $solution) {
                if ($solution->id === $itemData->id) {
                    $item->setScore($solution->score);
                    if (isset($solution->feedback)) {
                        $item->setFeedback($solution->feedback);
                    }

                    if (isset($solution->order)) {
                        $item->setOrder($index);
                    }
                    break;
                }
            }

            $question->addItem($item);
        }

        // Remaining items are no longer in the Question
        foreach ($itemEntities as $itemToRemove) {
            $question->removeItem($itemToRemove);
        }
    }
}
