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
     * The validator MUST throw errors if the `showCorrectionDate` is set to "date" but no date is specified.
     */
    public function testNoCorrectionDateWhenRequiredThrowsError()
    {
        $exerciseData = $this->loadTestData('exercise/invalid/no-correction-date.json');

        $errors = $this->validator->validate($exerciseData);

        $this->assertGreaterThan(0, count($errors));
        $this->assertTrue(in_array([
            'path' => '/parameters/correctionDate',
            'message' => 'The property `correctionDate` is required when `showCorrectionAt` is "date"',
        ], $errors));
    }

    /**
     * The validator MUST throw errors if random picking of steps is enabled and property `pick` is not set.
     */
    public function testNoPickWhenRequiredThrowsError()
    {
        $exerciseData = $this->loadTestData('exercise/invalid/no-pick.json');

        $errors = $this->validator->validate($exerciseData);

        $this->assertGreaterThan(0, count($errors));
        $this->assertTrue(in_array([
            'path' => '/parameters/randomPick',
            'message' => 'The property `pick` is required when `randomPick` is not "never"',
        ], $errors));
    }

    /**
     * The validator MUST forward the validation of steps to the StepValidator.
     */
    public function testStepsAreValidatedToo()
    {
        $exerciseData = $this->loadExampleData('quiz/examples/valid/quiz-metadata.json');

        $this->stepValidator->expects($this->exactly(count($exerciseData->steps)))
            ->method('validateAfterSchema');

        $this->validator->validate($exerciseData);
    }
}
