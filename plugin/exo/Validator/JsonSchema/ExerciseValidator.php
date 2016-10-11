<?php

namespace UJM\ExoBundle\Validator\JsonSchema;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

/**
 * @DI\Service("ujm_exo.validator.exercise", parent="ujm_exo.validator.json_schema")
 */
class ExerciseValidator extends JsonSchemaValidator
{
    /**
     * @var StepValidator
     */
    private $stepValidator;

    /**
     * ExerciseValidator constructor.
     *
     * @param StepValidator $stepValidator
     *
     * @DI\InjectParams({
     *     "stepValidator" = @DI\Inject("ujm_exo.validator.step")
     * })
     */
    public function __construct(StepValidator $stepValidator)
    {
        $this->stepValidator = $stepValidator;
    }

    public function getJsonSchemaUri()
    {
        return 'quiz/schema.json';
    }

    public function validateAfterSchema($exercise, array $options = [])
    {
        $errors = [];

        if (isset($exercise->parameters)) {
            $errors = array_merge($errors, $this->validateParameters($exercise->parameters));
        }

        if (isset($exercise->steps)) {
            // Apply custom validation to step items
            array_map(function ($step) use (&$errors, $options) {
                $errors = array_merge($errors, $this->stepValidator->validateAfterSchema($step, $options));
            }, $exercise->steps);
        }

        return $errors;
    }

    private function validateParameters(\stdClass $parameters)
    {
        $errors = [];

        if (isset($parameters->correctionDate)) {
            $dateTime = \DateTime::createFromFormat('Y-m-d\TH:i:s', $parameters->correctionDate);
            if (!$dateTime || $dateTime->format('Y-m-d\TH:i:s') !== $parameters->correctionDate) {
                $errors[] = [
                    'path' => '/parameters/correctionDate',
                    'message' => 'Invalid date format',
                ];
            }
        }

        return $errors;
    }
}
