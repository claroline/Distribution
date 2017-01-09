<?php

namespace UJM\ExoBundle\Tests\Manager;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Persistence\ObjectManager;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Manager\Attempt\PaperManager;
use UJM\ExoBundle\Manager\ExerciseManager;
use UJM\ExoBundle\Serializer\ExerciseSerializer;

class ExerciseManagerTest extends \PHPUnit_Framework_TestCase
{
    /** @var ObjectManager|\PHPUnit_Framework_MockObject_MockObject */
    private $om;
    /** @var ExerciseSerializer|\PHPUnit_Framework_MockObject_MockObject */
    private $serializer;
    /** @var PaperManager|\PHPUnit_Framework_MockObject_MockObject */
    private $paperManager;
    /** @var ExerciseManager */
    private $manager;
    /** @var Exercise */
    private $exercise;

    protected function setUp()
    {
        // Mock dependencies of the manager
        $this->om = $this->mock('Claroline\CoreBundle\Persistence\ObjectManager');
        $validator = $this->mock('UJM\ExoBundle\Validator\JsonSchema\ExerciseValidator');
        $this->serializer = $this->mock('UJM\ExoBundle\Serializer\ExerciseSerializer');
        $this->paperManager = $this->mock('UJM\ExoBundle\Manager\Attempt\PaperManager');

        $this->manager = new ExerciseManager($this->om, $validator, $this->serializer, $this->paperManager);

        $node = new ResourceNode();
        $this->exercise = new Exercise();
        $this->exercise->setResourceNode($node);
    }

    public function testExport()
    {
        $options = [
            'an array of options',
        ];

        // Checks the serializer is called
        $this->serializer->expects($this->once())
            ->method('serialize')
            ->with($this->exercise, $options)
            ->willReturn(new \stdClass());

        $data = $this->manager->export($this->exercise, $options);

        // Checks the result of the serializer is returned
        $this->assertInstanceOf('\stdClass', $data);
    }

    public function testUpdate()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * @expectedException \UJM\ExoBundle\Library\Validator\ValidationException
     */
    public function testUpdateWithInvalidData()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    public function testUpdateInvalidatePapers()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    public function testCopy()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * An exercise MUST be deletable if it's not published or have no paper.
     */
    public function testIsDeletableIfNoPapers()
    {
        $this->paperManager->expects($this->any())
            ->method('countExercisePapers')
            ->willReturn(0);
        $this->exercise->getResourceNode()->setPublished(true);

        $this->assertTrue($this->manager->isDeletable($this->exercise));
    }

    /**
     * An exercise MUST be deletable if it's not published or has no paper.
     */
    public function testIsDeletableIfNotPublished()
    {
        $this->paperManager->expects($this->any())
            ->method('countExercisePapers')
            ->willReturn(10);
        $this->exercise->getResourceNode()->setPublished(false);

        $this->assertTrue($this->manager->isDeletable($this->exercise));
    }

    /**
     * An exercise MUST NOT be deletable if it's published and has papers.
     */
    public function testIsNotDeletable()
    {
        $this->paperManager->expects($this->once())
            ->method('countExercisePapers')
            ->willReturn(2);

        $this->exercise->getResourceNode()->setPublished(true);

        $this->assertFalse($this->manager->isDeletable($this->exercise));
    }

    public function testPublishOncePublishedExercise()
    {
        $this->exercise->getResourceNode()->setPublished(false);
        $this->exercise->setPublishedOnce(true);

        $this->om->expects($this->once())->method('flush');

        $this->manager->publish($this->exercise);

        $this->assertTrue($this->exercise->getResourceNode()->isPublished());

        // Checks papers have been untouched
        $this->paperManager->expects($this->never())->method('deleteAll');
    }

    public function testPublishNeverPublishedExerciseDeleteItsPapers()
    {
        $this->exercise->getResourceNode()->setPublished(false);
        $this->exercise->setPublishedOnce(false);

        $this->om->expects($this->once())->method('flush');
        // Checks papers have been deleted
        $this->paperManager->expects($this->once())->method('deleteAll');

        $this->manager->publish($this->exercise);

        // Checks published flags
        $this->assertTrue($this->exercise->getResourceNode()->isPublished());
        $this->assertTrue($this->exercise->wasPublishedOnce());
    }

    public function testUnpublish()
    {
        $this->exercise->getResourceNode()->setPublished(true);
        $this->exercise->setPublishedOnce(true);

        $this->om->expects($this->once())->method('flush');

        $this->manager->unpublish($this->exercise);

        $this->assertFalse($this->exercise->getResourceNode()->isPublished());
        $this->assertTrue($this->exercise->wasPublishedOnce());
    }

    private function mock($class)
    {
        return $this->getMockBuilder($class)
            ->disableOriginalConstructor()
            ->getMock();
    }
}
