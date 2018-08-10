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

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\BundleRecorder\Log\LoggableTrait;
use Claroline\CoreBundle\Entity\Tab\HomeTab;
use Claroline\CoreBundle\Entity\Tab\HomeTabConfig;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Widget\WidgetInstanceConfig;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use JMS\DiExtraBundle\Annotation as DI;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @DI\Service("claroline.manager.home_tab_manager")
 */
class HomeTabManager
{
    use LoggableTrait;
    /** @var HomeTabConfigRepository */
    private $homeTabConfigRepo;
    /** @var HomeTabRepository */
    private $homeTabRepo;
    /** @var WidgetInstanceConfigRepository */
    private $widgetHomeTabConfigRepo;
    private $om;
    private $container;

    /**
     * Constructor.
     *
     * @DI\InjectParams({
     *     "om"        = @DI\Inject("claroline.persistence.object_manager"),
     *     "container" =  @DI\Inject("service_container")
     * })
     */
    public function __construct(ContainerInterface $container, ObjectManager $om)
    {
        $this->homeTabRepo = $om->getRepository('ClarolineCoreBundle:Tab\HomeTab');
        $this->homeTabConfigRepo = $om->getRepository('ClarolineCoreBundle:Tab\HomeTabConfig');
        $this->widgetHomeTabConfigRepo = $om->getRepository('ClarolineCoreBundle:Widget\WidgetInstanceConfig');
        $this->container = $container;
        $this->om = $om;
        $this->homeTabRepo = $om->getRepository('ClarolineCoreBundle:Tab\HomeTab');
        $this->homeTabConfigRepo = $om->getRepository('ClarolineCoreBundle:Tab\HomeTabConfig');
        $this->widgetHomeTabConfigRepo = $om->getRepository('ClarolineCoreBundle:Widget\WidgetInstanceConfig');
    }

    public function persistHomeTabConfigs(HomeTab $homeTab = null, HomeTabConfig $homeTabConfig = null)
    {
        if (!is_null($homeTab)) {
            $this->om->persist($homeTab);
        }
        if (!is_null($homeTabConfig)) {
            $this->om->persist($homeTabConfig);
        }
        $this->om->flush();
    }

    public function insertHomeTab(HomeTab $homeTab)
    {
        $this->om->persist($homeTab);
        $this->om->flush();
    }

    public function deleteHomeTab(HomeTab $homeTab)
    {
        $this->om->remove($homeTab);
        $this->om->flush();
    }

    public function insertHomeTabConfig(HomeTabConfig $homeTabConfig)
    {
        $this->om->persist($homeTabConfig);
        $this->om->flush();
    }

    public function deleteHomeTabConfig(HomeTabConfig $homeTabConfig)
    {
        $this->om->remove($homeTabConfig);
        $this->om->flush();
    }

    public function updateVisibility(HomeTabConfig $homeTabConfig, $visible)
    {
        $homeTabConfig->setVisible($visible);
        $this->om->flush();
    }

    public function updateLock(HomeTabConfig $homeTabConfig, $locked)
    {
        $homeTabConfig->setLocked($locked);
        $this->om->flush();
    }

    public function importFromCsv($file)
    {
        $data = file_get_contents($file);
        $data = $this->container->get('claroline.utilities.misc')->formatCsvOutput($data);
        $lines = str_getcsv($data, PHP_EOL);
        $this->om->startFlushSuite();
        $i = 0;

        foreach ($lines as $line) {
            $values = str_getcsv($line, ';');
            $code = $values[0];
            $workspace = $this->om->getRepository('ClarolineCoreBundle:Workspace\Workspace')->findOneByCode($code);

            $name = $values[1];
            $tab = $this->om->getRepository('ClarolineCoreBundle:Tab\HomeTab')->findBy(['workspace' => $workspace, 'name' => $name]);
            if (!$tab) {
                $this->createHomeTab($name, $workspace);
                ++$i;
            } else {
                $this->log("Tab {$name} already exists for workspace {$code}");
            }

            if (0 === $i % 100) {
                $this->om->forceFlush();
                $this->om->clear();
            }
        }

        $this->om->endFlushSuite();
    }

