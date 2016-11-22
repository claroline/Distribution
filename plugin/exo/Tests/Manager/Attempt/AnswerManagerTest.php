<?php

namespace UJM\ExoBundle\Tests\Manager\Question;

use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use UJM\ExoBundle\Manager\Attempt\AnswerManager;

class AnswerManagerTest extends TransactionalTestCase
{
    /**
     * @var AnswerManager
     */
    private $manager;

    protected function setUp()
    {
        parent::setUp();

        $this->manager = $this->client->getContainer()->get('ujm_exo.manager.answer');
    }

    public function testExport()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
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
