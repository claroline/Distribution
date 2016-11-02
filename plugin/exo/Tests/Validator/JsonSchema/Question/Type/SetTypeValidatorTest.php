<?php

namespace UJM\ExoBundle\Tests\Validator\JsonSchema\Question\Type;

use UJM\ExoBundle\Library\Testing\Json\JsonSchemaTestCase;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\SetTypeValidator;

class SetTypeValidatorTest extends JsonSchemaTestCase
{
    /**
     * @var SetTypeValidator
     */
    private $validator;

    protected function setUp()
    {
        parent::setUp();

        $this->validator = $this->injectJsonSchemaMock(
            new SetTypeValidator()
        );
    }

    /**
     * The validator MUST return errors if the solution ids do not match member ids.
     */
    public function testIncoherentMemberIdsInSolutionThrowErrors()
    {
        $questionData = $this->loadTestData('question/set/invalid/incoherent-solution-member-ids.json');

        $errors = $this->validator->validate($questionData, ['solutionsRequired' => true]);

        $this->assertGreaterThan(0, count($errors));
        $this->assertTrue(in_array([
            'path' => '/solutions[0]',
            'message' => "id 42 doesn't match any member id",
        ], $errors));
    }

    /**
     * The validator MUST return errors if the solution ids do not match set ids.
     */
    public function testIncoherentSetIdsInSolutionThrowErrors()
    {
        $questionData = $this->loadTestData('question/set/invalid/incoherent-solution-set-ids.json');

        $errors = $this->validator->validate($questionData, ['solutionsRequired' => true]);

        $this->assertGreaterThan(0, count($errors));
        $this->assertTrue(in_array([
            'path' => '/solutions[0]',
            'message' => "id 42 doesn't match any set id",
        ], $errors));
    }
}
