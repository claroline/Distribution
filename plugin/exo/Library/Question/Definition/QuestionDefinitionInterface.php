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
     * @return string
     */
    public function getMimeType();

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
    public function serializeQuestion($question, array $options = []);

    /**
     * Deserializes question data.
     *
     * @param \stdClass           $data
     * @param AbstractInteraction $question
     * @param array               $options
     *
     * @return AbstractInteraction
     */
    public function deserializeQuestion(\stdClass $data, $question = null, array $options = []);

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
     * @return mixed
     */
    public function serializeAnswer();

    /**
     * @return mixed
     */
    public function deserializeAnswer();

    /**
     * Calculates the score of an answer to a question.
     *
     * @param AbstractInteraction $question
     * @param \stdClass $answer
     *
     * @return float
     */
    public function calculateScore($question, $answer);

    /**
     * Calculates the total score of a question.
     *
     * @param AbstractInteraction $question
     *
     * @return float
     */
    public function calculateTotal($question);
}
