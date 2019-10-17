<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager;

use Claroline\CoreBundle\Library\Testing\MockeryTestCase;
use Claroline\CoreBundle\Security\PlatformRoles;
use Doctrine\Common\Collections\ArrayCollection;

class UserManagerTest extends MockeryTestCase
{
    private $userRepo;
    private $roleManager;
    private $workspaceManager;
    private $toolManager;
    private $strictDispatcher;
    private $personalWsTemplateFile;
    private $translator;
    private $ch;
    private $sc;
    private $pagerFactory;
    private $om;
    private $mailManager;
    private $validator;

    public function setUp(): void
    {
        parent::setUp();
        $this->userRepo = $this->mock('Claroline\CoreBundle\Repository\UserRepository');
        $this->roleManager = $this->mock('Claroline\CoreBundle\Manager\RoleManager');
        $this->mailManager = $this->mock('Claroline\CoreBundle\Manager\MailManager');
        $this->workspaceManager = $this->mock('Claroline\CoreBundle\Manager\Workspace\WorkspaceManager');
        $this->toolManager = $this->mock('Claroline\CoreBundle\Manager\ToolManager');
        $this->strictDispatcher = $this->mock('Claroline\CoreBundle\Event\StrictDispatcher');
        $this->personalWsTemplateFile = 'template';
        $this->translator = $this->mock('Symfony\Component\Translation\Translator');
        $this->ch = $this->mock('Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler');
        $this->sc = $this->mock('Symfony\Component\Security\Core\SecurityContext');
        $this->pagerFactory = $this->mock('Claroline\CoreBundle\Pager\PagerFactory');
        $this->om = $this->mock('Claroline\AppBundle\Persistence\ObjectManager');
        $this->validator = $this->mock('Symfony\Component\Validator\ValidatorInterface');
    }

    public function testCreateUser()
    {
        $manager = $this->getManager(['setPersonalWorkspace']);
        $user = $this->mock('Claroline\CoreBundle\Entity\User');
        $workspace = $this->mock('Claroline\CoreBundle\Entity\Workspace\Workspace');

        $manager->shouldReceive('setPersonalWorkspace')
            ->with($user)
            ->once()
            ->andReturn($workspace);
        $this->toolManager->shouldReceive('addRequiredToolsToUser')
            ->with($user)
            ->once();
        $this->roleManager->shouldReceive('setRoleToRoleSubject')
            ->with($user, PlatformRoles::USER)
            ->once();
        $this->mailManager->shouldReceive('isMailerAvailable')->once()->andReturn(true);
        $this->mailManager->shouldReceive('sendCreationMessage')->once()->with($user);

        $this->om->shouldReceive('startFlushSuite')->once();
        $this->om->shouldReceive('endFlushSuite')->once();
        $this->om->shouldReceive('persist')->with($user)->once();
        $this->strictDispatcher->shouldReceive('dispatch')
            ->with('log', 'Log\LogUserCreate', [$user])
            ->once();

        $this->mailManager->shouldReceive('isMailerAvailable')->andReturn(false);

        $manager->createUser($user);
    }

    public function testInsertUserWithRoles()
    {
        $manager = $this->getManager(['setPersonalWorkspace']);
        $user = $this->mock('Claroline\CoreBundle\Entity\User');
        $workspace = $this->mock('Claroline\CoreBundle\Entity\Workspace\Workspace');
        $roleOne = $this->mock('Claroline\CoreBundle\Entity\Role');
        $roleTwo = $this->mock('Claroline\CoreBundle\Entity\Role');
        $roles = new ArrayCollection([$roleOne, $roleTwo]);

        $this->om->shouldReceive('startFlushSuite')->once();
        $this->om->shouldReceive('endFlushSuite')->once();

        $manager->shouldReceive('setPersonalWorkspace')
            ->with($user)
            ->once()
            ->andReturn($workspace);
        $this->toolManager->shouldReceive('addRequiredToolsToUser')
            ->with($user)
            ->once();
        $this->roleManager
            ->shouldReceive('setRoleToRoleSubject')
            ->with($user, PlatformRoles::USER)
            ->once();
        $this->roleManager->shouldReceive('associateRoles')
            ->with($user, $roles)
            ->once();
        $this->mailManager->shouldReceive('isMailerAvailable')->once()->andReturn(true);
        $this->mailManager->shouldReceive('sendCreationMessage')->once()->with($user);
        $this->om->shouldReceive('persist')
            ->with($user)
            ->once();
        $this->strictDispatcher->shouldReceive('dispatch')
            ->with('log', 'Log\LogUserCreate', [$user])
            ->once();

        $this->mailManager->shouldReceive('isMailerAvailable')->andReturn(false);

        $manager->insertUserWithRoles($user, $roles);
    }

