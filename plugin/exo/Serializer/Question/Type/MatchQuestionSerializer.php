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
 * @DI\Service("ujm_exo.serializer.question_match")
 */
class MatchQuestionSerializer implements SerializerInterface
{
    /**
     * @var ContentSerializer
     */
    private $contentSerializer;

    /**
     * MatchQuestionSerializer constructor.
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
     * @param MatchQuestion $matchQuestion
     * @param array         $options
     *
     * @return \stdClass
     */
    public function serialize($matchQuestion, array $options = [])
    {
        $questionData = new \stdClass();

        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
            $questionData->solutions = $this->serializeSolutions($matchQuestion);
        }

        $questionData->random = $matchQuestion->getShuffle();
        $questionData->penalty = $matchQuestion->getPenalty();

        $questionData->firstSet = array_map(function (Proposal $proposal) use ($options) {
            $itemData = $this->contentSerializer->serialize($proposal, $options);
            $itemData->id = (string) $proposal->getId();

            return $itemData;
        }, $matchQuestion->getProposals()->toArray());

        $questionData->secondSet = array_map(function (Label $label) use ($options) {
            $itemData = $this->contentSerializer->serialize($label, $options);
            $itemData->id = (string) $label->getId();

            return $itemData;
        }, $matchQuestion->getLabels()->toArray());

        return $questionData;
    }

    /**
     * Converts raw data into a Match question entity.
     *
     * @param \stdClass     $data
     * @param MatchQuestion $matchQuestion
     * @param array         $options
     *
     * @return MatchQuestion
     */
    public function deserialize($data, $matchQuestion = null, array $options = [])
    {
        if (empty($matchQuestion)) {
            $matchQuestion = new MatchQuestion();
        }

        if (!empty($data->penalty) || 0 === $data->penalty) {
            $matchQuestion->setPenalty($data->penalty);
        }

        if (isset($data->shuffle)) {
            $matchQuestion->setShuffle(true);
        }

        return $matchQuestion;
    }

    private function serializeSolutions($questionType)
    {
    }
}
