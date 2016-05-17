<?php

namespace UJM\ExoBundle\Manager;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Persistence\ObjectManager;
use HeVinci\CompetencyBundle\Transfer\Validator;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Step;

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
        $stepManager = $this->mock('UJM\ExoBundle\Manager\StepManager');
        $this->manager = new ExerciseManager($this->om, $this->validator, $stepManager);
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

    public function testPickQuestionsShufflesThemIfNeeded()
    {
        $exercise = new Exercise();
        $exercise->setShuffle(true);

        $stepRepo = $this->mock('UJM\ExoBundle\Repository\StepRepository');
        $questionRepo = $this->mock('UJM\ExoBundle\Repository\QuestionRepository');

        $this->om->expects($this->at(0))
            ->method('getRepository')
            ->with('UJMExoBundle:Step')
            ->willReturn($stepRepo);
        $this->om->expects($this->at(1))
            ->method('getRepository')
            ->with('UJMExoBundle:Question')
            ->willReturn($questionRepo);

        $stepRepo->expects($this->once())
            ->method('findByExercise')
            ->with($exercise)
            ->willReturn([new Step(), new Step()]);
        $questionRepo->expects($this->exactly(2))
            ->method('findByStep')
            ->willReturnOnConsecutiveCalls([1, 2, 3], [4, 5]);

        $questions = $this->manager->pickQuestions($exercise);
        $this->assertEquals(5, count($questions));
        $this->assertNotEquals([1, 2, 3, 4, 5], $questions);
        $this->assertContains(1, $questions);
        $this->assertContains(2, $questions);
        $this->assertContains(3, $questions);
        $this->assertContains(4, $questions);
        $this->assertContains(5, $questions);
    }

    public function testPickQuestionsDiscardsSomeIfNeeded()
    {
        $exercise = new Exercise();
        $exercise->setNbQuestion(2);

        $stepRepo = $this->mock('UJM\ExoBundle\Repository\StepRepository');
        $questionRepo = $this->mock('UJM\ExoBundle\Repository\QuestionRepository');

        $this->om->expects($this->at(0))
            ->method('getRepository')
            ->with('UJMExoBundle:Step')
            ->willReturn($stepRepo);
        $this->om->expects($this->at(1))
            ->method('getRepository')
            ->with('UJMExoBundle:Question')
            ->willReturn($questionRepo);

        $stepRepo->expects($this->once())
            ->method('findByExercise')
            ->with($exercise)
            ->willReturn([new Step(), new Step()]);
        $questionRepo->expects($this->exactly(2))
            ->method('findByStep')
            ->willReturnOnConsecutiveCalls([1, 2], [3, 4]);

        $questions = $this->manager->pickQuestions($exercise);
        $this->assertEquals(2, count($questions));
        $this->assertContains($questions[0], [1, 2, 3, 4]);
        $this->assertContains($questions[1], [1, 2, 3, 4]);
    }

    /**
     * @expectedException \UJM\ExoBundle\Transfer\Json\ValidationException
     */
    public function testImportExerciseThrowsOnValidationError()
    {
        $this->validator->expects($this->once())
            ->method('validateExercise')
            ->willReturn([['path' => '', 'message' => 'some error']]);
        $this->manager->importExercise('{}');
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
