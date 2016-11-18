<?php

namespace UJM\ExoBundle\Serializer\Answer\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.answer_graphic")
 */
class GraphicAnswerSerializer implements SerializerInterface
{
    /**
     * Converts a Graphic answer into a JSON-encodable structure.
     *
     * @param string $graphicAnswer
     * @param array $options
     *
     * @return \stdClass
     */
    public function serialize($graphicAnswer, array $options = [])
    {
        $answerData = new \stdClass();

        return $answerData;
    }

    /**
     * Converts raw data into a Graphic answer string.
     *
     * @param mixed  $data
     * @param string $graphicAnswer
     * @param array  $options
     *
     * @return string
     */
    public function deserialize($data, $graphicAnswer = null, array $options = [])
    {

    }
}
