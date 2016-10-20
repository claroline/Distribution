<?php

namespace UJM\ExoBundle\Tests\Serializer;

use UJM\ExoBundle\Library\Testing\Json\JsonDataTestCase;
use UJM\ExoBundle\Serializer\StepSerializer;
use UJM\ExoBundle\Validator\JsonSchema\StepValidator;

class StepSerializerTest extends JsonDataTestCase
{
    /**
     * @var StepValidator
     */
    private $validator;

    /**
     * @var StepSerializer
     */
    private $serializer;

    protected function setUp()
    {
        parent::setUp();

        // We trust validator service as it is fully tested
        $this->validator = $this->client->getContainer()->get('ujm_exo.validator.step');
        $this->serializer = $this->client->getContainer()->get('ujm_exo.serializer.step');
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

    public function testAddItem()
    {
    }

    public function testRemoveItem()
    {
    }
}
