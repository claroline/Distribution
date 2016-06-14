<?php

namespace UJM\ExoBundle\Manager;

use Claroline\CoreBundle\Persistence\ObjectManager;
use Doctrine\Common\Collections\ArrayCollection;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Step;

class PaperManagerTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var PaperManager
     */
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

    public function testPickStepsShufflesThemIfNeeded()
    {
        $exercise = $this->mock('UJM\ExoBundle\Entity\Exercise');

        $exercise->expects($this->once())
            ->method('getShuffle')
            ->willReturn(true);

        $exercise->expects($this->once())
            ->method('getSteps')
            ->willReturn(new ArrayCollection([1, 2, 3, 4]));

        $steps = $this->manager->pickSteps($exercise);

        $this->assertEquals(4, count($steps));
        $this->assertNotEquals([1, 2, 3, 4], $steps);
    }

    public function testPickStepsDiscardsSomeIfNeeded()
    {
        $exercise = new Exercise();
        $exercise->setPickSteps(2);

        $exercise->addStep(new Step());
        $exercise->addStep(new Step());
        $exercise->addStep(new Step());

        $steps = $this->manager->pickSteps($exercise);

        $this->assertEquals(2, count($steps));
    }

    private function mock($class)
    {
        return $this->getMockBuilder($class)
            ->disableOriginalConstructor()
            ->getMock();
    }
}
