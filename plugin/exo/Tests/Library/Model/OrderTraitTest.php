<?php

namespace UJM\ExoBundle\Tests\Library\Model;

use UJM\ExoBundle\Library\Model\OrderTrait;

class OrderTraitTest extends \PHPUnit_Framework_TestCase
{
    /**
     * The trait MUST adds an `order` with its getter and setter in the class using it.
     */
    public function testInjectFeedback()
    {
        $mock = $this->getMockForTrait(OrderTrait::class);

        // Test getter
        $this->assertTrue(method_exists($mock, 'getOrder'));
        // Test setter
        $this->assertTrue(method_exists($mock, 'setOrder'));
    }
}
