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
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    public function testSerializedDataAreCorrectlySet()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    public function testDeserializedDataAreCorrectlySet()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    public function testAddItem()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    public function testRemoveItem()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }
}
