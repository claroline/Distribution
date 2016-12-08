<?php

namespace UJM\ExoBundle\Tests\Validator\JsonSchema;

use UJM\ExoBundle\Library\Testing\Json\JsonSchemaTestCase;
use UJM\ExoBundle\Validator\JsonSchema\StepValidator;

class StepValidatorTest extends JsonSchemaTestCase
{
    /**
     * @var StepValidator
     */
    private $validator;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $questionValidator;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $contentValidator;

    protected function setUp()
    {
        parent::setUp();

        $this->questionValidator = $this->mock('UJM\ExoBundle\Validator\JsonSchema\Question\QuestionValidator');
        $this->questionValidator->expects($this->any())
            ->method('validateAfterSchema')
            ->willReturn([]);

        $this->contentValidator = $this->mock('UJM\ExoBundle\Validator\JsonSchema\ContentValidator');
        $this->contentValidator->expects($this->any())
            ->method('validateAfterSchema')
            ->willReturn([]);

        $this->validator = $this->injectJsonSchemaMock(
            new StepValidator($this->questionValidator, $this->contentValidator)
        );
    }

    /**
     * The validator MUST execute custom validation for question items by calling the QuestionValidator.
     */
    public function testQuestionsAreValidatedToo()
    {
        $stepData = $this->loadExampleData('step/examples/valid/one-question.json');

        // Checks that question items are forwarded to the QuestionValidator
        $this->questionValidator->expects($this->exactly(count($stepData->items)))
            ->method('validateAfterSchema');

        $this->validator->validate($stepData);
    }

    /**
     * The validator MUST execute custom validation for content items by calling the ContentValidator.
     */
    public function testContentsAreValidatedToo()
    {
        $stepData = $this->loadExampleData('step/examples/valid/one-content.json');

        // Checks that content items are forwarded to the ContentValidator
        $this->contentValidator->expects($this->exactly(count($stepData->items)))
            ->method('validateAfterSchema');

        $this->validator->validate($stepData);
    }
}
