<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Item\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Validator\JsonSchema\Item\Type\ChoiceQuestionValidator;

/**
 * @DI\Service("ujm_exo.validator.question_boolean")
 */
class BooleanQuestionValidator extends ChoiceQuestionValidator
{
    public function getJsonSchemaUri()
    {
        return 'question/boolean/schema.json';
    }
}
