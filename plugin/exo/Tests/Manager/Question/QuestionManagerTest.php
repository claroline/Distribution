<?php

namespace UJM\ExoBundle\Tests\Manager\Question;

use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use UJM\ExoBundle\Manager\Question\QuestionManager;

class QuestionManagerTest extends TransactionalTestCase
{
    /**
     * @var QuestionManager
     */
    private $manager;

    protected function setUp()
    {
        parent::setUp();

        $this->manager = $this->client->getContainer()->get('ujm_exo.manager.question');
    }

    public function testCreate()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    public function testCreateWithInvalidData()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    public function testUpdate()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    public function testUpdateWithInvalidData()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }
}
