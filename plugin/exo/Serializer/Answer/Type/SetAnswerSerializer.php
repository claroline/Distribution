<?php

namespace UJM\ExoBundle\Serializer\Answer\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.answer_set")
 */
class SetAnswerSerializer implements SerializerInterface
{
    /**
     * Converts a Set answer into a JSON-encodable structure.
     *
     * @param string $setAnswer
     * @param array  $options
     *
     * @return \stdClass
     */
    public function serialize($setAnswer, array $options = [])
    {
        $parts = explode(';', $setAnswer);

        return array_filter($parts, function ($part) {
            return $part !== '';
        });
    }

    /**
     * Converts raw data into a Set answer string.
     *
     * @param mixed  $data
     * @param string $setAnswer
     * @param array  $options
     *
     * @return string
     */
    public function deserialize($data, $setAnswer = null, array $options = [])
    {
        return count($data) > 0 ? implode(';', $data) : '';
    }
}
