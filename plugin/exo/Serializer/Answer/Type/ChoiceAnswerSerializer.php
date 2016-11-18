<?php

namespace UJM\ExoBundle\Serializer\Answer\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.answer_choice")
 */
class ChoiceAnswerSerializer implements SerializerInterface
{
    /**
     * Converts a Choice answer into a JSON-encodable structure.
     *
     * @param string $choiceAnswer
     * @param array $options
     *
     * @return \stdClass
     */
    public function serialize($choiceAnswer, array $options = [])
    {
        $answerData = new \stdClass();

        return $answerData;
    }

    /**
     * Converts raw data into a Choice answer string.
     *
     * @param mixed  $data
     * @param string $choiceAnswer
     * @param array  $options
     *
     * @return string
     */
    public function deserialize($data, $choiceAnswer = null, array $options = [])
    {

    }
}
