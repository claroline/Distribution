<?php

namespace UJM\ExoBundle\Manager;

use Claroline\CoreBundle\Persistence\ObjectManager;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Step;
use UJM\ExoBundle\Manager\PaperManager;

class PaperManagerTest extends \PHPUnit_Framework_TestCase
{
    /** @var ObjectManager */
    private $om;

    /** @var PaperManager */
    private $manager;

    protected function setUp()
    {
        $this->om = $this->mock('Claroline\CoreBundle\Persistence\ObjectManager');

        $this->manager = new PaperManager(
            $this->om,
            $this->mock('Symfony\Component\EventDispatcher\EventDispatcherInterface'),
            $this->mock('UJM\ExoBundle\Transfer\Json\QuestionHandlerCollector'),
            $this->mock('UJM\ExoBundle\Manager\QuestionManager'),
            $this->mock('Symfony\Component\Translation\TranslatorInterface'),
            $this->mock('UJM\ExoBundle\Services\classes\PaperService')
        );
    }

    public function testPickQuestionsShufflesThemIfNeeded()
    {
        $exercise = new Exercise();
        $exercise->setShuffle(true);

        $exercise->addStep(new Step());
        $exercise->addStep(new Step());

        $this->om->persist($exercise);

        $questionRepo = $this->mock('UJM\ExoBundle\Repository\QuestionRepository');

        $this->om->expects($this->once())
            ->method('getRepository')
            ->with('UJMExoBundle:Question')
            ->willReturn($questionRepo);

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
        $exercise->setPickSteps(2);

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

    private function mock($class)
    {
        return $this->getMockBuilder($class)
            ->disableOriginalConstructor()
            ->getMock();
    }
}
