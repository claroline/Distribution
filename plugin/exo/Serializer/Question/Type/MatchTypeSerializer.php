<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\InteractionMatching;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Question\Handler\QuestionHandlerInterface;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.question_match")
 * @DI\Tag("ujm_exo.question.serializer")
 */
class MatchTypeSerializer implements QuestionHandlerInterface, SerializerInterface
{
    public function getQuestionMimeType()
    {
        return QuestionType::MATCH;
    }

    /**
     * Converts a Match question into a JSON-encodable structure.
     *
     * @param InteractionMatching $matchQuestion
     * @param array               $options
     *
     * @return \stdClass
     */
    public function serialize($matchQuestion, array $options = [])
    {
        $questionData = new \stdClass();

        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
            $questionData->solutions = $this->serializeSolutions($matchQuestion);
        }

        // Serializes score type
        $questionData->score = new \stdClass();
        $questionData->score->type = 'sum';

        return $questionData;
    }

    /**
     * Converts raw data into a Match question entity.
     *
     * @param \stdClass           $data
     * @param InteractionMatching $matchQuestion
     * @param array               $options
     *
     * @return InteractionMatching
     */
    public function deserialize($data, $matchQuestion = null, array $options = [])
    {
        if (empty($matchQuestion)) {
            $matchQuestion = new InteractionMatching();
        }

        // TODO: Implement deserialize() method.

        return $matchQuestion;
    }

    private function serializeSolutions($questionType)
    {
    }
}
