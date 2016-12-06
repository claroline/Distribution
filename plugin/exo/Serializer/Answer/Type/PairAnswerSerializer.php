<?php

namespace UJM\ExoBundle\Serializer\Answer\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.answer_pair")
 */
class PairAnswerSerializer implements SerializerInterface
{
    /**
     * Converts a Pair answer into a JSON-encodable structure.
     *
     * @param string $pairAnswer
     * @param array  $options
     *
     * @return \stdClass
     */
    public function serialize($pairAnswer, array $options = [])
    {
        $parts = explode(';', $pairAnswer);

        return array_filter($parts, function ($part) {
            return $part !== '';
        });
    }

    /**
     * Converts raw data into a Pair answer string.
     *
     * @param mixed  $data
     * @param string $pairAnswer
     * @param array  $options
     *
     * @return string
     */
    public function deserialize($data, $pairAnswer = null, array $options = [])
    {
        return count($data) > 0 ? implode(';', $data) : '';
    }
}
