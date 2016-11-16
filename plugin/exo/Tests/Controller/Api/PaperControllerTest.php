<?php

namespace UJM\ExoBundle\Tests\Controller\Api;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Testing\RequestTrait;
use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use Claroline\CoreBundle\Persistence\ObjectManager;
use UJM\ExoBundle\Entity\Choice;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Hint;
use UJM\ExoBundle\Entity\Question;
use UJM\ExoBundle\Library\Testing\Persister;
use UJM\ExoBundle\Manager\PaperManager;

/**
 * Tests that are common to all exercise / question types.
 */
class PaperControllerTest extends TransactionalTestCase
{
    use RequestTrait;

    /** @var ObjectManager */
    private $om;
    /** @var Persister */
    private $persist;
    /** @var PaperManager */
    private $paperManager;
    /** @var User */
    private $john;
    /** @var User */
    private $bob;
    /** @var User */
    private $admin;
    /** @var Choice */
    private $ch1;
    /** @var Choice */
    private $ch2;
    /** @var Question */
    private $qu1;
    /** @var Hint */
    private $hi1;
    /** @var Exercise */
    private $ex1;

    protected function setUp()
    {
        parent::setUp();
        $this->om = $this->client->getContainer()->get('claroline.persistence.object_manager');
        $this->paperManager = $this->client->getContainer()->get('ujm.exo.paper_manager');

        $this->persist = new Persister($this->om);
        $this->john = $this->persist->user('john');
        $this->bob = $this->persist->user('bob');

        $this->persist->role('ROLE_ADMIN');
        $this->admin = $this->persist->user('admin');

        $this->ch1 = $this->persist->qcmChoice('ch1', 1, 1);
        $this->ch2 = $this->persist->qcmChoice('ch2', 2, 0);
        $this->qu1 = $this->persist->qcmQuestion('qu1', [$this->ch1, $this->ch2]);
        $this->hi1 = $this->persist->hint($this->qu1, 'hi1');
        $this->ex1 = $this->persist->exercise('ex1', [$this->qu1], $this->john);

        // Set up Exercise permissions
        // create 'open' mask in db
        $type = $this->ex1->getResourceNode()->getResourceType();
        $this->persist->maskDecoder($type, 'open', 1);
        $this->om->flush();

        $rightsManager = $this->client->getContainer()->get('claroline.manager.rights_manager');
        $roleManager = $this->client->getContainer()->get('claroline.manager.role_manager');

        // add open permissions to all users
        $rightsManager->editPerms(1, $roleManager->getRoleByName('ROLE_USER'), $this->ex1->getResourceNode());

        $this->om->flush();
    }

    public function testUserPaper()
    {
        // create one paper
        $pa1 = $this->paperManager->createPaper($this->ex1, $this->bob);

        // create another one
        $this->paperManager->createPaper($this->ex1, $this->bob);

        $this->om->flush();

        $this->request('GET', "/api/papers/{$pa1->getId()}", $this->bob);
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $content = json_decode($this->client->getResponse()->getContent());
        $this->assertEquals($pa1->getId(), $content->paper->id);
        $this->assertEquals(1, count($content->paper));
    }

    public function testAnonymousSubmit()
    {
        $pa1 = $this->paperManager->createPaper($this->ex1, $this->john);
        $this->om->flush();

        $step = $this->ex1->getSteps()->get(0);

        $this->request('PUT', "/api/papers/{$pa1->getId()}/steps/{$step->getId()}");
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }

    public function testSubmitAnswerAfterPaperEnd()
    {
        $pa1 = $this->paperManager->createPaper($this->ex1, $this->john);
        $date = new \DateTime();
        $date->add(\DateInterval::createFromDateString('yesterday'));
        $pa1->setEnd($date);
        $this->om->flush();

        $step = $this->ex1->getSteps()->get(0);

        $this->request('PUT', "/api/papers/{$pa1->getId()}/steps/{$step->getId()}", $this->john);
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }

    public function testSubmitAnswerByNotPaperUser()
    {
        $pa1 = $this->paperManager->createPaper($this->ex1, $this->john);
        $this->om->flush();

        $step = $this->ex1->getSteps()->get(0);

        $this->request('PUT', "/api/papers/{$pa1->getId()}/steps/{$step->getId()}", $this->bob);
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }

    public function testFinishPaperByNotPaperCreator()
    {
        $pa1 = $this->paperManager->createPaper($this->ex1, $this->john);
        $this->om->flush();

        $this->request('PUT', "/api/papers/{$pa1->getId()}/end", $this->bob);
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }

    public function testFinishPaper()
    {
        $pa1 = $this->paperManager->createPaper($this->ex1, $this->john);
        $this->om->flush();

        // end the paper
        $this->request('PUT', "/api/papers/{$pa1->getId()}/end", $this->john);

        // Check if the Paper has been correctly updated
        $this->assertFalse($pa1->getInterupt());
        $this->assertTrue($pa1->getEnd() !== null);

        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());

        // Check the paper is correctly returned to User
        $content = json_decode($this->client->getResponse()->getContent());
        $this->assertInternalType('object', $content);
    }
}
