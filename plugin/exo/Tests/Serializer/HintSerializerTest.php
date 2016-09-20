<?php

namespace UJM\ExoBundle\Tests\Serializer;

use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use UJM\ExoBundle\Entity\Hint;
use UJM\ExoBundle\Serializer\HintSerializer;
use UJM\ExoBundle\Validator\JsonSchema\HintValidator;

class HintSerializerTest extends TransactionalTestCase
{
    /**
     * @var HintValidator
     */
    private $validator;

    /**
     * @var HintSerializer
     */
    private $serializer;

    private $hint;

    protected function setUp()
    {
        parent::setUp();

        // We trust validator service as it is fully tested
        $this->validator = $this->client->getContainer()->get('ujm_exo.validator.hint');
        $this->serializer = $this->client->getContainer()->get('ujm_exo.serializer.hint');

        $this->hint = new Hint();
        $this->hint->setPenalty(2);
        $this->hint->setValue('hint text');
    }

    public function testSerializedDataAreSchemaValid()
    {
        $serialized = $this->serializer->serialize($this->hint);

        $this->assertCount(0, $this->validator->validate($serialized));
    }

    public function testSerializedDataAreCorrectlySet()
    {
        $serialized = $this->serializer->serialize($this->hint);

        $this->assertInstanceOf('\stdClass', $serialized);
        $this->assertEquals(2, $serialized->penalty);

        // Checks solutions are not included
        $this->assertTrue(!isset($serialized->value));
    }

    public function testSerializedDataWithNoPenalty()
    {
        $serialized = $this->serializer->serialize(new Hint());

        $this->assertTrue(!isset($serialized->penalty));
    }

    public function testSerializedDataWithSolutions()
    {
        $serialized = $this->serializer->serialize($this->hint, ['includeSolutions' => true]);

        $this->assertEquals('hint text', $serialized->value);
    }

    public function testDeserializedDataAreCorrectlySet()
    {
        $hintData = new \stdClass();

        $hintData->penalty = 2;
        $hintData->value = 'hint text';

        $deserialized = $this->serializer->deserialize($hintData);

        $this->assertInstanceOf('UJM\ExoBundle\Entity\Hint', $deserialized);
        $this->assertEquals(2, $deserialized->getPenalty());
        $this->assertEquals('hint text', $deserialized->getValue());
    }
}
