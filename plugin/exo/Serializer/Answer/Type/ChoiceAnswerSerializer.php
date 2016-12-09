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
     * @param array  $options
     *
     * @return array - an array of choice ids or an empty array if no answer
     */
    public function serialize($choiceAnswer, array $options = [])
    {
        $parts = explode(';', $choiceAnswer);

        // We need to filter empty values to managed old malformed data
        return array_filter($parts, function ($part) {
            return !empty($part);
        });
    }

    /**
     * Converts raw data into a Choice answer string.
     *
     * @param mixed  $data
     * @param string $choiceAnswer
     * @param array  $options
     *
     * @return string - a string containing all the choice ids separated by `;` or an empty string if no answer
     */
    public function deserialize($data, $choiceAnswer = null, array $options = [])
    {
        return count($data) > 0 ? implode(';', $data) : '';
    }
}