    public function createHomeTab($name, Workspace $workspace = null)
    {
        $type = $workspace ? 'workspace' : 'user';
        $homeTab = new HomeTab();

        $homeTab->setWorkspace($workspace);
        $homeTab->setType($type);

        $homeTabConfig = new HomeTabConfig();
        $homeTabConfig->setHomeTab($homeTab);
        $homeTabConfig->setName($name);
        $homeTabConfig->setLongTitle($name);

        $tabsInserted = $this->homeTabRepo->findByWorkspace($workspace);
        $tabsToInsert = $this->getTabsScheduledForInsert($workspace);
        $index = count($tabsInserted) + count($tabsToInsert);
        $homeTabConfig->setTabOrder($index);

        $this->om->persist($homeTabConfig);
        $this->om->persist($homeTab);
        $this->om->flush();

        $this->log("Creating HomeTab {$name} for workspace {$workspace->getCode()}.");
    }

    public function getTabsScheduledForInsert(Workspace $workspace)
    {
        $scheduledForInsert = $this->om->getUnitOfWork()->getScheduledEntityInsertions();
        $res = [];

        foreach ($scheduledForInsert as $entity) {
            if ('Claroline\CoreBundle\Entity\Tab\HomeTab' === get_class($entity)) {
                if ($entity->getWorkspace()->getCode() === $workspace->getCode()) {
                    $res[] = $entity;
                }
            }
        }

        return $res;
    }

    public function createWorkspaceVersion(HomeTabConfig $homeTabConfig, Workspace $workspace)
    {
        $newHomeTabConfig = new HomeTabConfig();
        $newHomeTabConfig->setHomeTab($homeTabConfig->getHomeTab());
        $newHomeTabConfig->setType($homeTabConfig->getType());
        $newHomeTabConfig->setWorkspace($workspace);
        $newHomeTabConfig->setVisible($homeTabConfig->isVisible());
        $newHomeTabConfig->setLocked($homeTabConfig->isLocked());
        $newHomeTabConfig->setTabOrder($homeTabConfig->getTabOrder());
        $this->om->persist($newHomeTabConfig);
        $this->om->flush();

        return $newHomeTabConfig;
    }

    public function createUserVersion(HomeTabConfig $homeTabConfig, User $user)
    {
        $newHomeTabConfig = new HomeTabConfig();
        $newHomeTabConfig->setHomeTab($homeTabConfig->getHomeTab());
        $newHomeTabConfig->setType($homeTabConfig->getType());
        $newHomeTabConfig->setUser($user);
        $newHomeTabConfig->setVisible($homeTabConfig->isVisible());
        $newHomeTabConfig->setLocked($homeTabConfig->isLocked());
        $newHomeTabConfig->setTabOrder($homeTabConfig->getTabOrder());
        $newHomeTabConfig->setDetails($homeTabConfig->getDetails());
        $this->om->persist($newHomeTabConfig);
        $this->om->flush();

        return $newHomeTabConfig;
    }

    public function filterVisibleHomeTabConfigs(array $homeTabConfigs)
    {
        $visibleHomeTabConfigs = [];

        foreach ($homeTabConfigs as $homeTabConfig) {
            if ($homeTabConfig->isVisible()) {
                $visibleHomeTabConfigs[] = $homeTabConfig;
            }
        }

        return $visibleHomeTabConfigs;
    }

    public function checkHomeTabLock(HomeTab $homeTab)
    {
        $adminHomeTabConfig = $this->homeTabConfigRepo->findOneBy(
            [
                'homeTab' => $homeTab,
                'type' => 'admin_desktop',
                'user' => null,
                'workspace' => null,
            ]
        );

        return !is_null($adminHomeTabConfig) ?
            $adminHomeTabConfig->isLocked() :
            false;
    }

    public function checkHomeTabVisibilityForConfigByUser(HomeTab $homeTab, User $user)
    {
        $adminHomeTabConfig = $this->homeTabConfigRepo->findOneBy(
            [
                'homeTab' => $homeTab,
                'type' => 'admin_desktop',
                'user' => null,
                'workspace' => null,
            ]
        );
        $userHomeTabConfig = $this->homeTabConfigRepo->findOneBy(
            [
                'homeTab' => $homeTab,
                'user' => $user,
            ]
        );

        if (is_null($adminHomeTabConfig) && is_null($userHomeTabConfig)) {
            $visible = false;
        } elseif (is_null($userHomeTabConfig)) {
            $visible = $adminHomeTabConfig->isVisible();
        } elseif (is_null($adminHomeTabConfig)) {
            $visible = true;
        } else {
            $visible = $adminHomeTabConfig->isLocked() ? $adminHomeTabConfig->isVisible() : true;
        }

        return $visible;
    }

