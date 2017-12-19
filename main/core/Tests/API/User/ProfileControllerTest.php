<?php

namespace Claroline\CoreBundle\Tests\API\User;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Testing\Persister;
use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;

/**
 * Specific tests for organizations
 * How to run:
 * - create database
 * - php app/console claroline:install --env=test
 * - bin/phpunit vendor/claroline/core-bundle/Tests/API/User/ProfileControllerTest.php -c app/phpunit.xml.
 */
class ProfileControllerTest extends TransactionalTestCase
{
    protected function setUp()
    {
        parent::setUp();
        $this->persister = $this->client->getContainer()->get('claroline.library.testing.persister');
    }

    public function testGetProfileLinksAction()
    {
        $user = $this->persister->user('user');
        $this->login($user);
        $this->client->request('GET', "/api/profile/{$user->getId()}/links");
        $data = $this->client->getResponse()->getContent();
        $data = json_decode($data, true);
        $this->assertEquals($data[0]['name'], 'socialmedia_wall');
    }
}
