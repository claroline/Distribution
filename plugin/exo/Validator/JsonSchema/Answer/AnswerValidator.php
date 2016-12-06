<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Answer;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

/**
 * @DI\Service("ujm_exo.validator.answer")
 */
class AnswerValidator extends JsonSchemaValidator
{
    public function getJsonSchemaUri()
    {
        return 'answer/schema.json';
    }

    /**
     * Performs additional validations.
     *
     * @param \stdClass $answer
     * @param array     $options
     *
     * @return array
     */
    public function validateAfterSchema($answer, array $options = [])
    {
        // TODO : implement method.

        // Checks the question exists

        // Forward to question type validator

        return [];
    }
}
