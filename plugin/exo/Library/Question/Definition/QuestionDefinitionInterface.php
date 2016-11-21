<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use UJM\ExoBundle\Entity\AbstractInteraction;

/**
 * Interface for the definition of a question type
 */
interface QuestionDefinitionInterface
{
    /**
     * Gets the mime type of the question.
     *
     * It MUST have the format : application/x.{QUESTION_TYPE}+json
     *
     * @return string
     */
    public function getMimeType();

    /**
     * Gets the entity class holding the specific question data.
     *
     * This method needs to only return the class name, without namespace (eg. ChoiceQuestion).
     * The full namespace `UJM\ExoBundle\Entity\QuestionType` is added as prefix to the return value.
     *
     * @return string
     */
    public function getEntityClass();

    /**
     * Validates question data.
     *
     * @param \stdClass $question
     * @param array     $options
     *
     * @return array
     */
    public function validateQuestion(\stdClass $question, array $options = []);

    /**
     * Serializes question entity.
     *
     * @param AbstractInteraction $question
     * @param array               $options
     *
     * @return \stdClass
     */
    public function serializeQuestion(AbstractInteraction $question, array $options = []);

    /**
     * Deserializes question data.
     *
     * @param \stdClass           $data
     * @param AbstractInteraction $question
     * @param array               $options
     *
     * @return AbstractInteraction
     */
    public function deserializeQuestion(\stdClass $data, AbstractInteraction $question = null, array $options = []);

    /**
     * Validates question answer.
     *
     * @param \stdClass $question
     * @param mixed     $answer
     * @param array     $options
     *
     * @return array
     */
    public function validateAnswer(\stdClass $question, $answer, array $options = []);

    /**
     * Serializes answer entity.
     *
     * @param mixed $answer
     * @param array $options
     *
     * @return \stdClass
     */
    public function serializeAnswer($answer, array $options = []);

    /**
     * Deserializes answer data.
     *
     * @param mixed $data
     * @param string $answer
     * @param array $options
     *
     * @return string
     */
    public function deserializeAnswer($data, $answer = null, array $options = []);

    /**
     * Calculates the score of an answer to a question.
     *
     * @param AbstractInteraction $question
     * @param \stdClass $answer
     *
     * @return float
     */
    public function calculateScore(AbstractInteraction $question, $answer);

    /**
     * Calculates the total score of a question.
     *
     * @param AbstractInteraction $question
     *
     * @return float
     */
    public function calculateTotal(AbstractInteraction $question);

    /**
     * Gets statistics on answers given to a question.
     *
     * @param AbstractInteraction $question
     * @param array $answers
     *
     * @return \stdClass
     */
    public function getStatistics(AbstractInteraction $question, array $answers);
}
