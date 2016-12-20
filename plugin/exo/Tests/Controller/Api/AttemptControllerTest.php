<?php

namespace UJM\ExoBundle\Tests\Controller\Api;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Testing\RequestTrait;
use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use Claroline\CoreBundle\Persistence\ObjectManager;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Misc\Choice;
use UJM\ExoBundle\Entity\Question\Hint;
use UJM\ExoBundle\Entity\Question\Question;
use UJM\ExoBundle\Library\Attempt\PaperGenerator;
use UJM\ExoBundle\Library\Testing\Persister;
use UJM\ExoBundle\Manager\AttemptManager;

/**
 * Tests that are common to all exercise / question types.
 */
class AttemptControllerTest extends TransactionalTestCase
{
    use RequestTrait;

    /** @var ObjectManager */
    private $om;
    /** @var Persister */
    private $persist;
    /** @var AttemptManager */
    private $attemptManager;
    /** @var User */
    private $john;
    /** @var User */
    private $bob;
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
        $this->attemptManager = $this->client->getContainer()->get('ujm_exo.manager.attempt');

        $this->persist = new Persister($this->om);
        $this->john = $this->persist->user('john');
        $this->bob = $this->persist->user('bob');

        $this->ch1 = $this->persist->qcmChoice('ch1', 1, 1);
        $this->ch2 = $this->persist->qcmChoice('ch2', 2, 0);
        $this->qu1 = $this->persist->choiceQuestion('qu1', [$this->ch1, $this->ch2]);
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

    public function testAnonymousAttempt()
    {
        $this->request('POST', "/api/exercises/{$this->ex1->getUuid()}/attempts");
        $this->assertEquals(401, $this->client->getResponse()->getStatusCode());
    }

    public function testNewAttempt()
    {
        $this->request('POST', "/api/exercises/{$this->ex1->getUuid()}/attempts", $this->john);
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());

