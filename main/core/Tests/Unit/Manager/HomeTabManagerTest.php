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

use Claroline\CoreBundle\Entity\Tab\HomeTab;
use Claroline\CoreBundle\Entity\Tab\HomeTabConfig;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Widget\WidgetInstanceConfig;
use Claroline\CoreBundle\Library\Testing\MockeryTestCase;
use Mockery as m;

class HomeTabManagerTest extends MockeryTestCase
{
    private $om;
    private $homeTabRepo;
    private $homeTabConfigRepo;
    private $widgetHomeTabConfigRepo;
    private $widgetDisplayConfigRepo;

    public function setUp()
    {
        parent::setUp();

        $this->om = $this->mock('Claroline\AppBundle\Persistence\ObjectManager');
        $this->homeTabRepo =
            $this->mock('Claroline\CoreBundle\Repository\HomeTabRepository');
        $this->homeTabConfigRepo =
            $this->mock('Claroline\CoreBundle\Repository\HomeTabConfigRepository');
        $this->widgetHomeTabConfigRepo =
            $this->mock('Claroline\CoreBundle\Repository\WidgetInstanceConfigRepository');
        $this->widgetDisplayConfigRepo =
            $this->mock('Claroline\CoreBundle\Repository\DisplayConfigRepository');
    }

    public function testInsertHomeTab()
    {
        $homeTab = new HomeTab();

        $this->om->shouldReceive('persist')->with($homeTab)->once();
        $this->om->shouldReceive('flush')->once();

        $this->getManager()->insertHomeTab($homeTab);
    }

    public function testDeleteAdminDesktopHomeTab()
    {
        $homeTab = new HomeTab();

        $this->homeTabConfigRepo
            ->shouldReceive('updateAdminDesktopOrder')
            ->with(1)
            ->once();
        $this->om->shouldReceive('remove')->with($homeTab)->once();
        $this->om->shouldReceive('flush')->once();

        $this->getManager()->deleteHomeTab($homeTab, 'admin_desktop', 1);
    }

    public function testDeleteAdminWorkspaceHomeTab()
    {
        $homeTab = new HomeTab();

        $this->homeTabConfigRepo
            ->shouldReceive('updateAdminWorkspaceOrder')
            ->with(1)
            ->once();
        $this->om->shouldReceive('remove')->with($homeTab)->once();
        $this->om->shouldReceive('flush')->once();

        $this->getManager()->deleteHomeTab($homeTab, 'admin_workspace', 1);
    }

    public function testDeleteDesktopHomeTab()
    {
        $homeTab = $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTab');
        $user = new User();

        $homeTab->shouldReceive('getUser')->once()->andReturn($user);
        $this->homeTabConfigRepo
            ->shouldReceive('updateDesktopOrder')
            ->with($user, 1)
            ->once();
        $this->om->shouldReceive('remove')->with($homeTab)->once();
        $this->om->shouldReceive('flush')->once();

        $this->getManager()->deleteHomeTab($homeTab, 'desktop', 1);
    }

    public function testDeleteWorkspaceHomeTab()
    {
        $homeTab = $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTab');
        $workspace =
            $this->mock('Claroline\CoreBundle\Entity\Workspace\Workspace');

        $homeTab->shouldReceive('getWorkspace')->once()->andReturn($workspace);
        $this->homeTabConfigRepo
            ->shouldReceive('updateWorkspaceOrder')
            ->with($workspace, 1)
            ->once();
        $this->om->shouldReceive('remove')->with($homeTab)->once();
        $this->om->shouldReceive('flush')->once();

        $this->getManager()->deleteHomeTab($homeTab, 'workspace', 1);
    }

    public function testInsertHomeTabConfig()
    {
        $homeTabConfig = new HomeTabConfig();

        $this->om->shouldReceive('persist')->with($homeTabConfig)->once();
        $this->om->shouldReceive('flush')->once();

        $this->getManager()->insertHomeTabConfig($homeTabConfig);
    }

    public function testUpdateVisibility()
    {
        $homeTabConfig =
            $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTabConfig');

        $homeTabConfig->shouldReceive('setVisible')->with(true)->once();
        $this->om->shouldReceive('flush')->once();

        $this->getManager()->updateVisibility($homeTabConfig, true);
    }

