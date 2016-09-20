<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Question\Handler\QuestionHandlerInterface;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

/**
 * @DI\Service("ujm_exo.validator.question_open")
 * @DI\Tag("ujm_exo.question.validator")
 */
class OpenTypeValidator extends JsonSchemaValidator implements QuestionHandlerInterface
{
    public function getQuestionMimeType()
    {
        return QuestionType::OPEN;
    }

    public function getJsonSchemaUri()
    {
        return 'question/open/schema.json';
    }

    public function validateAfterSchema($question, array $options = [])
    {
        return [];
    }
}
