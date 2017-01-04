<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Misc\Label;
use UJM\ExoBundle\Entity\Misc\Proposal;
use UJM\ExoBundle\Entity\QuestionType\MatchQuestion;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;
use UJM\ExoBundle\Serializer\Content\ContentSerializer;

/**
 * @DI\Service("ujm_exo.serializer.question_set")
 */
class SetQuestionSerializer implements SerializerInterface
{
    /**
     * @var ContentSerializer
     */
    private $contentSerializer;

    /**
     * SetQuestionSerializer constructor.
     *
     * @DI\InjectParams({
     *      "contentSerializer" = @DI\Inject("ujm_exo.serializer.content")
     * })
     *
     * @param ContentSerializer $contentSerializer
     */
    public function __construct(ContentSerializer $contentSerializer)
    {
        $this->contentSerializer = $contentSerializer;
    }

    /**
     * Converts a Match question into a JSON-encodable structure.
     *
     * @param MatchQuestion $setQuestion
     * @param array         $options
     *
     * @return \stdClass
     */
    public function serialize($setQuestion, array $options = [])
    {
        $questionData = new \stdClass();

        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
            $questionData->solutions = $this->serializeSolutions($setQuestion);
        }

        $questionData->random = $setQuestion->getShuffle();
        $questionData->penalty = $setQuestion->getPenalty();

        $questionData->sets = array_map(function (Proposal $proposal) use ($options) {
            $setData = $this->contentSerializer->serialize($proposal, $options);
            $setData->id = (string) $proposal->getId();

            return $setData;
        }, $setQuestion->getProposals()->toArray());

        $questionData->items = array_map(function (Label $label) use ($options) {
            $itemData = $this->contentSerializer->serialize($label, $options);
            $itemData->id = (string) $label->getId();

            return $itemData;
        }, $setQuestion->getLabels()->toArray());

        return $questionData;
    }

    /**
     * Converts raw data into a Set question entity.
     *
     * @param \stdClass     $data
     * @param MatchQuestion $setQuestion
     * @param array         $options
     *
     * @return MatchQuestion
     */
    public function deserialize($data, $setQuestion = null, array $options = [])
    {
        if (empty($setQuestion)) {
            $setQuestion = new MatchQuestion();
        }

        if (!empty($data->penalty) || 0 === $data->penalty) {
            $setQuestion->setPenalty($data->penalty);
        }

        if (isset($data->shuffle)) {
            $setQuestion->setShuffle(true);
        }

        return $setQuestion;
    }

    private function serializeSolutions($questionType)
    {
    }
}
