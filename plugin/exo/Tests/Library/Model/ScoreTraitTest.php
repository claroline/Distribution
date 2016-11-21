<?php

namespace UJM\ExoBundle\Tests\Library\Model;

use UJM\ExoBundle\Library\Model\ScoreTrait;

class ScoreTraitTest extends \PHPUnit_Framework_TestCase
{
    /**
     * The trait MUST adds a `score` with its getter and setter in the class using it.
     */
    public function testInjectScore()
    {
        $mock = $this->getMockForTrait(ScoreTrait::class);

        // Test getter
        $this->assertTrue(method_exists($mock, 'getScore'));
        // Test setter
        $this->assertTrue(method_exists($mock, 'setScore'));
    }
}
