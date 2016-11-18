<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use UJM\ExoBundle\Entity\AbstractInteraction;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;
use UJM\ExoBundle\Library\Validator\ValidatorInterface;

/**
 * Base class for question definitions.
 * Permits to use separate classes to handle Serialization and Validation.
 */
abstract class AbstractDefinition implements QuestionDefinitionInterface
{
    /**
     * Gets the question Validator instance.
     *
     * @return ValidatorInterface
     */
    abstract protected function getQuestionValidator();

    /**
     * Gets the question Serializer instance.
     *
     * @return SerializerInterface
     */
    abstract protected function getQuestionSerializer();

    /**
     * Gets the answer Serializer instance.
     *
     * @return SerializerInterface
     */
    abstract protected function getAnswerSerializer();

    /**
     * Validates a choice question.
     *
     * @param \stdClass $question
     * @param array $options
     *
     * @return array
     */
    public function validateQuestion(\stdClass $question, array $options = [])
    {
        return $this->getQuestionValidator()->validate($question, $options);
    }

    /**
     * Serializes a question entity.
     *
     * @param AbstractInteraction $question
     * @param array               $options
     *
     * @return \stdClass
     */
    public function serializeQuestion(AbstractInteraction $question, array $options = [])
    {
        return $this->getQuestionSerializer()->serialize($question, $options);
    }

    /**
     * Deserializes question data.
     *
     * @param \stdClass           $questionData
     * @param AbstractInteraction $question
     * @param array               $options
     *
     * @return AbstractInteraction
     */
    public function deserializeQuestion(\stdClass $questionData, AbstractInteraction $question = null, array $options = [])
    {
        return $this->getQuestionSerializer()->deserialize($questionData, $question, $options);
    }

    public function validateAnswer(\stdClass $question, $answer, array $options = [])
    {

    }

    /**
     * Serializes a question answer.
     *
     * @param string $answer
     * @param array $options
     *
     * @return mixed
     */
    public function serializeAnswer($answer, array $options = [])
    {
        return $this->getAnswerSerializer()->serialize($answer, $options);
    }

    public function deserializeAnswer($answerData, $answer = null, array $options = [])
    {
        return $this->getAnswerSerializer()->deserialize($answerData, $answer, $options);
    }

    public function calculateScore(AbstractInteraction $question, $answer)
    {

    }

    public function calculateTotal(AbstractInteraction $question)
    {

    }
}
