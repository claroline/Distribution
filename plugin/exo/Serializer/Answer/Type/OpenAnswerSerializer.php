<?php

namespace UJM\ExoBundle\Serializer\Answer\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.answer_open")
 */
class OpenAnswerSerializer implements SerializerInterface
{
    /**
     * Converts a Open answer into a JSON-encodable structure.
     *
     * @param string $openAnswer
     * @param array  $options
     *
     * @return \stdClass
     */
    public function serialize($openAnswer, array $options = [])
    {
        $answerData = new \stdClass();

        return $answerData;
    }

    /**
     * Converts raw data into an Open answer string.
     *
     * @param mixed  $data
     * @param string $openAnswer
     * @param array  $options
     *
     * @return string
     */
    public function deserialize($data, $openAnswer = null, array $options = [])
    {
    }
}
