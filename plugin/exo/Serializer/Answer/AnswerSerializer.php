<?php

namespace UJM\ExoBundle\Serializer\Answer;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\AbstractSerializer;

/**
 * Serializer for answer data.
 *
 * @DI\Service("ujm_exo.serializer.answer")
 */
class AnswerSerializer extends AbstractSerializer
{
    /**
     * Converts an Answer into a JSON-encodable structure.
     *
     * @param Answer $answer
     * @param array $options
     *
     * @return \stdClass
     */
    public function serialize($answer, array $options = [])
    {
        $answerData = new \stdClass();

        $this->mapEntityToObject([
            'id' => function (Answer $answer) {
                return $answer->getQuestion()->getUuid();
            },
            'data' => function (Answer $answer) {
                return json_decode($answer->getData());
            }
        ], $answer, $answerData);

        // Adds user score
        if ($this->hasOption(Transfer::INCLUDE_USER_SCORE, $options)) {
            $this->mapEntityToObject([
                'score' => 'score',
            ], $answer, $answerData);
        }

        return $answerData;
    }

    /**
     * Converts raw data into a Answer entity.
     *
     * @param \stdClass $data
     * @param Answer    $answer
     * @param array     $options
     *
     * @return Answer
     */
    public function deserialize($data, $answer = null, array $options = [])
    {
        if (empty($entity)) {
            $entity = new Answer();
        }

        $this->mapObjectToEntity([
            'data' => function (Answer $answer, \stdClass $data) {
                $answer->setData(json_encode($data->data));
            },
        ], $data, $answer);

        return $entity;
    }
}
