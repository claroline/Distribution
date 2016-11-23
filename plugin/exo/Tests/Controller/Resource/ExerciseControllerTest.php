<?php

namespace UJM\ExoBundle\Tests\Controller\Resource;

use Claroline\CoreBundle\Library\Testing\RequestTrait;
use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use Claroline\CoreBundle\Persistence\ObjectManager;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Library\Testing\Persister;

class ExerciseControllerTest extends TransactionalTestCase
{
    use RequestTrait;

    /** @var ObjectManager */
    private $om;
    /** @var Persister */
    private $persist;

    /** @var Exercise */
    private $exercise;

    public function setUp()
    {
        parent::setUp();

        $this->om = $this->client->getContainer()->get('claroline.persistence.object_manager');
        $this->persist = new Persister($this->om);

        $user = $this->persist->user('user');
        $this->exercise = $this->persist->exercise('exercise', [], $user);
        $this->om->flush();
    }

    /**
     * The exercise open action MUST renders the HTML view without errors.
     */
    public function testOpenRendersView()
    {
        $crawler = $this->request('GET', "/exercises/{$this->exercise->getId()}");
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());

        $this->assertTrue($crawler->filter('html')->count() > 0);
    }

    /**
     * The exercise docimology action MUST renders the HTML view without errors.
     */
    public function testDocimologyRendersView()
    {

    }
}
