<?php

namespace UJM\ExoBundle\Serializer\Answer;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Question\QuestionDefinitionsCollection;
use UJM\ExoBundle\Library\Serializer\AbstractSerializer;

/**
 * Serializer for answer data.
 *
 * @DI\Service("ujm_exo.serializer.answer")
 */
class AnswerSerializer extends AbstractSerializer
{
    /**
     * @var QuestionDefinitionsCollection
     */
    private $questionDefinitions;

    /**
     * AnswerSerializer constructor.
     *
     * @param QuestionDefinitionsCollection $questionDefinitions
     *
     * @DI\InjectParams({
     *     "questionDefinitions" = @DI\Inject("ujm_exo.collection.question_definitions")
     * })
     */
    public function __construct(QuestionDefinitionsCollection $questionDefinitions)
    {
        $this->questionDefinitions = $questionDefinitions;
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
            'id' => function (Answer $answer) {
                return $answer->getQuestion()->getUuid();
            },
            'data' => function (Answer $answer) use ($options) {
                return $this->serializeAnswerData($answer, $options);
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
     * @param Answer    $entity
     * @param array     $options
     *
     * @return Answer
     */
    public function deserialize($data, $entity = null, array $options = [])
    {
        if (empty($entity)) {
            $entity = new Answer();
        }

        return $entity;
    }

    private function serializeAnswerData(Answer $answer, $options)
    {
        $definition = $this->questionDefinitions->get($answer->getQuestion()->getMimeType());

        // Converts answer data
        return $definition->serializeAnswer($answer->getData(), $options);
    }

    private function deserializeAnswerData(Answer $answer, $data, array $options = [])
    {
        $definition = $this->questionDefinitions->get($answer->getQuestion()->getMimeType());

        // Converts answer data
        /*return $definition->deserializeAnswer($answerData, $answer = null, array $options = []);*/
    }
}
