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
        $this->setWidgetPlugin();
        $this->truncateTables();
        $this->saveOldResourcesMessages();
    }

    public function setWidgetPlugin()
    {
        $this->log('Set widgets plugins');

        $core = $this->om->getRepository('Claroline\CoreBundle\Entity\Plugin')->findOneBy([
          'vendorName' => 'Claroline',
          'bundleName' => 'CoreBundle',
        ]);

        $sql = "
            UPDATE claro_widget
            SET plugin_id = {$core->getId()}
            WHERE plugin_id IS NULL";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
    }

    public function truncateTables()
    {
        $tables = [
            'innova_path_widget_config_tags',
            'innova_path_widget_config',
            'claro_widget_instance',
            'claro_widget_instance_config',
            'claro_widget_simple',
            'claro_widget_container',
            'claro_widget_list',
            'claro_home_tab_roles',
            'claro_widget_container_config',
        ];

        foreach ($tables as $table) {
            $this->truncate($table);
        }
    }

    private function truncate($table)
    {
        try {
            $this->log('TRUNCATE '.$table);
            $sql = '
                SET FOREIGN_KEY_CHECKS=0;
                TRUNCATE TABLE '.$table.';
                SET FOREIGN_KEY_CHECKS=1;
            ';

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
        } catch (\Exception $e) {
            $this->log('Couldnt truncate '.$table);
        }
    }

    public function saveOldTabsTables()
    {
        $tableManager = $this->container->get('claroline.persistence.table_manager');
        $tableManager->setLogger($this->logger);

        $toCopy = [
          'claro_home_tab',
          'claro_home_tab_config',
          'claro_widget_instance',
          'claro_widget_display_config',
          'claro_widget_home_tab_config',
          'claro_simple_text_widget_config',
          'claro_widget_roles',
          'claro_widget',
          'claro_home_tab_roles',
        ];

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
            SET
                config.name = tab.name,
                config.longTitle = tab.name,
                config.centerTitle = false,
                config.is_visible = true,
                config.is_locked = true

            ';

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
    }

    public function postUpdate()
    {
        $this->restoreResourceThumbnails();
        $this->updatePlatformParameters();
        $this->removeTool('parameters');
        $this->removeTool('claroline_activity_tool');
        $this->updateTabsStructure();
        $this->buildContainers();
        $this->deactivateActivityResourceType();
    }

    public function end()
    {
        $this->updateWidgetInstances();
        $this->updateWidgetInstanceConfigType();
        $this->updateHomeTabType();
        $this->checkDesktopTabs();
    }

    private function updateHomeTabType()
    {
        $this->log('Updating hometab types...');
        $sql = 'UPDATE claro_home_tab SET type = "administration" WHERE type LIKE "admin_desktop" OR type LIKE "admin"';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
    }

    private function updateWidgetInstanceConfigType()
    {
        $this->log('Updating hometab types...');
        $sql = 'UPDATE claro_widget_instance_config SET type = "administration" WHERE type LIKE "admin_desktop" OR type LIKE "admin"';
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

    private function buildContainers()
    {
        if (count($this->om->getRepository(WidgetContainer::class)->findAll()) > 0) {
            $this->log('Containers already migrated. Truncate manually to try again.');
        } else {
            $this->log('WidgetContainer migration.');
            $sql = '
                INSERT INTO claro_widget_container (id, uuid)
                SELECT temp.id, (SELECT UUID()) as uuid FROM claro_widget_display_config_temp temp
                WHERE temp.user_id IS NULL OR temp.workspace_id IS NOT NULL';

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
        }

        $this->log('Link container to home tab.');
        $sql =
          '
              UPDATE claro_widget_container container
              JOIN claro_widget_display_config_temp wtc ON wtc.id = container.id
              JOIN claro_widget_home_tab_config_temp htc ON wtc.widget_instance_id = htc.widget_instance_id
              SET container.homeTab_id = htc.home_tab_id
          ';

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        if (count($this->om->getRepository(WidgetContainerConfig::class)->findAll()) > 0) {
            $this->log('Containers Config already migrated. Truncate manually to try again.');
        } else {
            $this->log('WidgetContainerConfig migration.');
            $sql = "
                INSERT INTO claro_widget_container_config (
                    id,
                    uuid,
                    backgroundType,
                    position,
                    layout,
                    widget_container_id,
                    is_visible
                )
                SELECT container.id, (SELECT UUID()) as uuid, 'none', config.row_position, '[1]', container.id, true
                FROM claro_widget_container container
                JOIN claro_widget_display_config_temp config ON config.id = container.id
            ";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();

            $sql = '
                UPDATE claro_widget_container_config config
                JOIN claro_widget_container container ON container.id = config.id
                JOIN claro_widget_display_config_temp wtc ON wtc.id = container.id
                JOIN claro_widget_instance_temp instance_temp ON instance_temp.id = wtc.widget_instance_id
                SET config.widget_name = instance_temp.name
            ';

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
        }
    }

    private function restoreTextsWidgets()
    {
        if (count($this->om->getRepository(SimpleWidget::class)->findAll()) > 0) {
            $this->log('SimpleTextWidget already migrated');
        } else {
            $this->log('Migrating SimpleTextWidget to SimpleWidget...');

            $widget = $this->om->getRepository(Widget::class)->findOneBy(['name' => 'simple']);

            $sql = "
                INSERT INTO claro_widget_instance (id, widget_id, uuid, container_id)
                SELECT conf.id, {$widget->getId()}, (SELECT UUID()) as uuid, container.id
                FROM claro_widget_display_config_temp conf
                JOIN claro_widget_instance_temp instance_temp ON instance_temp.id = conf.widget_instance_id
                JOIN claro_widget_temp widget_temp ON instance_temp.widget_id = widget_temp.id
                JOIN claro_widget_container container ON container.id = conf.id
                WHERE widget_temp.name = 'simple_text'
            ";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();

            $sql = '
                INSERT INTO claro_widget_simple (id, content, widgetInstance_id)
                SELECT text.id, text.content, config.id from claro_simple_text_widget_config_temp text
                JOIN claro_widget_display_config_temp config ON text.widgetInstance_id = config.widget_instance_id
                JOIN claro_widget_container container ON container.id = config.id
            ';

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
        }
    }

    private function restoreListsWidgets()
    {
        $lists = [
            'agenda_' => ['events', ['-start', 'table', "['title', 'allDay', 'start', 'end']"]],
            'my_workspaces' => ['my_workspaces', ['-id', 'list', '[]']],
            'agenda_task' => ['tasks', ['-start', 'table', "['title', 'allDay', 'start', 'end']"]],
            'claroline_announcement_widget' => ['announcements', ['-id', 'list', '[]']],
            'blog_list' => ['blog_posts', ['-id', 'list', '[]']],
            'claroline_forum_widget' => ['forum_messages', ['-id', 'list', '[]']],
        ];

        foreach ($lists as $oldList => $data) {
            $this->log("Migrating {$oldList} widgets...");

            $widget = $this->om->getRepository(Widget::class)->findOneBy(['name' => 'list']);
            $dataSource = $this->om->getRepository('ClarolineCoreBundle:DataSource')->findOneByName($data[0]);

            $sql = "
                INSERT INTO claro_widget_instance (id, widget_id, uuid, container_id, dataSource_id)
                SELECT conf.id, {$widget->getId()}, (SELECT UUID()) as uuid, container.id, {$dataSource->getId()}
                FROM claro_widget_display_config_temp conf
                JOIN claro_widget_instance_temp instance_temp ON instance_temp.id = conf.widget_instance_id
                JOIN claro_widget_temp widget_temp ON instance_temp.widget_id = widget_temp.id
                JOIN claro_widget_container container ON container.id = conf.id
                WHERE widget_temp.name = '{$oldList}'
            ";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();

            if (isset($data[1])) {
                $parameters = $data[1];
                $sortBy = $parameters[0];
                $display = $parameters[1];
                $displayedColumns = $parameters[2];

                $this->log('Setting default list parameters...');

                $sql = "
                    INSERT INTO claro_widget_list (sortBy, widgetInstance_id, display, displayedColumns)
                    SELECT '{$sortBy}', conf.id, '{$display}', '{$displayedColumns}' from claro_widget_display_config_temp conf
                    JOIN claro_widget_instance_temp instance_temp ON instance_temp.id = conf.widget_instance_id
                    JOIN claro_widget_temp widget_temp ON instance_temp.widget_id = widget_temp.id
                    JOIN claro_widget_instance instance ON instance.id = conf.id
                    WHERE widget_temp.name = '{$oldList}';
                ";

                $stmt = $this->conn->prepare($sql);
                $stmt->execute();
            }
        }
    }

    private function updateWidgetInstances()
    {
        $this->log('Update widget instances...');
        $this->restoreTextsWidgets();
        $this->restoreListsWidgets();

        if (0 === $this->om->count(WidgetInstanceConfig::class)) {
            $this->log('Copying WidgetInsanceConfigs');

            $sql = '
                INSERT INTO claro_widget_instance_config (id, widget_instance_id, workspace_id, widget_order, type, is_visible, is_locked)
                SELECT temp.id, temp.widget_instance_id, temp.workspace_id, temp.widget_order, temp.type, temp.is_visible, temp.is_locked from claro_widget_home_tab_config_temp temp
                JOIN claro_widget_instance instance on instance.id = temp.widget_instance_id
            ';
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();

            $sql = 'UPDATE claro_widget_instance_config set widget_order = 0';
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
        } else {
            $this->log('WidgetInstanceConfigs already copied');
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

    private function saveOldResourcesMessages()
    {
        try {
            $this->log('Save old resources thumbnail links');
            $query = '
                CREATE TABLE resource_icon_save_link
                AS (SELECT id, thumbnail_id FROM claro_resource_node)
            ';
            $this->conn->query($query);
        } catch (\Exception $e) {
            $this->log('resource_icon_save_link already saved');
        }
    }

    private function restoreResourceThumbnails()
    {
        try {
            $this->log('Restore old resources thumbnail links');
            $query = '
                UPDATE claro_resource_node node
                JOIN resource_icon_save_link link ON node.id = link.id
                JOIN claro_resource_thumbnail thumbnail ON thumbnail.id = link.thumbnail_id
                SET node.thumbnail = thumbnail.relative_url
            ';

            $this->conn->query($query);
        } catch (\Exception $e) {
            $this->log('Failed copying thumbnails');
        }
    }
}
