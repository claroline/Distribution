<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Question;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Question\Handler\QuestionHandlerCollector;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

/**
 * Collects question type validators.
 *
 * @DI\Service("ujm_exo.validator.question_collector")
 */
class QuestionValidatorCollector extends QuestionHandlerCollector
{
    /**
     * Forwards validation to the correct type handler.
     *
     * @param \stdClass $question
     * @param array     $options
     *
     * @return array
     *
     * @throws \UJM\ExoBundle\Library\Question\Handler\Exception\UnregisteredHandlerException
     */
    public function validateMimeType($question, array $options = [])
    {
        /** @var JsonSchemaValidator $validator */
        $validator = $this->getHandlerForMimeType($question->type);

        return $validator->validate($question, $options);
    }
}
