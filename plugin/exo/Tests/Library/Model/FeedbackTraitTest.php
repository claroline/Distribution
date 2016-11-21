<?php

namespace UJM\ExoBundle\Tests\Library\Model;

use UJM\ExoBundle\Library\Model\FeedbackTrait;

class FeedbackTraitTest extends \PHPUnit_Framework_TestCase
{
    /**
     * The trait MUST adds a `feedback` with its getter and setter in the class using it.
     */
    public function testInjectFeedback()
    {
        $mock = $this->getMockForTrait(FeedbackTrait::class);

        // Test getter
        $this->assertTrue(method_exists($mock, 'getFeedback'));
        // Test setter
        $this->assertTrue(method_exists($mock, 'setFeedback'));
    }
}
