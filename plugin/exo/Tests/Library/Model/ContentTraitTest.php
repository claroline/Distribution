<?php

namespace UJM\ExoBundle\Tests\Library\Model;

use UJM\ExoBundle\Library\Model\ContentTrait;

class ContentTraitTest extends \PHPUnit_Framework_TestCase
{
    /**
     * The trait MUST adds a `resourceNode` with its getter and setter in the class using it.
     */
    public function testInjectResourceNode()
    {
        $mock = $this->getMockForTrait(ContentTrait::class);

        // Test getter
        $this->assertTrue(method_exists($mock, 'getResourceNode'));
        // Test setter
        $this->assertTrue(method_exists($mock, 'setResourceNode'));
    }

    /**
     * The trait MUST adds a `data` with its getter and setter in the class using it.
     */
    public function testInjectData()
    {
        $mock = $this->getMockForTrait(ContentTrait::class);

        // Test getter
        $this->assertTrue(method_exists($mock, 'getData'));
        // Test setter
        $this->assertTrue(method_exists($mock, 'setData'));
    }
}
