<?php

namespace UJM\ExoBundle\Tests\Serializer;

use UJM\ExoBundle\Library\Testing\Json\JsonDataTestCase;

class ExerciseSerializerTest extends JsonDataTestCase
{
    private $validator;

    private $serializer;

    protected function setUp()
    {
        parent::setUp();

        // We trust validator service as it is fully tested
        $this->validator = $this->client->getContainer()->get('ujm_exo.validator.exercise');
        $this->serializer = $this->client->getContainer()->get('ujm_exo.serializer.exercise');
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
}
