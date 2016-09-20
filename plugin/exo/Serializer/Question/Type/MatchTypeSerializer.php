<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\InteractionMatching;
use UJM\ExoBundle\Entity\Question;
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

        if (isset($options['includeSolutions']) && $options['includeSolutions']) {
            $questionData->solutions = $this->serializeSolutions($matchQuestion);
        }

        // Serializes score type
        $questionData->score = new \stdClass();
        $questionData->score->type = 'sum';

        return $questionData;
    }

    public function deserialize($data, array $options = [])
    {
        // TODO: Implement deserialize() method.
    }

    private function serializeSolutions($questionType)
    {
    }
}
