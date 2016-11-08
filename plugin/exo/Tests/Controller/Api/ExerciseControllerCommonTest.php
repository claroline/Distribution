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
class ExerciseControllerCommonTest extends TransactionalTestCase
{
    use RequestTrait;

    /** @var ObjectManager */
    private $om;
    /** @var Persister */
    private $persist;

    /**
     * @var PaperManager
     */
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

        $this->persist = new Persister($this->om, $this->paperManager);
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

    public function testAnonymousExport()
    {
        $this->request('GET', "/exercise/api/exercises/{$this->ex1->getUuid()}");
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }

    public function testNonCreatorExport()
    {
        $this->request('GET', "/exercise/api/exercises/{$this->ex1->getUuid()}", $this->bob);
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }

    public function testNonCreatorAdminExport()
    {
        $this->request('GET', "/exercise/api/exercises/{$this->ex1->getUuid()}", $this->admin);
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }

    public function testExport()
    {
        $this->request('GET', "/exercise/api/exercises/{$this->ex1->getUuid()}", $this->john);
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());

        $content = json_decode($this->client->getResponse()->getContent());
        $this->assertEquals($this->ex1->getUuid(), $content->id);
        $this->assertEquals('ex1', $content->title);
        $this->assertEquals('Invite...', $content->steps[0]->items[0]->content);
    }

    public function testAnonymousAttempt()
    {
        $this->request('POST', "/exercise/api/exercises/{$this->ex1->getId()}/attempts");
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }

    public function testAttempt()
    {
        $this->request('POST', "/exercise/api/exercises/{$this->ex1->getId()}/attempts", $this->john);
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());

        $content = json_decode($this->client->getResponse()->getContent());
        $this->assertInternalType('object', $content);
        $this->assertTrue(property_exists($content, 'questions'));
        $this->assertTrue(property_exists($content, 'paper'));
    }

    /**
     * Checks that a basic user (ie not admin of the resource)
     * Can not make a new attempt if max attempts is reached.
     */
    public function testAttemptMaxAttemptsReached()
    {
        // set exercise max attempts
        $this->ex1->setMaxAttempts(1);

        // first attempt for bob
        $paper = $this->paperManager->createPaper($this->ex1, $this->bob);

        // finish bob's first paper
        $this->paperManager->finishPaper($paper);

        $this->om->flush();

        // second attempt for bob
        $this->request('POST', "/exercise/api/exercises/{$this->ex1->getId()}/attempts", $this->bob);
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
        $content = json_decode($this->client->getResponse()->getContent());
        $this->assertEquals('Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException', $content->error->exception[0]->class);
        $this->assertEquals('max attempts reached', $content->error->exception[0]->message);
    }

    /**
     * Checks that an admin user (ie admin of the resource)
     * Can make a new attempt even if max attempts is reached.
     */
    public function testAttemptMaxAttemptsReachedAdmin()
    {
        // set exercise max attempts
        $this->ex1->setMaxAttempts(1);

        // first attempt for bob
        $paper = $this->paperManager->createPaper($this->ex1, $this->john);

        // finish john's first paper
        $this->paperManager->finishPaper($paper);

        $this->om->flush();

        // second attempt for john
        $this->request('POST', "/exercise/api/exercises/{$this->ex1->getId()}/attempts", $this->john);
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $content = json_decode($this->client->getResponse()->getContent());
        $this->assertInternalType('object', $content);
    }

    public function testAnonymousPapers()
    {
        $this->request('GET', "/exercise/api/exercises/{$this->ex1->getId()}/papers");
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }

    /**
     * Checks that as a "normal" user I'll only see my own papers even if another user's paper exists.
     */
    public function testUserPapers()
    {
        // creator of the resource is considered as administrator of the resource
        $pa1 = $this->paperManager->createPaper($this->ex1, $this->bob);

        // check that only one paper will be returned even if another user paper exists
        $this->paperManager->createPaper($this->ex1, $this->admin);

        $this->om->flush();

        $this->request('GET', "/exercise/api/exercises/{$this->ex1->getId()}/papers", $this->bob);
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());

        $content = json_decode($this->client->getResponse()->getContent());
        $this->assertEquals(1, count($content));
        $this->assertEquals($pa1->getId(), $content->papers[0]->id);
    }

    /**
     * Checks that as a "admin" user (ie creator of the exercise)
     * I'll see all exercise's papers.
     */
    public function testAdminPapers()
    {
        $pa1 = $this->paperManager->createPaper($this->ex1, $this->admin);
        $pa2 = $this->paperManager->createPaper($this->ex1, $this->john);
        $pa3 = $this->paperManager->createPaper($this->ex1, $this->bob);
        $pa4 = $this->paperManager->createPaper($this->ex1, $this->bob);
        $this->om->flush();

        $this->request('GET', "/exercise/api/exercises/{$this->ex1->getId()}/papers", $this->john);
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());

        $content = json_decode($this->client->getResponse()->getContent());
        $this->assertEquals(4, count($content->papers));
        $this->assertEquals($pa1->getId(), $content->papers[0]->id);
        $this->assertEquals($pa2->getId(), $content->papers[1]->id);
        $this->assertEquals($pa3->getId(), $content->papers[2]->id);
        $this->assertEquals($pa4->getId(), $content->papers[3]->id);
    }
}
