<?php

namespace UJM\ExoBundle\Validator\JsonSchema;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

/**
 * Validates Hint data.
 *
 * @DI\Service("ujm_exo.validator.hint")
 */
class HintValidator extends JsonSchemaValidator
{
    /**
     * {@inheritdoc}
     */
    public function getJsonSchemaUri()
    {
        return 'hint/schema.json';
    }

    /**
     * {@inheritdoc}
     */
    public function validateAfterSchema($hint, array $options = [])
    {
        $errors = [];

        if (!empty($options['solutionsRequired']) && $options['solutionsRequired'] && empty($hint->value)) {
            $errors[] = [
                'path' => '/value',
                'message' => 'Hint requires a "value" property',
            ];
        }

        return $errors;
    }
}
