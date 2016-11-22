<?php

namespace UJM\ExoBundle\Serializer\Answer;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Entity\Question\Hint;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\AbstractSerializer;
use UJM\ExoBundle\Serializer\Question\HintSerializer;

/**
 * Serializer for answer data.
 *
 * @DI\Service("ujm_exo.serializer.answer")
 */
class AnswerSerializer extends AbstractSerializer
{
    /**
     * @var HintSerializer
     */
    private $hintSerializer;

    /**
     * AnswerSerializer constructor.
     *
     * @DI\InjectParams({
     *      "hintSerializer" = @DI\Inject("ujm_exo.serializer.hint")
     * })
     *
     * @param HintSerializer $hintSerializer
     */
    public function __construct(HintSerializer $hintSerializer)
    {
        $this->hintSerializer = $hintSerializer;
    }

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
            'questionId' => function (Answer $answer) {
                return $answer->getQuestion()->getUuid();
            },
            'tries' => 'nbTries',
            'data' => function (Answer $answer) {
                return json_decode($answer->getData());
            },
            'usedHints' => function (Answer $answer) {
                return $this->serializeHints($answer);
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

    private function serializeHints(Answer $answer)
    {
        return array_map(function (Hint $hint) {
            return $this->hintSerializer->serialize($hint, [Transfer::INCLUDE_SOLUTIONS]);
        }, $answer->getUsedHints()->toArray());
    }
}
