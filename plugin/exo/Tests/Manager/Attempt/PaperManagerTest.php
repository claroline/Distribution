<?php

namespace UJM\ExoBundle\Tests\Manager\Attempt;

use Claroline\CoreBundle\Persistence\ObjectManager;
use Doctrine\Common\Collections\ArrayCollection;
use UJM\ExoBundle\Entity\Attempt\Paper;
use UJM\ExoBundle\Library\Attempt\PaperGenerator;
use UJM\ExoBundle\Manager\Attempt\PaperManager;

class PaperManagerTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @var ObjectManager|\PHPUnit_Framework_MockObject_MockObject
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
            $this->mock('UJM\ExoBundle\Serializer\PaperSerializer'),
            $this->mock('UJM\ExoBundle\Manager\Question\QuestionManager')
        );
    }
    
    private function mock($class)
    {
        return $this->getMockBuilder($class)
            ->disableOriginalConstructor()
            ->getMock();
    }
}
