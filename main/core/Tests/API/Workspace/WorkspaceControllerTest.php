<?php

namespace Claroline\CoreBubdle\Tests\API\Workspace;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use Claroline\CoreBundle\Library\Testing\Persister;

class WorkspaceControllerTest extends TransactionalTestCase
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

    public function testGetUserWorkspacesAction()
    {
        //initialization
        $admin = $this->createAdmin();
        $this->persister->workspace('ws1', $admin);
        $this->persister->workspace('ws2', $admin);
        $this->persister->flush();

        //tests
        $this->logIn($admin);
        $this->client->request('GET', "/api/user/{$admin->getId()}/workspaces");
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
        $data = $this->client->getResponse()->getContent();
        $data = json_decode($data, true);
        $this->assertEquals(2, count($data));
        $this->assertEquals('ws1', $data[0]['name']);
        $this->assertEquals('ws2', $data[1]['name']);
    }

    private function createAdmin()
    {
        $admin = $this->persister->user('admin');
        $this->persister->grantAdminRole($admin);
        $this->persister->flush();

        return $admin;
    }
}
