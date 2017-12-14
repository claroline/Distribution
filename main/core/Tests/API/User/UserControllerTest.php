<?php

namespace Claroline\CoreBundle\Tests\API\User;

use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Testing\Persister;
use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;

class UserControllerTest extends TransactionalTestCase
{
    protected function setUp()
    {
        parent::setUp();
        $this->persister = $this->client->getContainer()->get('claroline.library.testing.persister');
    }

    public function testGetPublicUserAction()
    {
        $admin = $this->createAdmin();
        $user = $this->persister->user('user');

        //A user can see himself
        $this->logIn($user);
        $this->client->request('GET', "/api/user/{$user->getId()}/public");
        $data = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertEquals(
            [
                'firstName' => 'user',
                'lastName' => 'user',
                'fullName' => 'user user',
                'username' => 'user',
                'mail' => 'user@mail.com',
                'allowSendMail' => true,
                'allowSendMessage' => true,
                'id' => $user->getId(),
                'groups' => [],
            ],
            $data
        );

        //A use can see other people...
        $this->client->request('GET', "/api/user/{$admin->getId()}/public");
        $data = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertEquals(['groups' => []], $data);

        //...unless some permissions were granted explicitely
        $this->persister->profileProperty('username', 'ROLE_USER');
        $this->persister->flush();
        $this->client->request('GET', "/api/user/{$admin->getId()}/public");
        $data = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertEquals(['groups' => []], $data);

        //and the admin can see everyone.
        $this->logIn($admin);
        $this->client->request('GET', "/api/user/{$user->getId()}/public");
        $data = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertEquals(
            [
                'firstName' => 'user',
                'lastName' => 'user',
                'fullName' => 'user user',
                'username' => 'user',
                'mail' => 'user@mail.com',
                'allowSendMail' => true,
                'allowSendMessage' => true,
                'id' => $user->getId(),
                'groups' => [],
            ],
            $data
        );
    }

    private function createAdmin()
    {
        $admin = $this->persister->user('admin');
        $roleAdmin = $this->persister->role('ROLE_ADMIN');
        $admin->addRole($roleAdmin);
        $this->persister->persist($admin);

        return $admin;
    }

    private function createAdminOrga($organization)
    {
        $adminOrga = $this->persister->user('adminOrga');
        $adminOrga->addAdministratedOrganization($organization);
        $this->persister->persist($adminOrga);

        return $adminOrga;
    }

    private function createUserOrga($organization)
    {
        $userOrga = $this->persister->user('userOrga');
        $userOrga->addOrganization($organization);
        $this->persister->persist($userOrga);

        return $userOrga;
    }
}
