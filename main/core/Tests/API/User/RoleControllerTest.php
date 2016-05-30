<?php

namespace Claroline\CoreBubdle\Tests\API\User;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use Claroline\CoreBundle\Library\Testing\Persister;

/**
 * Specific tests for organizations
 * How to run:
 * - create database
 * - php app/console claroline:init_test_schema --env=test
 * - php app/console doctrine:schema:update --force --env=test
 * - bin/phpunit vendor/claroline/core-bundle/Tests/API/User/GroupControllerTest.php -c app/phpunit.xml.
 */
class RoleControllerTest extends TransactionalTestCase
{
    /** @var Persister */
    private $persister;
    /** @var User */
    private $admin;

    protected function setUp()
    {
        parent::setUp();
        $this->persister = $this->client->getContainer()->get('claroline.library.testing.persister');
    }

    public function testGetPlatformRolesAction()
    {
        //initialization
        $admin = $this->createAdmin();
        $this->persister->flush();

        //tests
        $this->logIn($admin);
        $this->client->request('GET', '/api/roles/platform');
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $data = $this->client->getResponse()->getContent();
        $this->assertEquals(5, count(json_decode($data, true)));
    }

    private function createAdmin()
    {
        $admin = $this->persister->user('admin');
        $this->persister->grantAdminRole($admin);
        $this->persister->flush();

        return $admin;
    }
}
