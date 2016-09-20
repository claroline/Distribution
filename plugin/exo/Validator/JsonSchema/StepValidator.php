<?php

namespace UJM\ExoBundle\Validator\JsonSchema;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;
use UJM\ExoBundle\Validator\JsonSchema\Question\QuestionValidator;

/**
 * @DI\Service("ujm_exo.validator.step")
 */
class StepValidator extends JsonSchemaValidator
{
    /**
     * @var QuestionValidator
     */
    private $questionValidator;

    /**
     * @var ContentValidator
     */
    private $contentValidator;

    /**
     * StepValidator constructor.
     *
     * @param QuestionValidator $questionValidator
     * @param ContentValidator  $contentValidator
     *
     * @DI\InjectParams({
     *     "questionValidator" = @DI\Inject("ujm_exo.validator.question"),
     *     "contentValidator"  = @DI\Inject("ujm_exo.validator.content")
     * })
     */
    public function __construct(
        QuestionValidator $questionValidator,
        ContentValidator $contentValidator)
    {
        $this->questionValidator = $questionValidator;
        $this->contentValidator = $contentValidator;
    }

    public function getJsonSchemaUri()
    {
        return 'step/schema.json';
    }

    public function validateAfterSchema($step, array $options = [])
    {
        $errors = [];

        if (isset($step->items)) {
            // Apply custom validation to step items
            array_map(function ($item) use (&$errors, $options) {
                if (1 === preg_match('#^application\/x\.[^/]+\+json$#', $item->type)) {
                    // Item is a Question
                    $itemErrors = $this->questionValidator->validateAfterSchema($item, $options);
                } else {
                    // Item is a Content
                    $itemErrors = $this->contentValidator->validateAfterSchema($item, $options);
                }

                if (!empty($itemErrors)) {
                    $errors = array_merge($errors, $itemErrors);
                }
            }, $step->items);
        }

        return $errors;
    }
}
