<?php

namespace UJM\ExoBundle\Tests\Library\Model;

use UJM\ExoBundle\Library\Model\PenaltyTrait;

class PenaltyTraitTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    private $mock;

    protected function setUp(): void
    {
        parent::setUp();

        // Creates a mock using the trait
        $this->mock = $this->getMockForTrait(PenaltyTrait::class);
    }

    /**
     * The trait MUST adds a `penalty` with its getter and setter in the class using it.
     */
    public function testInjectScore()
    {
        // Test getter
        $this->assertTrue(method_exists($this->mock, 'getPenalty'));
        // Test setter
        $this->assertTrue(method_exists($this->mock, 'setPenalty'));
    }
}