        $content = json_decode($this->client->getResponse()->getContent());
        $this->assertInternalType('object', $content);
        $this->assertTrue(property_exists($content, 'id'));
        $this->assertTrue(property_exists($content, 'structure'));
    }

    public function testContinueAttempt()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Checks that a basic user (ie not admin of the resource)
     * Can not make a new attempt if max attempts is reached.
     */
    public function testAttemptMaxAttemptsReached()
    {
        // set exercise max attempts
        $this->ex1->setMaxAttempts(1);
        $this->om->persist($this->ex1);

        // first attempt for bob
        $paper = PaperGenerator::create($this->ex1, $this->bob);
        $this->om->persist($paper);

        $this->om->flush();

        // finish bob's first paper
        $this->attemptManager->end($paper);

        // second attempt for bob
        $this->request('POST', "/api/exercises/{$this->ex1->getUuid()}/attempts", $this->bob);
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }

    /**
     * Checks that an admin user (ie admin of the resource)
     * Can make a new attempt even if max attempts is reached.
     */
    public function testAttemptMaxAttemptsReachedAdmin()
    {
        // set exercise max attempts
        $this->ex1->setMaxAttempts(1);
        $this->om->persist($this->ex1);

        // first attempt for bob
        $paper = PaperGenerator::create($this->ex1, $this->john);
        $this->om->persist($paper);
        $this->om->flush();

        // finish john's first paper
        $this->attemptManager->end($paper);
        $this->om->flush();

        // second attempt for john
        $this->request('POST', "/api/exercises/{$this->ex1->getUuid()}/attempts", $this->john);
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $content = json_decode($this->client->getResponse()->getContent());
        $this->assertInternalType('object', $content);
    }

    public function testAnonymousSubmit()
    {
        $pa1 = PaperGenerator::create($this->ex1, $this->john);
        $this->om->persist($pa1);
        $this->om->flush();

        $this->request('PUT', "/api/exercises/{$this->ex1->getUuid()}/attempts/{$pa1->getUuid()}");
        $this->assertEquals(401, $this->client->getResponse()->getStatusCode());
    }

    public function testSubmitAfterPaperEnd()
    {
        $pa1 = PaperGenerator::create($this->ex1, $this->john);
        $date = new \DateTime();
        $date->add(\DateInterval::createFromDateString('yesterday'));
        $pa1->setEnd($date);

        $this->om->persist($pa1);
        $this->om->flush();

        $this->request('PUT', "/api/exercises/{$this->ex1->getUuid()}/attempts/{$pa1->getUuid()}", $this->john);
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }

    public function testSubmitByNotPaperUser()
    {
        $pa1 = PaperGenerator::create($this->ex1, $this->john);
        $this->om->persist($pa1);
        $this->om->flush();

        $this->request('PUT', "/api/exercises/{$this->ex1->getUuid()}/attempts/{$pa1->getUuid()}", $this->bob);
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }

    public function testSubmit()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet. This needs to use a data provider to submit answers of all types.'
        );

        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }

    public function testSubmitInvalidData()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet. This needs to use a data provider to submit answers of all types.'
        );

        $this->assertEquals(422, $this->client->getResponse()->getStatusCode());

        $content = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertTrue(is_array($content));
        $this->assertTrue(count($content) > 0);
    }

    public function testFinishPaperByNotPaperUser()
    {
        $pa1 = PaperGenerator::create($this->ex1, $this->john);
        $this->om->persist($pa1);
        $this->om->flush();

        $this->request('PUT', "/api/exercises/{$this->ex1->getUuid()}/attempts/{$pa1->getUuid()}/end", $this->bob);
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }

    public function testFinishPaper()
    {
        $pa1 = PaperGenerator::create($this->ex1, $this->john);
        $this->om->persist($pa1);
        $this->om->flush();

        // end the paper
        $this->request('PUT', "/api/exercises/{$this->ex1->getUuid()}/attempts/{$pa1->getUuid()}/end", $this->john);

        // Check if the Paper has been correctly updated
        $this->assertFalse($pa1->isInterrupted());
        $this->assertTrue($pa1->getEnd() !== null);

        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());

        // Check the paper is correctly returned to User
        $content = json_decode($this->client->getResponse()->getContent());
        $this->assertInternalType('object', $content);
    }

    public function testHint()
    {
        $pa1 = PaperGenerator::create($this->ex1, $this->john);

        $this->om->persist($pa1);
        $this->om->flush();

        $this->request('GET', "/api/exercises/{$this->ex1->getUuid()}/attempts/{$pa1->getUuid()}/hints/{$this->hi1->getId()}", $this->john);

        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $this->assertEquals('hi1', json_decode($this->client->getResponse()->getContent()));
    }

    public function testAnonymousHint()
    {
        $pa1 = PaperGenerator::create($this->ex1, $this->john);
        $this->om->persist($pa1);
        $this->om->flush();

        $this->request('GET', "/api/exercises/{$this->ex1->getUuid()}/attempts/{$pa1->getUuid()}/hints/{$this->hi1->getId()}");
        $this->assertEquals(401, $this->client->getResponse()->getStatusCode());
    }

    public function testHintAfterPaperEnd()
    {
        $pa1 = PaperGenerator::create($this->ex1, $this->john);
        $date = new \DateTime();
        $date->add(\DateInterval::createFromDateString('yesterday'));
        $pa1->setEnd($date);

        $this->om->persist($pa1);
        $this->om->flush();

        $this->request('GET', "/api/exercises/{$this->ex1->getUuid()}/attempts/{$pa1->getUuid()}/hints/{$this->hi1->getId()}", $this->john);
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }

    public function testHintByNotPaperUser()
    {
        $pa1 = PaperGenerator::create($this->ex1, $this->john);
        $this->om->persist($pa1);
        $this->om->flush();

        $this->request('GET', "/api/exercises/{$this->ex1->getUuid()}/attempts/{$pa1->getUuid()}/hints/{$this->hi1->getId()}", $this->bob);
        $this->assertEquals(403, $this->client->getResponse()->getStatusCode());
    }

    public function testHintNotRelatedToPaper()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }
}
