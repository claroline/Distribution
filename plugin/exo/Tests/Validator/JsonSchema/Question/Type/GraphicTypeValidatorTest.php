<?php

namespace UJM\ExoBundle\Tests\Validator\JsonSchema\Question\Type;

use UJM\ExoBundle\Library\Testing\Json\JsonSchemaTestCase;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\GraphicTypeValidator;

class GraphicTypeValidatorTest extends JsonSchemaTestCase
{
    /**
     * @var GraphicTypeValidator
     */
    private $validator;

    protected function setUp()
    {
        parent::setUp();

        $this->validator = $this->injectJsonSchemaMock(
            new GraphicTypeValidator()
        );
    }

    /**
     * The validator MUST return errors if there is no solution with a positive score.
     */
    public function testNoSolutionWithPositiveScoreThrowsError()
    {
        $questionData = $this->loadTestData('question/graphic/invalid/no-solution-with-positive-score.json');

        $errors = $this->validator->validate($questionData, ['solutionsRequired' => true]);

        $this->assertGreaterThan(0, count($errors));
        $this->assertTrue(in_array([
            'path' => '/solutions',
            'message' => 'There is no solution with a positive score',
        ], $errors));
    }
}
