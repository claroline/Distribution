<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Question;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;
use UJM\ExoBundle\Validator\JsonSchema\HintValidator;

/**
 * @DI\Service("ujm_exo.validator.question")
 */
class QuestionValidator extends JsonSchemaValidator
{
    /**
     * @var QuestionValidatorCollector
     */
    private $validatorCollector;

    /**
     * @var HintValidator
     */
    private $hintValidator;

    /**
     * QuestionValidator constructor.
     *
     * @param QuestionValidatorCollector $validatorCollector
     * @param HintValidator              $hintValidator
     *
     * @DI\InjectParams({
     *     "validatorCollector" = @DI\Inject("ujm_exo.validator.question_collector"),
     *     "hintValidator"      = @DI\Inject("ujm_exo.validator.hint")
     * })
     */
    public function __construct(
        QuestionValidatorCollector $validatorCollector,
        HintValidator $hintValidator)
    {
        $this->validatorCollector = $validatorCollector;
        $this->hintValidator = $hintValidator;
    }

    public function getJsonSchemaUri()
    {
        return 'question/base/schema.json';
    }

    /**
     * Delegates the validation to the correct question type handler.
     *
     * @param \stdClass $question
     * @param array     $options
     *
     * @return array
     */
    public function validateAfterSchema($question, array $options = [])
    {
        $errors = [];

        if (empty($question->content)) {
            // No blank content
            $errors[] = [
                'path' => '/content',
                'message' => 'Question content can not be empty',
            ];
        }

        if (!$this->validatorCollector->hasHandlerForMimeType($question->type)) {
            $errors[] = [
                'path' => '/type',
                'message' => 'Unknown question type "'.$question->type.'"',
            ];
        } else {
            if (isset($options['solutionsRequired']) && $options['solutionsRequired'] && !isset($question->solutions)) {
                $errors[] = [
                    'path' => '/solutions',
                    'message' => 'Question requires a "solutions" property',
                ];
            } else {
                // Forward to the correct handler
                array_merge($errors, $this->validatorCollector->validateMimeType($question, $options));
            }
        }

        if (isset($question->hints)) {
            array_map(function ($hint) use (&$errors, $options) {
                $errors = array_merge($errors, $this->hintValidator->validateAfterSchema($hint, $options));
            }, $question->hints);
        }

        return $errors;
    }
}
