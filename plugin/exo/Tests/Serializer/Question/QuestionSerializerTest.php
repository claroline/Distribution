<?php

namespace UJM\ExoBundle\Tests\Serializer\Question;

use UJM\ExoBundle\Library\Testing\Json\JsonDataTestCase;
use UJM\ExoBundle\Serializer\Question\QuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Question\QuestionValidator;

class QuestionSerializerTest extends JsonDataTestCase
{
    /**
     * @var QuestionValidator
     */
    private $validator;

    /**
     * @var QuestionSerializer
     */
    private $serializer;

    protected function setUp()
    {
        parent::setUp();

        // We trust validator service as it is fully tested
        $this->validator = $this->client->getContainer()->get('ujm_exo.validator.question');
        $this->serializer = $this->client->getContainer()->get('ujm_exo.serializer.question');
    }

    public function testSerializedDataAreSchemaValid()
    {
    }

    public function testSerializedDataAreCorrectlySet()
    {
    }

    public function testDeserializedDataAreCorrectlySet()
    {
    }

    public function testAddHint()
    {
    }

    public function testRemoveHint()
    {
    }

    public function testAddQuestionObject()
    {
    }

    public function testRemoveQuestionObject()
    {
    }

    public function testAddQuestionResource()
    {
    }

    public function testRemoveQuestionResource()
    {
    }
}
