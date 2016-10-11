<?php

namespace UJM\ExoBundle\Tests\Validator\JsonSchema\Question\Type;

use UJM\ExoBundle\Library\Testing\Json\JsonSchemaTestCase;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\MatchTypeValidator;

class MatchTypeValidatorTest extends JsonSchemaTestCase
{
    /**
     * @var MatchTypeValidator
     */
    private $validator;

    protected function setUp()
    {
        parent::setUp();

        $this->validator = $this->injectJsonSchemaMock(
            new MatchTypeValidator()
        );
    }

    /**
     * The validator MUST return errors if there is no solution with a positive score.
     */
    public function testNoSolutionWithPositiveScoreThrowsError()
    {
    }

    /**
     * The validator MUST return errors if the solution ids do not match label/proposal ids.
     */
    public function testIncoherentIdsInSolutionThrowErrors()
    {
    }
}
