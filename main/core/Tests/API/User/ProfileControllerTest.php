<?php

namespace Claroline\CoreBubdle\Tests\API\User;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use Claroline\CoreBundle\Library\Testing\Persister;

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

    public function testGetFacetsAction)
    {
        $this->client->request('GET', "/api/profile/{user}/facets");
    }

    public function testGetProfileLinksAction()
    {
        $this->client->request('GET', "/api/profile/{user}/links");
    }

    public function testPutFieldsAction()
    {
        $this->client->request('PUT', "/api/profile/{user}/fields");
    }
}
