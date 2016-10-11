<?php

namespace UJM\ExoBundle\Manager;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Persistence\ObjectManager;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Transfer\Json\Validator;

class ExerciseManagerTest extends \PHPUnit_Framework_TestCase
{
    /** @var ObjectManager */
    private $om;
    /** @var Validator */
    private $validator;
    /** @var ExerciseManager */
    private $manager;

    protected function setUp()
    {
        $this->om = $this->mock('Claroline\CoreBundle\Persistence\ObjectManager');
        $this->validator = $this->mock('UJM\ExoBundle\Transfer\Json\Validator');
        $newValidator = $this->mock('UJM\ExoBundle\Validator\JsonSchema\ExerciseValidator');
        $serializer = $this->mock('UJM\ExoBundle\Serializer\ExerciseSerializer');
        $stepManager = $this->mock('UJM\ExoBundle\Manager\StepManager');
        $this->manager = new ExerciseManager($this->om, $newValidator, $this->validator, $serializer, $stepManager);
    }

    /**
     * @expectedException \LogicException
     */
    public function testPublishThrowsIfExerciseIsPublished()
    {
        $node = new ResourceNode();
        $node->setPublished(true);
        $exercise = new Exercise();
        $exercise->setResourceNode($node);

        $this->manager->publish($exercise);
    }

    public function testPublishOncePublishedExercise()
    {
        $node = new ResourceNode();
        $node->setPublished(false);
        $exercise = new Exercise();
        $exercise->setPublishedOnce(true);
        $exercise->setResourceNode($node);

        $this->om->expects($this->once())->method('flush');

        $this->manager->publish($exercise);

        $this->assertTrue($node->isPublished());
    }

    public function testPublishNeverPublishedExerciseDeleteItsPapers()
    {
        $this->markTestIncomplete('Not implemented yet');
    }

    /**
     * @expectedException \LogicException
     */
    public function testPublishThrowsIfExerciseIsUnpublished()
    {
        $node = new ResourceNode();
        $node->setPublished(false);
        $exercise = new Exercise();
        $exercise->setResourceNode($node);

        $this->manager->unpublish($exercise);
    }

    public function testUnpublish()
    {
        $node = new ResourceNode();
        $node->setPublished(true);
        $exercise = new Exercise();
        $exercise->setResourceNode($node);

        $this->om->expects($this->once())->method('flush');

        $this->manager->unpublish($exercise);

        $this->assertFalse($node->isPublished());
    }

    /**
     * @dataProvider validQuizProvider
     *
     * @param string $dataFilename
     */
    public function testSchemaRoundTrip($dataFilename)
    {
        $this->markTestIncomplete('Not implemented, should not use a mock');
    }

    private function mock($class)
    {
        return $this->getMockBuilder($class)
            ->disableOriginalConstructor()
            ->getMock();
    }

    public function validQuizProvider()
    {
        return [
            ['quiz-metadata.json'],
        ];
    }
}
