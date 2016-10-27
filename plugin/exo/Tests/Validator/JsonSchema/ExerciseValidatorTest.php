<?php

namespace UJM\ExoBundle\Tests\Validator\JsonSchema;

use UJM\ExoBundle\Library\Testing\Json\JsonSchemaTestCase;
use UJM\ExoBundle\Validator\JsonSchema\ExerciseValidator;

class ExerciseValidatorTest extends JsonSchemaTestCase
{
    /**
     * @var ExerciseValidator
     */
    private $validator;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $stepValidator;

    protected function setUp()
    {
        parent::setUp();

        $this->stepValidator = $this->mock('UJM\ExoBundle\Validator\JsonSchema\StepValidator');
        $this->stepValidator->expects($this->any())
            ->method('validateAfterSchema')
            ->willReturn([]);

        $this->validator = $this->injectJsonSchemaMock(
            new ExerciseValidator($this->stepValidator)
        );
    }

    /**
     * Checks the validator executes custom validation for the steps.
     */
    public function testStepsAreValidatedToo()
    {
        $exerciseData = $this->loadExampleData('quiz/examples/valid/quiz-metadata.json');

        $this->stepValidator->expects($this->exactly(count($exerciseData->steps)))
            ->method('validateAfterSchema');

        $this->validator->validate($exerciseData);
    }
}
