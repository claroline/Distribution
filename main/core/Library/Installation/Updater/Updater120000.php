<?php

namespace Claroline\CoreBundle\Library\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Tab\HomeTab;
use Claroline\CoreBundle\Entity\Tab\HomeTabConfig;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Widget\Type\SimpleWidget;
use Claroline\CoreBundle\Entity\Widget\Widget;
use Claroline\CoreBundle\Entity\Widget\WidgetContainer;
use Claroline\CoreBundle\Entity\Widget\WidgetContainerConfig;
use Claroline\CoreBundle\Entity\Widget\WidgetInstance;
use Claroline\CoreBundle\Entity\Widget\WidgetInstanceConfig;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Updater120000 extends Updater
{
    protected $logger;

    /** @var ObjectManager */
    private $om;

    /** @var PlatformConfigurationHandler */
    private $config;

    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->logger = $logger;

        $this->om = $container->get('claroline.persistence.object_manager');
        $this->conn = $container->get('doctrine.dbal.default_connection');
        $this->config = $container->get('claroline.config.platform_config_handler');
        $this->container = $container;
    }

    public function preUpdate()
    {
        $this->saveOldTabsTables();
    }

    public function saveOldTabsTables()
    {
        $tableManager = $this->container->get('claroline.persistence.table_manager');
        $tableManager->setLogger($this->logger);

        $toCopy = ['claro_home_tab', 'claro_widget_instance'];

        foreach ($toCopy as $table) {
            $tableManager->copy($table);
        }
    }

    public function updateTabsStructure()
    {
        $this->log('Restoring HomeTabConfigs...');

        $sql = '
            UPDATE claro_home_tab_config config
            LEFT JOIN claro_home_tab_temp tab
            ON config.home_tab_id = tab.id
            SET config.name = tab.name';

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        $sql = 'UPDATE claro_home_tab_config set longTitle = ""';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        $sql = 'UPDATE claro_home_tab_config set centerTitle = false';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
    }

    public function postUpdate()
    {
        $this->updatePlatformParameters();

        $this->updateHomeTabType();
        $this->removeTool('parameters');
        $this->removeTool('claroline_activity_tool');
        $this->updateTabsStructure();
        $this->updateWidgetsStructure();
        $this->linkWidgetsInstanceToContainers();
        $this->restoreWidgetInstancesConfigs();
        $this->checkDesktopTabs();
        $this->deactivateActivityResourceType();
    }

    private function updateHomeTabType()
    {
        $this->log('Updating hometab types...');
        $sql = 'UPDATE claro_home_tab SET type = "administration" WHERE type LIKE "admin_desktop"';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
    }

    private function updatePlatformParameters()
    {
        $oldName = 'default_root_anon_id';
        $newName = 'authorized_ips_username';

        if ($this->config->hasParameter($oldName)) {
            // param not already changed
            $this->log(
                sprintf('Renaming platform parameter `%s` into `%s`.', $oldName, $newName)
            );

            $userName = null;

            $userId = $this->config->getParameter($oldName);
            if (!empty($userId)) {
                // load corresponding entity

                /** @var User $user */
                $user = $this->om->getRepository('ClarolineCoreBundle:User')->find($userId);
                if (!empty($user)) {
                    $userName = $user->getUsername();
                }
            }

            $this->config->setParameter($newName, $userName);
            $this->config->removeParameter($oldName);
        }
    }

    private function removeTool($toolName)
    {
        $this->log(sprintf('Removing `%s` tool...', $toolName));

        $tool = $this->om->getRepository('ClarolineCoreBundle:Tool\Tool')->findOneBy(['name' => $toolName]);
        if (!empty($tool)) {
            $this->om->remove($tool);
            $this->om->flush();
        }
    }

    private function updateWidgetsStructure()
    {
        $this->log('Update widget structure...');

        if (count($this->om->getRepository(WidgetContainer::class)->findAll()) > 0) {
            $this->log('Containers already migrated. Truncate manually to try again.');
        } else {
            $this->log('Migrating WidgetDisplayConfig to WidgetContainer');

            $sql = 'SELECT * FROM claro_widget_display_config ';
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $i = 0;

            foreach ($stmt->fetchAll() as $rowConfig) {
                $this->restoreWidgetContainer($rowConfig);
                ++$i;

                if (0 === $i % 200) {
                    $this->om->flush();
                }
            }

            $this->om->flush();
        }

        if (count($this->om->getRepository(SimpleWidget::class)->findAll()) > 0) {
            $this->log('SimpleTextWidget already migrated');
        } else {
            $this->log('Migrating SimpleTextWidget to SimpleWidget...');

            $sql = '
              INSERT INTO claro_widget_simple (id, content, widgetInstance_id)
              SELECT id, content, widgetInstance_id from claro_simple_text_widget_config';
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();

            $widget = $this->om->getRepository(Widget::class)->findOneBy(['name' => 'simple']);

            $sql = "
              UPDATE claro_widget_instance instance
              LEFT JOIN claro_widget widget
              ON instance.widget_id = instance.id
              SET instance.widget_id = {$widget->getId()}
              WHERE widget.name LIKE 'simple_text'"
            ;
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
        }

        $this->log('Updating HomeTabs titles...');

        $tabs = $this->om->getRepository(HomeTabConfig::class)->findAll();
        $i = 0;

        foreach ($tabs as $tab) {
            if (!$tab->getLongTitle() || !$tab->getName()) {
                $this->updateTabTitle($tab);
            }

            ++$i;

            if (0 === $i % 200) {
                $this->om->flush();
            }
        }

        $this->om->flush();
    }

    private function restoreWidgetContainer($row)
    {
        $widgetContainer = new WidgetContainer();
        $widgetContainerConfig = new WidgetContainerConfig();
        $widgetContainerConfig->setWidgetContainer($widgetContainer);

        $sql = 'SELECT * FROM claro_widget_instance_temp where id = '.$row['widget_instance_id'];
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $widgetInstance = $stmt->fetch();

        $this->log('migrating '.$widgetInstance['name'].' ...');
        $entity = $this->om->getRepository(WidgetInstance::class)->find($row['widget_instance_id']);
        $widgetContainer->addInstance($entity);
        $widgetContainerConfig->setBackground($row['color']);
        $widgetContainerConfig->setName($widgetInstance['name']);
        $widgetContainerConfig->setLayout([1]);
        $widgetContainerConfig->setWidgetContainer($widgetContainer);

        $this->om->persist($widgetContainer);
        $this->om->persist($widgetContainerConfig);
    }

    private function updateTabTitle(HomeTabConfig $tab)
    {
        $this->log('Renaming tab '.$tab->getName().'...');

        if ('' === trim(strip_tags($tab->getName()))) {
            $tab->setName('Unknown');
        }

        if (!$tab->getLongTitle()) {
            $tab->setLongTitle(strip_tags($tab->getName()));
        }

        //maybe substr here
        $tab->setName(strip_tags($tab->getLongTitle()));

        $this->om->persist($tab);
    }

    private function linkWidgetsInstanceToContainers()
    {
        $this->log('Link WidgetInstances to WidgetContainer...');

        $sql = 'SELECT * FROM claro_widget_home_tab_config';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $i = 0;

        foreach ($stmt->fetchAll() as $rowConfig) {
            ++$i;
            $this->log('Linking for homeTabConfig '.$rowConfig['id']);
            $this->restoreWidgetInstanceLink($rowConfig);

            if (0 === $i % 200) {
                $this->om->flush();
            }
        }

        $this->om->flush();
    }

    private function restoreWidgetInstanceLink($row)
    {
        $homeTab = $this->om->getRepository(HomeTab::class)->find($row['home_tab_id']);
        $instance = $this->om->getRepository(WidgetInstance::class)->find($row['widget_instance_id']);
        //only one instance per container during the migration
        $container = $instance->getContainer();
        // /shrug
        if ($container) {
            $container->setHomeTab($homeTab);
            $this->om->persist($container);
        }
    }

    private function checkDesktopTabs()
    {
        $tabs = $this->om->getRepository(HomeTab::class)->findBy(['type' => HomeTab::TYPE_ADMIN_DESKTOP]);

        if (0 === count($tabs)) {
            $this->log('Adding default admin desktop tab...');

            $desktopHomeTab = new HomeTab();
            $desktopHomeTab->setType('admin_desktop');
            $desktopHomeTab->setName('Accueil');
            $desktopHomeTab->setLongTitle('Accueil');
            $this->om->persist($desktopHomeTab);

            $desktopHomeTabConfig = new HomeTabConfig();
            $desktopHomeTabConfig->setHomeTab($desktopHomeTab);
            $desktopHomeTabConfig->setType('admin_desktop');
            $desktopHomeTabConfig->setVisible(true);
            $desktopHomeTabConfig->setLocked(false);
            $desktopHomeTabConfig->setTabOrder(1);

            $this->om->persist($desktopHomeTabConfig);
            $this->om->flush();
        }
    }

    private function restoreWidgetInstancesConfigs()
    {
        if (0 === $this->om->count(WidgetInstanceConfig::class)) {
            $this->log('Copying WidgetInsanceConfigs');

            $sql = '
              INSERT INTO claro_widget_instance_config (id, widget_instance_id, workspace_id, widget_order, type, is_visible, is_locked)
              SELECT id, widget_instance_id, workspace_id, widget_order, type, is_visible, is_locked from claro_widget_home_tab_config';
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();

            $sql = 'UPDATE claro_widget_instance_config set widget_order = 0';
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
        } else {
            $this->log('WidgetInstanceConfigs already copied');
        }
    }

    private function deactivateActivityResourceType()
    {
        $resourceTypeRepo = $this->om->getRepository('ClarolineCoreBundle:Resource\ResourceType');
        $activityType = $resourceTypeRepo->findOneBy(['name' => 'activity']);

        if (!empty($activityType)) {
            $this->log('Deactivating Activity resource...');

            $activityType->setEnabled(false);
            $this->om->persist($activityType);
            $this->om->flush();

            $this->log('Activity resource is deactivated.');
        }
    }
}
