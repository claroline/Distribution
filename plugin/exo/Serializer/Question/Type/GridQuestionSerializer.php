<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Misc\GridItem;
use UJM\ExoBundle\Entity\Misc\GridOdd;
use UJM\ExoBundle\Entity\Misc\GridRow;
use UJM\ExoBundle\Entity\QuestionType\GridQuestion;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;
use UJM\ExoBundle\Serializer\Content\ContentSerializer;

/**
 * @DI\Service("ujm_exo.serializer.question_grid")
 */
class GridQuestionSerializer implements SerializerInterface
{
    /**
     * @var ContentSerializer
     */
    private $contentSerializer;

    /**
     * GridQuestionSerializer constructor.
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
     * Converts a Grid question into a JSON-encodable structure.
     *
     * @param GridQuestion $gridQuestion
     * @param array        $options
     *
     * @return \stdClass
     */
    public function serialize($gridQuestion, array $options = [])
    {
        $questionData = new \stdClass();

        $questionData->random = $gridQuestion->getShuffle();
        $questionData->penalty = $gridQuestion->getPenalty();

        // TODO: Serialize cells and solutions
        return $questionData;
    }

    /**
     * @param GridQuestion $gridQuestion
     *
     * @return array
     */
    private function serializeSolutions(GridQuestion $gridQuestion)
    {
    }


    /**
     * Converts raw data into a Grid question entity.
     *
     * @param \stdClass    $data
     * @param GridQuestion $gridQuestion
     * @param array        $options
     *
     * @return PairQuestion
     */
    public function deserialize($data, $gridQuestion = null, array $options = [])
    {
        if (empty($gridQuestion)) {
            $gridQuestion = new GridQuestion();
        }

        if (!empty($data->penalty) || 0 === $data->penalty) {
            $gridQuestion->setPenalty($data->penalty);
        }

        if (isset($data->random)) {
            $gridQuestion->setShuffle($data->random);
        }

        // TODO: Deserialize cells and solutions

        //$this->deserializeItems($gridQuestion, $data->cells, $options);
        //$this->deserializeSolutions($gridQuestion, $data->solutions);

        return $gridQuestion;
    }

    private function deserializeCells(GridQuestion $gridQuestion, array $items, array $options = [])
    {
    }

    private function deserializeSolutions(GridQuestion $gridQuestion, array $solutions)
    {
    }
}
