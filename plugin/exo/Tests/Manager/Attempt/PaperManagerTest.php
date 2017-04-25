<?php

namespace UJM\ExoBundle\Tests\Manager\Attempt;

use Claroline\CoreBundle\Persistence\ObjectManager;
use UJM\ExoBundle\Entity\Attempt\Paper;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Manager\Attempt\PaperManager;
use UJM\ExoBundle\Serializer\Attempt\PaperSerializer;

class PaperManagerTest extends \PHPUnit_Framework_TestCase
{
    /** @var ObjectManager|\PHPUnit_Framework_MockObject_MockObject */
    private $om;
    /** @var PaperSerializer|\PHPUnit_Framework_MockObject_MockObject */
    private $serializer;
    /** @var PaperManager */
    private $manager;

    protected function setUp()
    {
        $this->om = $this->mock('Claroline\CoreBundle\Persistence\ObjectManager');
        $this->serializer = $this->mock('UJM\ExoBundle\Serializer\Attempt\PaperSerializer');

        $this->manager = new PaperManager(
            $this->om,
            $this->mock('Symfony\Component\EventDispatcher\EventDispatcherInterface'),
            $this->serializer,
            $this->mock('UJM\ExoBundle\Manager\Item\ItemManager'),
            $this->mock('UJM\ExoBundle\Serializer\Item\ItemSerializer')
        );
    }

    public function testSerialize()
    {
        $paper = new Paper();
        $exercise = new Exercise();
        $paper->setExercise($exercise);
        $options = [
            'an array of options',
        ];

        // Checks the serializer is called
        $this->serializer->expects($this->once())
            ->method('serialize')
            ->with($paper, $options)
            ->willReturn(new \stdClass());

        $data = $this->manager->serialize($paper, $options);

        // Checks the result of the serializer is returned
        $this->assertInstanceOf('\stdClass', $data);
    }

    private function mock($class)
    {
        return $this->getMockBuilder($class)
            ->disableOriginalConstructor()
            ->getMock();
    }
}
