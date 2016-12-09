<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\InteractionMatching;
use UJM\ExoBundle\Library\Question\Handler\QuestionHandlerInterface;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.question_set")
 * @DI\Tag("ujm_exo.question.serializer")
 */
class SetTypeSerializer implements QuestionHandlerInterface, SerializerInterface
{
    public function getQuestionMimeType()
    {
        return QuestionType::SET;
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

    /**
     * Converts raw data into a Set question entity.
     *
     * @param \stdClass           $data
     * @param InteractionMatching $setQuestion
     * @param array               $options
     *
     * @return InteractionMatching
     */
    public function deserialize($data, $setQuestion = null, array $options = [])
    {
        if (empty($setQuestion)) {
            $setQuestion = new InteractionMatching();
        }

        // TODO: Implement deserialize() method.

        return $setQuestion;
    }

    private function serializeSolutions($questionType)
    {
    }
}