    public function testUpdateLock()
    {
        $homeTabConfig =
            $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTabConfig');

        $homeTabConfig->shouldReceive('setLocked')->with(true)->once();
        $this->om->shouldReceive('flush')->once();

        $this->getManager()->updateLock($homeTabConfig, true);
    }

    public function testCreateWorkspaceVersion()
    {
        $homeTabConfig =
            $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTabConfig');
        $workspace =
            $this->mock('Claroline\CoreBundle\Entity\Workspace\Workspace');
        $homeTab = new HomeTab();

        $homeTabConfig->shouldReceive('getHomeTab')
            ->once()
            ->andReturn($homeTab);
        $homeTabConfig->shouldReceive('getType')
            ->once()
            ->andReturn('admin_workspace');
        $homeTabConfig->shouldReceive('isVisible')
            ->once()
            ->andReturn(true);
        $homeTabConfig->shouldReceive('isLocked')
            ->once()
            ->andReturn(false);
        $homeTabConfig->shouldReceive('getTabOrder')
            ->once()
            ->andReturn(1);
        $this->om->shouldReceive('persist')->once()->with(
            m::on(
                function (HomeTabConfig $newHomeTabConfig) {
                    return 'admin_workspace' === $newHomeTabConfig->getType()
                        && $newHomeTabConfig->isVisible()
                        && !$newHomeTabConfig->isLocked()
                        && 1 === $newHomeTabConfig->getTabOrder();
                }
            )
        );
        $this->om->shouldReceive('flush')->once();

        $this->getManager()->createWorkspaceVersion($homeTabConfig, $workspace);
    }

    public function testCreateUserVersion()
    {
        $homeTabConfig =
            $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTabConfig');
        $user = new User();
        $homeTab = new HomeTab();

        $homeTabConfig->shouldReceive('getHomeTab')
            ->once()
            ->andReturn($homeTab);
        $homeTabConfig->shouldReceive('getType')
            ->once()
            ->andReturn('admin_desktop');
        $homeTabConfig->shouldReceive('isVisible')
            ->once()
            ->andReturn(true);
        $homeTabConfig->shouldReceive('isLocked')
            ->once()
            ->andReturn(false);
        $homeTabConfig->shouldReceive('getTabOrder')
            ->once()
            ->andReturn(1);
        $this->om->shouldReceive('persist')->once()->with(
            m::on(
                function (HomeTabConfig $newHomeTabConfig) {
                    return 'admin_desktop' === $newHomeTabConfig->getType()
                        && $newHomeTabConfig->isVisible()
                        && !$newHomeTabConfig->isLocked()
                        && 1 === $newHomeTabConfig->getTabOrder();
                }
            )
        );
        $this->om->shouldReceive('flush')->once();

        $this->getManager()->createUserVersion($homeTabConfig, $user);
    }