    public function testImportUsers()
    {
        $manager = $this->getManager(['createUser']);

        $user = $this->mock('Claroline\CoreBundle\Entity\User');

        $users = [
            [
                'first_name_2',
                'last_name_2',
                'username_2',
                'pwd_2',
                'email_2',
                'code_2',
            ],
        ];

        $this->om->shouldReceive('startFlushSuite')->once();
        $this->om->shouldReceive('endFlushSuite')->once();
        $this->om->shouldReceive('factory')
            ->with('Claroline\CoreBundle\Entity\User')
            ->once()
            ->andReturn($user);

        $user->shouldReceive('setFirstName')
            ->with('first_name_2')
            ->once();
        $user->shouldReceive('setLastName')
            ->with('last_name_2')
            ->once();
        $user->shouldReceive('setUsername')
            ->with('username_2')
            ->once();
        $user->shouldReceive('setPlainPassword')
            ->with('pwd_2')
            ->once();
        $user->shouldReceive('setEmail')
            ->with('email_2')
            ->once();
        $user->shouldReceive('setAdministrativeCode')
            ->with('code_2')
            ->once();
        $user->shouldReceive('setPhone')
            ->with(null)
            ->once();
        $manager->shouldReceive('createUser')->once()->with($user);
        $this->strictDispatcher->shouldReceive('dispatch')
            ->with('log', 'Log\LogUserCreate', [$user])
            ->once();

        $manager->importUsers($users);
    }

    public function testGetUserByUserName()
    {
        $this->userRepo->shouldReceive('loadUserByUsername')
            ->once()
            ->with('john')
            ->andReturn('User');
        $manager = $this->getManager();
        $this->assertEquals('User', $manager->getUserByUsername('john'));
    }

    public function testRefreshUser()
    {
        $user = $this->mock('Symfony\Component\Security\Core\User\UserInterface');

        $this->userRepo->shouldReceive('refreshUser')
            ->once()
            ->with($user);

        $this->getManager()->refreshUser($user);
    }

    public function testGetUsersByIds()
    {
        $ids = [1, 3, 4];
        $users = ['userA', 'userC', 'userD'];

        $this->om->shouldReceive('findByIds')
            ->with('Claroline\CoreBundle\Entity\User', $ids)
            ->once()
            ->andReturn($users);

        $this->assertEquals($users, $this->getManager()->getUsersByIds($ids));
    }

    public function testGetUsersEnrolledInMostWorkspaces()
    {
        $max = 3;
        $users = ['userA', 'userB', 'userC'];

        $this->userRepo->shouldReceive('findUsersEnrolledInMostWorkspaces')
            ->with($max)
            ->once()
            ->andReturn($users);

        $this->assertEquals($users, $this->getManager()->getUsersEnrolledInMostWorkspaces($max));
    }

    public function testGetUsersOwnersOfMostWorkspaces()
    {
        $max = 3;
        $users = ['userA', 'userB', 'userC'];

        $this->userRepo->shouldReceive('findUsersOwnersOfMostWorkspaces')
            ->with($max)
            ->once()
            ->andReturn($users);

        $this->assertEquals($users, $this->getManager()->getUsersOwnersOfMostWorkspaces($max));
    }

    public function testGetUserById()
    {
        $userId = 1;
        $user = 'User';

        $this->userRepo->shouldReceive('find')
            ->with($userId)
            ->once()
            ->andReturn($user);

        $this->assertEquals($user, $this->getManager()->getUserById($userId));
    }

    public function testSetPersonalWorkspaceUser()
    {
        $this->markTestSkipped('How to test the Configuration::fromTemplate ?');
    }

    private function getManager(array $mockedMethods = [])
    {
        $this->om->shouldReceive('getRepository')->once()
            ->with('ClarolineCoreBundle:User')->andReturn($this->userRepo);

        if (0 === count($mockedMethods)) {
            return new UserManager(
                $this->personalWsTemplateFile,
                $this->mailManager,
                $this->om,
                $this->pagerFactory,
                $this->ch,
                $this->roleManager,
                $this->sc,
                $this->strictDispatcher,
                $this->toolManager,
                $this->translator,
                $this->validator,
                $this->workspaceManager
            );
        }

        $stringMocked = '[';
        $stringMocked .= array_pop($mockedMethods);

        foreach ($mockedMethods as $mockedMethod) {
            $stringMocked .= ",{$mockedMethod}";
        }

        $stringMocked .= ']';

        return $this->mock(
            'Claroline\CoreBundle\Manager\UserManager'.$stringMocked,
            [
                $this->personalWsTemplateFile,
                $this->mailManager,
                $this->om,
                $this->pagerFactory,
                $this->ch,
                $this->roleManager,
                $this->sc,
                $this->strictDispatcher,
                $this->toolManager,
                $this->translator,
                $this->validator,
                $this->workspaceManager,
            ]
        );
    }
}
