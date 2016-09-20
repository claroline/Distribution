<?php

namespace UJM\ExoBundle\Tests\Serializer\Question;

use UJM\ExoBundle\Library\Testing\Json\JsonDataTestCase;

class QuestionSerializerTest extends JsonDataTestCase
{
    private $validator;

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