    /**
     * @todo I don't understand anything
     */
    public function testGenerateAdminHomeTabConfigsByUser()
    {
        $user = new User();
        $adminHomeTabConfigA =
            $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTabConfig');
        $adminHomeTabConfigB =
            $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTabConfig');
        $adminHomeTabConfigs = [$adminHomeTabConfigA, $adminHomeTabConfigB];
        $homeTab = new HomeTab();
        $newHomeTabConfig = new HomeTabConfig();
        $manager = $this->getManager(['createUserVersion']);

        $this->homeTabConfigRepo
            ->shouldReceive('findAdminDesktopHomeTabConfigs')
            ->once()
            ->andReturn($adminHomeTabConfigs);
        $adminHomeTabConfigA
            ->shouldReceive('isLocked')
            ->once()
            ->andReturn(true);
        $adminHomeTabConfigB
            ->shouldReceive('isLocked')
            ->once()
            ->andReturn(false);
        $adminHomeTabConfigA
            ->shouldReceive('isVisible')
            ->once()
            ->andReturn(true);
        $adminHomeTabConfigB
            ->shouldReceive('getHomeTab')
            ->once()
            ->andReturn($homeTab);
        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'user' => $user,
                ]
            )
            ->once()
            ->andReturn(null);
        $manager->shouldReceive('createUserVersion')
            ->with($adminHomeTabConfigB, $user)
            ->once()
            ->andReturn($newHomeTabConfig);

        $this->assertEquals(
            [$adminHomeTabConfigA, $newHomeTabConfig],
            $manager->generateAdminHomeTabConfigsByUser($user)
        );
    }

    public function testFilterVisibleHomeTabConfigs()
    {
        $homeTabConfigA =
            $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTabConfig');
        $homeTabConfigB =
            $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTabConfig');
        $homeTabConfigs = [$homeTabConfigA, $homeTabConfigB];

        $homeTabConfigA
            ->shouldReceive('isVisible')
            ->once()
            ->andReturn(true);
        $homeTabConfigB
            ->shouldReceive('isVisible')
            ->once()
            ->andReturn(false);

        $this->assertEquals(
            [$homeTabConfigA],
            $this->getManager()->filterVisibleHomeTabConfigs($homeTabConfigs)
        );
    }

    public function testCheckHomeTabVisibilityByUserCaseA()
    {
        $homeTab = new HomeTab();
        $user = new User();

        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'type' => 'admin_desktop',
                    'user' => null,
                    'workspace' => null,
                ]
            )
            ->once()
            ->andReturn(null);
        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'user' => $user,
                ]
            )
            ->once()
            ->andReturn(null);

        $this->assertEquals(
            false,
            $this->getManager()->checkHomeTabVisibilityByUser($homeTab, $user)
        );
    }

    public function testCheckHomeTabVisibilityByUserCaseB()
    {
        $homeTab = new HomeTab();
        $user = new User();
        $adminHomeTabConfig =
            $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTabConfig');

        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'type' => 'admin_desktop',
                    'user' => null,
                    'workspace' => null,
                ]
            )
            ->once()
            ->andReturn($adminHomeTabConfig);
        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'user' => $user,
                ]
            )
            ->once()
            ->andReturn(null);
        $adminHomeTabConfig->shouldReceive('isVisible')->once()->andReturn(true);

        $this->assertEquals(
            true,
            $this->getManager()->checkHomeTabVisibilityByUser($homeTab, $user)
        );
    }

    public function testCheckHomeTabVisibilityByUserCaseC()
    {
        $homeTab = new HomeTab();
        $user = new User();
        $userHomeTabConfig =
            $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTabConfig');

        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'type' => 'admin_desktop',
                    'user' => null,
                    'workspace' => null,
                ]
            )
            ->once()
            ->andReturn(null);
        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'user' => $user,
                ]
            )
            ->once()
            ->andReturn($userHomeTabConfig);
        $userHomeTabConfig->shouldReceive('isVisible')->once()->andReturn(true);

        $this->assertEquals(
            true,
            $this->getManager()->checkHomeTabVisibilityByUser($homeTab, $user)
        );
    }

    public function testCheckHomeTabVisibilityByUserCaseD()
    {
        $homeTab = new HomeTab();
        $user = new User();
        $adminHomeTabConfig =
            $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTabConfig');
        $userHomeTabConfig =
            $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTabConfig');

        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'type' => 'admin_desktop',
                    'user' => null,
                    'workspace' => null,
                ]
            )
            ->once()
            ->andReturn($adminHomeTabConfig);
        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'user' => $user,
                ]
            )
            ->once()
            ->andReturn($userHomeTabConfig);
        $adminHomeTabConfig->shouldReceive('isLocked')->once()->andReturn(false);
        $userHomeTabConfig->shouldReceive('isVisible')->once()->andReturn(false);

        $this->assertEquals(
            false,
            $this->getManager()->checkHomeTabVisibilityByUser($homeTab, $user)
        );
    }

    public function testCheckHomeTabVisibilityByWorkspaceCaseA()
    {
        $homeTab = new HomeTab();
        $workspace =
            $this->mock('Claroline\CoreBundle\Entity\Workspace\Workspace');

        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'type' => 'admin_workspace',
                    'user' => null,
                    'workspace' => null,
                ]
            )
            ->once()
            ->andReturn(null);
        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'workspace' => $workspace,
                ]
            )
            ->once()
            ->andReturn(null);

        $this->assertEquals(
            false,
            $this->getManager()
                ->checkHomeTabVisibilityByWorkspace($homeTab, $workspace)
        );
    }

    public function testCheckHomeTabVisibilityByWorkspaceCaseB()
    {
        $this->markTestSkipped("I don't understand");
        $homeTab = new HomeTab();
        $workspace =
            $this->mock('Claroline\CoreBundle\Entity\Workspace\Workspace');
        $adminHomeTabConfig =
            $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTabConfig');

        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'type' => 'admin_workspace',
                    'user' => null,
                    'workspace' => null,
                ]
            )
            ->once()
            ->andReturn($adminHomeTabConfig);
        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'workspace' => $workspace,
                ]
            )
            ->once()
            ->andReturn(null);
        $adminHomeTabConfig->shouldReceive('isVisible')->once()->andReturn(true);

        $this->assertEquals(
            true,
            $this->getManager()
                ->checkHomeTabVisibilityByWorkspace($homeTab, $workspace)
        );
    }

    public function testCheckHomeTabVisibilityByWorkspaceCaseC()
    {
        $homeTab = new HomeTab();
        $workspace =
            $this->mock('Claroline\CoreBundle\Entity\Workspace\Workspace');
        $workspaceHomeTabConfig =
            $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTabConfig');

        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'type' => 'admin_workspace',
                    'user' => null,
                    'workspace' => null,
                ]
            )
            ->once()
            ->andReturn(null);
        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'workspace' => $workspace,
                ]
            )
            ->once()
            ->andReturn($workspaceHomeTabConfig);
        $workspaceHomeTabConfig->shouldReceive('isVisible')->once()->andReturn(true);

        $this->assertEquals(
            true,
            $this->getManager()
                ->checkHomeTabVisibilityByWorkspace($homeTab, $workspace)
        );
    }

    public function testCheckHomeTabVisibilityByWorkspaceCaseD()
    {
        $homeTab = new HomeTab();
        $workspace =
            $this->mock('Claroline\CoreBundle\Entity\Workspace\Workspace');
        $adminHomeTabConfig =
            $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTabConfig');
        $workspaceHomeTabConfig =
            $this->mock('Claroline\CoreBundle\Entity\Tab\HomeTabConfig');

        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'type' => 'admin_workspace',
                    'user' => null,
                    'workspace' => null,
                ]
            )
            ->once()
            ->andReturn($adminHomeTabConfig);
        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(
                [
                    'homeTab' => $homeTab,
                    'workspace' => $workspace,
                ]
            )
            ->once()
            ->andReturn($workspaceHomeTabConfig);
        $adminHomeTabConfig->shouldReceive('isLocked')->once()->andReturn(false);
        $workspaceHomeTabConfig->shouldReceive('isVisible')->once()->andReturn(false);

        $this->assertEquals(
            false,
            $this->getManager()
                ->checkHomeTabVisibilityByWorkspace($homeTab, $workspace)
        );
    }

    public function testInsertWidgetInstanceConfig()
    {
        $widgetHomeTabConfig = new WidgetInstanceConfig();

        $this->om->shouldReceive('persist')->with($widgetHomeTabConfig)->once();
        $this->om->shouldReceive('flush')->once();

        $this->getManager()->insertWidgetInstanceConfig($widgetHomeTabConfig);
    }

    public function testDeleteWidgetInstanceConfig()
    {
        $widgetHomeTabConfig = $this->mock('Claroline\CoreBundle\Entity\Widget\WidgetInstanceConfig');
        $this->om->shouldReceive('remove')->with($widgetHomeTabConfig)->once();
        $this->om->shouldReceive('flush')->once();

        $this->getManager()->deleteWidgetInstanceConfig($widgetHomeTabConfig);
    }

    public function testChangeVisibilityWidgetInstanceConfig()
    {
        $widgetHomeTabConfig =
            $this->mock('Claroline\CoreBundle\Entity\Widget\WidgetInstanceConfig');

        $widgetHomeTabConfig->shouldReceive('isVisible')->once()->andReturn(false);
        $widgetHomeTabConfig->shouldReceive('setVisible')->with(true)->once();
        $this->om->shouldReceive('flush')->once();

        $this->getManager()
            ->changeVisibilityWidgetInstanceConfig($widgetHomeTabConfig);
    }

    public function testChangeLockWidgetInstanceConfig()
    {
        $widgetHomeTabConfig =
            $this->mock('Claroline\CoreBundle\Entity\Widget\WidgetInstanceConfig');

        $widgetHomeTabConfig->shouldReceive('isLocked')->once()->andReturn(false);
        $widgetHomeTabConfig->shouldReceive('setLocked')->with(true)->once();
        $this->om->shouldReceive('flush')->once();

        $this->getManager()
            ->changeLockWidgetInstanceConfig($widgetHomeTabConfig);
    }

    public function testGetHomeTabById()
    {
        m::getConfiguration()->allowMockingNonExistentMethods(true);
        $this->homeTabRepo
            ->shouldReceive('findOneById')
            ->with(1)
            ->once()
            ->andReturn('home_tab');
        m::getConfiguration()->allowMockingNonExistentMethods(false);

        $this->assertEquals(
            'home_tab',
            $this->getManager()->getHomeTabById(1)
        );
    }

    public function testGetAdminDesktopHomeTabConfigs()
    {
        $homeTabs = ['home_tab_A', 'home_tab_B'];

        $this->homeTabConfigRepo
            ->shouldReceive('findAdminDesktopHomeTabConfigs')
            ->once()
            ->andReturn($homeTabs);

        $this->assertEquals(
            $homeTabs,
            $this->getManager()->getAdminDesktopHomeTabConfigs()
        );
    }

    public function testGetAdminWorkspaceHomeTabConfigs()
    {
        $homeTabConfigs = ['home_tab_config_A', 'home_tab_config_B'];

        $this->homeTabConfigRepo
            ->shouldReceive('findAdminWorkspaceHomeTabConfigs')
            ->once()
            ->andReturn($homeTabConfigs);

        $this->assertEquals(
            $homeTabConfigs,
            $this->getManager()->getAdminWorkspaceHomeTabConfigs()
        );
    }

    public function testGetAdminDesktopHomeTabConfigByHomeTab()
    {
        $homeTab = new HomeTab();

        $this->homeTabConfigRepo
            ->shouldReceive('findAdminDesktopHomeTabConfigByHomeTab')
            ->with($homeTab)
            ->once()
            ->andReturn('home_tab_config');

        $this->assertEquals(
            'home_tab_config',
            $this->getManager()->getAdminDesktopHomeTabConfigByHomeTab($homeTab)
        );
    }

    public function testGetDesktopHomeTabConfigsByUser()
    {
        $user = new User();
        $homeTabConfigs = ['home_tab_config_A', 'home_tab_config_B'];

        $this->homeTabConfigRepo
            ->shouldReceive('findDesktopHomeTabConfigsByUser')
            ->with($user)
            ->once()
            ->andReturn($homeTabConfigs);

        $this->assertEquals(
            $homeTabConfigs,
            $this->getManager()->getDesktopHomeTabConfigsByUser($user)
        );
    }

    public function testGetWorkspaceHomeTabConfigsByWorkspace()
    {
        $workspace =
            $this->mock('Claroline\CoreBundle\Entity\Workspace\Workspace');
        $homeTabConfigs = ['home_tab_config_A', 'home_tab_config_B'];

        $this->homeTabConfigRepo
            ->shouldReceive('findWorkspaceHomeTabConfigsByWorkspace')
            ->with($workspace)
            ->once()
            ->andReturn($homeTabConfigs);

        $this->assertEquals(
            $homeTabConfigs,
            $this->getManager()->getWorkspaceHomeTabConfigsByWorkspace($workspace)
        );
    }

    public function testGetVisibleAdminDesktopHomeTabConfigs()
    {
        $homeTabConfigs = ['home_tab_config_A', 'home_tab_config_B'];

        $this->homeTabConfigRepo
            ->shouldReceive('findVisibleAdminDesktopHomeTabConfigs')
            ->once()
            ->andReturn($homeTabConfigs);

        $this->assertEquals(
            $homeTabConfigs,
            $this->getManager()->getVisibleAdminDesktopHomeTabConfigs()
        );
    }

    public function testGetVisibleAdminWorkspaceHomeTabConfigs()
    {
        $homeTabConfigs = ['home_tab_config_A', 'home_tab_config_B'];

        $this->homeTabConfigRepo
            ->shouldReceive('findVisibleAdminWorkspaceHomeTabConfigs')
            ->once()
            ->andReturn($homeTabConfigs);

        $this->assertEquals(
            $homeTabConfigs,
            $this->getManager()->getVisibleAdminWorkspaceHomeTabConfigs()
        );
    }

    public function testGetVisibleDesktopHomeTabConfigsByUser()
    {
        $user = new User();
        $homeTabConfigs = ['home_tab_config_A', 'home_tab_config_B'];

        $this->homeTabConfigRepo
            ->shouldReceive('findVisibleDesktopHomeTabConfigsByUser')
            ->with($user)
            ->once()
            ->andReturn($homeTabConfigs);

        $this->assertEquals(
            $homeTabConfigs,
            $this->getManager()->getVisibleDesktopHomeTabConfigsByUser($user)
        );
    }

    public function testGetVisibleWorkspaceHomeTabConfigsByWorkspace()
    {
        $workspace =
            $this->mock('Claroline\CoreBundle\Entity\Workspace\Workspace');
        $homeTabConfigs = ['home_tab_config_A', 'home_tab_config_B'];

        $this->homeTabConfigRepo
            ->shouldReceive('findVisibleWorkspaceHomeTabConfigsByWorkspace')
            ->with($workspace)
            ->once()
            ->andReturn($homeTabConfigs);

        $this->assertEquals(
            $homeTabConfigs,
            $this->getManager()->getVisibleWorkspaceHomeTabConfigsByWorkspace($workspace)
        );
    }

    public function testGetOrderOfLastDesktopHomeTabConfigByUser()
    {
        $user = new User();

        $this->homeTabConfigRepo
            ->shouldReceive('findOrderOfLastDesktopHomeTabByUser')
            ->with($user)
            ->once()
            ->andReturn(4);

        $this->assertEquals(
            4,
            $this->getManager()->getOrderOfLastDesktopHomeTabConfigByUser($user)
        );
    }

    public function testGetOrderOfLastWorkspaceHomeTabConfigByWorkspace()
    {
        $workspace =
            $this->mock('Claroline\CoreBundle\Entity\Workspace\Workspace');

        $this->homeTabConfigRepo
            ->shouldReceive('findOrderOfLastWorkspaceHomeTabByWorkspace')
            ->with($workspace)
            ->once()
            ->andReturn(4);

        $this->assertEquals(
            4,
            $this->getManager()
                ->getOrderOfLastWorkspaceHomeTabConfigByWorkspace($workspace)
        );
    }

    public function testGetOrderOfLastAdminDesktopHomeTabConfig()
    {
        $this->homeTabConfigRepo
            ->shouldReceive('findOrderOfLastAdminDesktopHomeTab')
            ->once()
            ->andReturn(4);

        $this->assertEquals(
            4,
            $this->getManager()->getOrderOfLastAdminDesktopHomeTabConfig()
        );
    }

    public function testGetOrderOfLastAdminWorkspaceHomeTabConfig()
    {
        $this->homeTabConfigRepo
            ->shouldReceive('findOrderOfLastAdminWorkspaceHomeTab')
            ->once()
            ->andReturn(4);

        $this->assertEquals(
            4,
            $this->getManager()->getOrderOfLastAdminWorkspaceHomeTabConfig()
        );
    }

    public function testGetHomeTabConfigByHomeTabAndWorkspace()
    {
        $homeTab = new HomeTab();
        $workspace =
            $this->mock('Claroline\CoreBundle\Entity\Workspace\Workspace');
        $homeTabConfig = new HomeTabConfig();

        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(['homeTab' => $homeTab, 'workspace' => $workspace])
            ->once()
            ->andReturn($homeTabConfig);

        $this->assertEquals(
            $homeTabConfig,
            $this->getManager()
                ->getHomeTabConfigByHomeTabAndWorkspace($homeTab, $workspace)
        );
    }

    public function testGetHomeTabConfigByHomeTabAndUser()
    {
        $homeTab = new HomeTab();
        $user = new User();
        $homeTabConfig = new HomeTabConfig();

        $this->homeTabConfigRepo
            ->shouldReceive('findOneBy')
            ->with(['homeTab' => $homeTab, 'user' => $user])
            ->once()
            ->andReturn($homeTabConfig);

        $this->assertEquals(
            $homeTabConfig,
            $this->getManager()
                ->getHomeTabConfigByHomeTabAndUser($homeTab, $user)
        );
    }

    public function testGetAdminWidgetConfigs()
    {
        $homeTab = new HomeTab();
        $adminWidgetConfigs = ['whtc_a', 'whtc_b'];

        $this->widgetHomeTabConfigRepo
            ->shouldReceive('findAdminWidgetConfigs')
            ->with($homeTab)
            ->once()
            ->andReturn($adminWidgetConfigs);

        $this->assertEquals(
            $adminWidgetConfigs,
            $this->getManager()->getAdminWidgetConfigs($homeTab)
        );
    }

    public function testGetOrderOfLastWidgetInAdminHomeTab()
    {
        $homeTab = new HomeTab();

        $this->widgetHomeTabConfigRepo
            ->shouldReceive('findOrderOfLastWidgetInAdminHomeTab')
            ->with($homeTab)
            ->once()
            ->andReturn(4);

        $this->assertEquals(
            4,
            $this->getManager()->getOrderOfLastWidgetInAdminHomeTab($homeTab)
        );
    }

    public function testGetOrderOfLastWidgetInHomeTabByUser()
    {
        $homeTab = new HomeTab();
        $user = new User();

        $this->widgetHomeTabConfigRepo
            ->shouldReceive('findOrderOfLastWidgetInHomeTabByUser')
            ->with($homeTab, $user)
            ->once()
            ->andReturn(4);

        $this->assertEquals(
            4,
            $this->getManager()
                ->getOrderOfLastWidgetInHomeTabByUser($homeTab, $user)
        );
    }

    public function testGetOrderOfLastWidgetInHomeTabByWorkspace()
    {
        $homeTab = new HomeTab();
        $workspace =
            $this->mock('Claroline\CoreBundle\Entity\Workspace\Workspace');

        $this->widgetHomeTabConfigRepo
            ->shouldReceive('findOrderOfLastWidgetInHomeTabByWorkspace')
            ->with($homeTab, $workspace)
            ->once()
            ->andReturn(4);

        $this->assertEquals(
            4,
            $this->getManager()
                ->getOrderOfLastWidgetInHomeTabByWorkspace($homeTab, $workspace)
        );
    }

    private function getManager(array $mockedMethods = [])
    {
        $this->om->shouldReceive('getRepository')
            ->with('ClarolineCoreBundle:Tab\HomeTab')
            ->once()
            ->andReturn($this->homeTabRepo);
        $this->om->shouldReceive('getRepository')
            ->with('ClarolineCoreBundle:Tab\HomeTabConfig')
            ->once()
            ->andReturn($this->homeTabConfigRepo);
        $this->om->shouldReceive('getRepository')
            ->with('ClarolineCoreBundle:Widget\WidgetInstanceConfig')
            ->once()
            ->andReturn($this->widgetHomeTabConfigRepo);
        $this->om->shouldReceive('getRepository')
            ->with('ClarolineCoreBundle:Widget\WidgetInstance')
            ->once()
            ->andReturn($this->widgetDisplayConfigRepo);

        if (0 === count($mockedMethods)) {
            return new HomeTabManager($this->om);
        }

        $stringMocked = '[';
        $stringMocked .= array_pop($mockedMethods);

        foreach ($mockedMethods as $mockedMethod) {
            $stringMocked .= ",{$mockedMethod}";
        }

        $stringMocked .= ']';

        return $this->mock(
            'Claroline\CoreBundle\Manager\HomeTabManager'.$stringMocked,
            [$this->om]
        );
    }
}
