<?php

namespace Claroline\CoreBundle\Tests\NewAPI;

use Claroline\CoreBundle\API\SerializerProvider;
use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;

class SerializerProviderTest extends TransactionalTestCase
{
    /** @var SerializerProvider */
    private $provider;
    /** @var mixed[] */
    private $serializers;

    protected function setUp()
    {
        parent::setUp();
        $this->provider = $this->client->getContainer()->get('claroline.api.serializer');
    }

    /**
     * @dataProvider getHandledClassesProvider
     *
     * @param string $class
     *
     * If json il malformed, a syntax error will be thrown
     */
    public function testSchema($class)
    {
        if ($this->provider->hasSchema($class)) {
            $schema = $this->provider->getSchema($class);
            $this->assertTrue(is_object($schema));
        } else {
            $this->markTestSkipped('No schema defined');
        }
    }

    /**
     * @return [][]
     */
    public function getHandledClassesProvider()
    {
        parent::setUp();
        $provider = $this->client->getContainer()->get('claroline.api.serializer');

        return array_map(function ($serializer) use ($provider) {
            return [$provider->getSerializerHandledClass($serializer)];
        }, $provider->all());
    }
}
