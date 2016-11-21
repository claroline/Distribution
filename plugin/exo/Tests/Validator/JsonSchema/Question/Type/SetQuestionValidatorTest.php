<?php

namespace UJM\ExoBundle\Tests\Validator\JsonSchema\Question\Type;

use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Testing\Json\JsonSchemaTestCase;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\SetQuestionValidator;

class SetQuestionValidatorTest extends JsonSchemaTestCase
{
    /**
     * @var SetQuestionValidator
     */
    private $validator;

    protected function setUp()
    {
        parent::setUp();

        $this->validator = $this->injectJsonSchemaMock(
            new SetQuestionValidator()
        );
    }

    /**
     * The validator MUST return errors if there is no solution with a positive score.
     */
    public function testNoSolutionWithPositiveScoreThrowsError()
    {
        $questionData = $this->loadTestData('question/set/invalid/no-solution-with-positive-score.json');

        $errors = $this->validator->validate($questionData, [Validation::REQUIRE_SOLUTIONS]);

        $this->assertGreaterThan(0, count($errors));
        $this->assertTrue(in_array([
            'path' => '/solutions',
            'message' => 'There is no solution with a positive score',
        ], $errors));
    }

    /**
     * The validator MUST return errors if the solution ids do not match member ids.
     */
    public function testIncoherentMemberIdsInSolutionThrowErrors()
    {
        $questionData = $this->loadTestData('question/set/invalid/incoherent-solution-member-ids.json');

        $errors = $this->validator->validate($questionData, [Validation::REQUIRE_SOLUTIONS]);

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

        $errors = $this->validator->validate($questionData, [Validation::REQUIRE_SOLUTIONS]);

        $this->assertGreaterThan(0, count($errors));
        $this->assertTrue(in_array([
            'path' => '/solutions[0]',
            'message' => "id 42 doesn't match any set id",
        ], $errors));
    }
}