    public function checkHomeTabVisibilityByUser(HomeTab $homeTab, User $user)
    {
        $adminHomeTabConfig = $this->homeTabConfigRepo->findOneBy(
            [
                'homeTab' => $homeTab,
                'type' => 'admin_desktop',
                'user' => null,
                'workspace' => null,
            ]
        );
        $userHomeTabConfig = $this->homeTabConfigRepo->findOneBy(
            [
                'homeTab' => $homeTab,
                'user' => $user,
            ]
        );

        if (is_null($adminHomeTabConfig) && is_null($userHomeTabConfig)) {
            return false;
        } elseif (is_null($userHomeTabConfig)) {
            return $adminHomeTabConfig->isVisible();
        } elseif (is_null($adminHomeTabConfig)) {
            return $userHomeTabConfig->isVisible();
        } else {
            $visible = $adminHomeTabConfig->isLocked() ?
                $adminHomeTabConfig->isVisible() :
                $userHomeTabConfig->isVisible();

            return $visible;
        }
    }

    public function checkHomeTabVisibilityByWorkspace(HomeTab $homeTab, Workspace $workspace)
    {
        $homeTabConfig = $this->homeTabConfigRepo->findOneBy(
            [
                'homeTab' => $homeTab,
                'workspace' => $workspace,
            ]
        );

        if (is_null($homeTabConfig)) {
            return false;
        }

        return $homeTabConfig->isVisible();
    }

    public function insertWidgetInstanceConfig(WidgetInstanceConfig $widgetHomeTabConfig)
    {
        $this->om->persist($widgetHomeTabConfig);
        $this->om->flush();
    }

    public function deleteWidgetInstanceConfig(WidgetInstanceConfig $widgetHomeTabConfig)
    {
        $this->om->remove($widgetHomeTabConfig);
        $this->om->flush();
    }

    public function changeVisibilityWidgetInstanceConfig(WidgetInstanceConfig $widgetHomeTabConfig, $visible = null)
    {
        $isVisible = is_null($visible) ? !$widgetHomeTabConfig->isVisible() : $visible;
        $widgetHomeTabConfig->setVisible($isVisible);
        $this->om->flush();
    }

    public function changeLockWidgetInstanceConfig(WidgetInstanceConfig $widgetHomeTabConfig)
    {
        $isLocked = !$widgetHomeTabConfig->isLocked();
        $widgetHomeTabConfig->setLocked($isLocked);
        $this->om->flush();
    }

    /**
     * HomeTabRepository access methods.
     */
    public function getHomeTabById($homeTabId)
    {
        return $this->homeTabRepo->findOneById($homeTabId);
    }

    public function getAdminHomeTabByIdAndType($homeTabId, $homeTabType)
    {
        $criterias = [
            'id' => $homeTabId,
            'user' => null,
            'workspace' => null,
            'type' => 'admin_'.$homeTabType,
        ];

        return $this->homeTabRepo->findOneBy($criterias);
    }

    public function getHomeTabByIdAndWorkspace($homeTabId, Workspace $workspace)
    {
        return $this->homeTabRepo->findOneBy(['id' => $homeTabId, 'workspace' => $workspace]);
    }

    public function getHomeTabByWorkspace(Workspace $workspace)
    {
        return $this->homeTabRepo->findBy(['workspace' => $workspace]);
    }

    public function getHomeTabByIdAndType($homeTabId, $type)
    {
        return $this->homeTabRepo->findOneBy(['id' => $homeTabId, 'type' => $type]);
    }

    public function getVisibleWorkspaceHomeTabConfigsByWorkspace(Workspace $workspace)
    {
        return $this->homeTabConfigRepo->findVisibleWorkspaceHomeTabConfigsByWorkspace($workspace);
    }

    public function getHomeTabConfigByHomeTabAndWorkspace(HomeTab $homeTab, Workspace $workspace)
    {
        return $this->homeTabConfigRepo->findOneBy(['homeTab' => $homeTab, 'workspace' => $workspace]);
    }

    public function getHomeTabConfigByHomeTabAndUser(HomeTab $homeTab, User $user)
    {
        return $this->homeTabConfigRepo->findOneBy(['homeTab' => $homeTab, 'user' => $user]);
    }

    /**
     * WidgetInstanceConfigRepository access methods.
     */
    public function getAdminWidgetConfigs(HomeTab $homeTab)
    {
        return $this->widgetHomeTabConfigRepo->findAdminWidgetConfigs($homeTab);
    }

    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function getLogger()
    {
        return $this->logger;
    }
}
