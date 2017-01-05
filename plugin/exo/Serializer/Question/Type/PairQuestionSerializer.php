<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\QuestionType\MatchQuestion;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.question_pair")
 */
class PairQuestionSerializer implements SerializerInterface
{
    /**
     * Converts a Match question into a JSON-encodable structure.
     *
     * @param MatchQuestion $pairQuestion
     * @param array         $options
     *
     * @return \stdClass
     */
    public function serialize($pairQuestion, array $options = [])
    {
        $questionData = new \stdClass();

        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
            $questionData->solutions = $this->serializeSolutions($pairQuestion);
        }

        return $questionData;
    }

    /**
     * Converts raw data into a Set question entity.
     *
     * @param \stdClass     $data
     * @param MatchQuestion $pairQuestion
     * @param array         $options
     *
     * @return MatchQuestion
     */
    public function deserialize($data, $pairQuestion = null, array $options = [])
    {
        if (empty($pairQuestion)) {
            $pairQuestion = new MatchQuestion();
        }

        // TODO: Implement deserialize() method.

        return $pairQuestion;
    }

    private function serializeSolutions($questionType)
    {
    }
}
