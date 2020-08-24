<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Library\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\DataSource;
use Claroline\CoreBundle\Entity\Widget\Widget;
use Claroline\InstallationBundle\Updater\Updater;
use Doctrine\DBAL\Driver\Connection;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Updater120549 extends Updater
{
    /** @var Connection */
    private $connection;
    /** @var ObjectManager */
    private $om;
    /** @var string */
    private $oldConfigDir;
    /** @var string */
    private $newConfigDir;

    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->logger = $logger;
        $this->connection = $container->get('doctrine.dbal.default_connection');
        $this->om = $container->get(ObjectManager::class);

        $this->oldConfigDir = $container->getParameter('kernel.root_dir').DIRECTORY_SEPARATOR.'config'.DIRECTORY_SEPARATOR;
        $this->newConfigDir = $container->getParameter('claroline.param.config_directory').DIRECTORY_SEPARATOR;
    }

    public function preUpdate()
    {
        $this->migrateConfigFiles();
    }

    public function postUpdate()
    {
        $this->migrateResourceWidgets();
    }

    private function migrateConfigFiles()
    {
        $this->log(sprintf('Move Claroline config file in "%s"', $this->newConfigDir));

        $filesToMove = [
            'bundles.ini',
            'ip_white_list.yml',
            'platform_options.json',
            'white_list_ip_range.yml',
        ];

        foreach ($filesToMove as $file) {
            if (file_exists($this->oldConfigDir.$file)) {
                rename($this->oldConfigDir.$file, $this->newConfigDir.$file);
            }
        }
    }

    private function migrateResourceWidgets()
    {
        $this->log('Set correct data source in existing ResourceWidget instances...');

        $resourceWidget = $this->om->getRepository(Widget::class)->findOneBy(['name' => 'resource']);
        $resourceSource = $this->om->getRepository(DataSource::class)->findOneBy(['name' => 'resource']);

        if ($resourceWidget && $resourceSource) {
            $this->connection
                ->prepare('
                    UPDATE claro_widget_instance
                    SET dataSource_id = :sourceId
                    WHERE widget_id = :widgetId
                ')
                ->execute([
                    'sourceId' => $resourceSource->getId(),
                    'widgetId' => $resourceWidget->getId(),
                ]);
        }
    }
}
