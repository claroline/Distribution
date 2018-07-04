<?php

namespace Claroline\CoreBundle\Library\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Widget\Type\SimpleWidget;
use Claroline\CoreBundle\Entity\Widget\Widget;
use Claroline\CoreBundle\Entity\Widget\WidgetContainer;
use Claroline\CoreBundle\Entity\Widget\WidgetInstance;
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
    }

    public function postUpdate()
    {
        $this->updatePlatformParameters();

        $this->removeTool('parameters');
        $this->removeTool('claroline_activity_tool');
        $this->updateWidgetsStructure();
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
            $this->log('WidgetContainer already migrated');
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

            $sql = 'SELECT * FROM claro_simple_text_widget_config ';
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $i = 0;

            foreach ($stmt->fetchAll() as $rowConfig) {
                $this->restoreTextConfig($rowConfig);
                ++$i;

                if (0 === $i % 200) {
                    $this->om->flush();
                }
            }

            $this->om->flush();
        }
    }

    private function restoreWidgetContainer($row)
    {
        $this->log('migrating '.$widgetInstance->getName().' ...');
        $widgetContainer = new WidgetContainer();
        $widgetInstance = $this->om->getRepository(WidgetInstance::class)->find($row['widget_instance_id']);
        $widgetContainer->addInstance($widgetInstance);
        $widgetContainer->setColor($row['color']);
        $widgetContainer->setName($widgetInstance->getName());

        $this->om->persist($widgetContainer);
    }

    private function restoreTextConfig($row)
    {
        $simpleWidget = new SimpleWidget();
        $simpleWidget->setContent($row['content']);
        $widgetInstance = $this->om->getRepository(WidgetInstance::class)->find($row['widgetInstance_id']);
        $this->log('migrating content of '.$widgetInstance->getName().' ...');
        $simpleWidget->setWidgetInstance($widgetInstance);
        $widget = $this->om->getRepository(Widget::class)->findOneBy(['name' => 'simple']);
        $widgetInstance->setWidget($widget);
        $this->om->persist($widgetInstance);
        $this->om->persist($simpleWidget);
    }
}
