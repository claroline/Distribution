<?php

namespace UJM\ExoBundle\Serializer\Answer\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.answer_match")
 */
class MatchAnswerSerializer implements SerializerInterface
{
    /**
     * Converts a Match answer into a JSON-encodable structure.
     *
     * @param string $matchAnswer
     * @param array  $options
     *
     * @return \stdClass
     */
    public function serialize($matchAnswer, array $options = [])
    {
        $parts = explode(';', $matchAnswer);

        return array_filter($parts, function ($part) {
            return $part !== '';
        });
    }

    /**
     * Converts raw data into a Match answer string.
     *
     * @param mixed  $data
     * @param string $matchAnswer
     * @param array  $options
     *
     * @return string
     */
    public function deserialize($data, $matchAnswer = null, array $options = [])
    {
        return count($data) > 0 ? implode(';', $data) : '';
    }
}
