<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Command\DatabaseIntegrity;

use Claroline\AppBundle\Logger\ConsoleLogger;
use Claroline\AppBundle\Persistence\ObjectManager;
use Doctrine\DBAL\Driver\Connection;
use Doctrine\DBAL\DriverManager;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class Update1205Command extends ContainerAwareCommand
{
    private $consoleLogger;

    const ENTITIES = [
        'Claroline\CoreBundle\Entity\Content' => ['content'],
        'Claroline\CoreBundle\Entity\Resource\Revision' => ['content'],
        'Claroline\AgendaBundle\Entity\Event' => ['description'],
        'Claroline\AnnouncementBundle\Entity\Announcement' => ['content'],
        'Innova\PathBundle\Entity\Path\Path' => ['description'],
        'Innova\PathBundle\Entity\Step' => ['description'],
        'Claroline\CoreBundle\Entity\Widget\Type\SimpleWidget' => ['content'],
        'UJM\ExoBundle\Entity\Exercise' => ['endMessage'],
        'UJM\ExoBundle\Entity\Item\Item' => ['content'],
        'Claroline\ForumBundle\Entity\Message' => ['content'],
    ];

    protected function configure()
    {
        $this->setName('claroline:routes:12.5')
            ->setDescription('Update 12.5 routes')
            ->setDefinition([
                new InputArgument('base_path', InputArgument::OPTIONAL, 'The value'),
            ])
            ->addOption('force', 'f', InputOption::VALUE_NONE, 'If not force, command goes dry run')
            ->addOption('fix', null, InputOption::VALUE_REQUIRED, 'Will run converter from a backup database (used to fix a previous buggy converter.)')
            ->addOption('show-text', 's', InputOption::VALUE_NONE, 'Show the replaced texts');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $consoleLogger = ConsoleLogger::get($output);
        $this->setLogger($consoleLogger);

        /** @var EntityManager $em */
        $em = $this->getContainer()->get('doctrine.orm.entity_manager');

        $this->log('Updating routes in database rich text');
        $prefix = $input->getArgument('base_path') ?? '';

        if ($input->getOption('fix')) {
            $this->fix($input->getOption('fix'), $prefix, $input->getOption('show-text'), $input->getOption('force'));
        } else {
            foreach (static::ENTITIES as $class => $properties) {
                foreach ($properties as $property) {
                    foreach ($this->getPathsToReplace() as $regex => $replacement) {
                        $data = $this->search($em->getConnection(), $class, $property, $regex);
                        foreach ($data as $i => $result) {
                            $text = $this->replace($regex, $replacement, $result['content'], $prefix, $input->getOption('show-text'));

                            if ($input->getOption('force')) {
                                $this->log('Updating '.$i.'/'.count($data));

                                $this->update($em->getConnection(), $class, $property, ['id' => $result['id'], 'content' => $text]);
                            }
                        }
                    }
                }
            }
        }
    }

    private function getPathsToReplace()
    {
        $uuid = '[0-9A-Za-z_\-\.]';

        return [
            // home tabs
            '\/workspaces\/(?<ws>[0-9]+)\/open\/tool\/home#\/tab\/(?<obj>'.$uuid.'+)' => [
                '#/desktop/workspaces/open/:ws/home/:obj',
                ['ws' => null, 'obj' => 'Claroline\CoreBundle\Entity\Tab\HomeTab'],
            ],
            // ws resource manager
            '\/workspaces/(?<ws>[0-9]+)/open/tool/resource_manager#resources/(?<obj>'.$uuid.'+)' => [
                '#/desktop/workspaces/open/:ws/resources/:obj',
                ['ws' => 'Claroline\CoreBundle\Entity\Workspace\Workspace', 'obj' => 'Claroline\CoreBundle\Entity\Resource\ResourceNode'],
            ],
            '\/workspaces/(?<ws>[0-9]+)/open/tool/resource_manager#/(?<obj>'.$uuid.'+)' => [
                '#/desktop/workspaces/open/:ws/resources/:obj',
                ['ws' => 'Claroline\CoreBundle\Entity\Workspace\Workspace', 'obj' => 'Claroline\CoreBundle\Entity\Resource\ResourceNode'],
            ],
            //open can be id
            '\/workspaces\/(?<ws>[0-9]+)\/open\/tool\/(?<obj>'.$uuid.'*)' => [
                '#/desktop/workspaces/open/:ws/:obj',
                ['ws' => 'Claroline\CoreBundle\Entity\Workspace\Workspace'],
            ],
            //open can be id
            '\/workspaces\/(?<ws>[0-9]+)\/open' => [
                '#/desktop/workspaces/open/:ws',
                ['ws' => 'Claroline\CoreBundle\Entity\Workspace\Workspace'],
            ],
            //open can be uuid or id (resource type then id)
            '\/resource\/open\/([A-Za-z_\-]+)\/(?<obj>'.$uuid.'+)' => [
                '#/desktop/workspaces/open/:ws/resources/:obj',
                ['ws' => null, 'obj' => 'Claroline\CoreBundle\Entity\Resource\ResourceNode'],
            ],
            //open can be uuid or id
            '\/resource\/open\/(?<obj>'.$uuid.'+)' => [
                '#/desktop/workspaces/open/:ws/resources/:obj',
                ['ws' => null, 'obj' => 'Claroline\CoreBundle\Entity\Resource\ResourceNode'],
            ],
            //show is type then id or uuid
            '\/resources\/show\/([A-Za-z_\-]+)\/(?<obj>'.$uuid.'+)' => [
                '#/desktop/workspaces/open/:ws/resources/:obj',
                ['ws' => null, 'obj' => 'Claroline\CoreBundle\Entity\Resource\ResourceNode'],
            ],
            //show is type then id or uuid
            '\/resources\/show\/(?<obj>'.$uuid.'+)' => [
                '#/desktop/workspaces/open/:ws/resources/:obj',
                ['ws' => null, 'obj' => 'Claroline\CoreBundle\Entity\Resource\ResourceNode'],
            ],
        ];
    }

    private function replace($regex, $replacement, $text, $prefix = '', $show = false)
    {
        /** @var ObjectManager $om */
        $om = $this->getContainer()->get('Claroline\AppBundle\Persistence\ObjectManager');
        $matches = [];
        preg_match_all('!'.$prefix.$regex.'!', $text, $matches);

        $newText = $text;
        if (!empty($matches)) {
            $this->log('FOUND : '.count($matches[0]));
            foreach ($matches[0] as $pathIndex => $fullPath) {
                $this->log('Found path : '.$fullPath);

                $toReplace = [];
                foreach ($replacement[1] as $name => $class) {
                    if ($class && !empty($matches[$name])) {
                        $id = trim($matches[$name][$pathIndex]);

                        $this->log('Finding resource of class '.$class.' with identifier '.$id);
                        $object = $om->find($class, $id);
                        if ($object) {
                            $toReplace[$name] = $object;

                            if (method_exists($object, 'getWorkspace') && !empty($object->getWorkspace())) {
                                $toReplace['ws'] = $object->getWorkspace();
                            }
                        }
                    }
                }

                if (count($toReplace) === count($replacement[1])) {
                    $newPath = $replacement[0];
                    foreach ($toReplace as $name => $replace) {
                        $newPath = str_replace(':'.$name, $replace->getSlug(), $newPath);
                    }

                    $newText = str_replace($fullPath, $newPath, $newText);
                } else {
                    $this->error('Could not find some route objects... skipping');

                    return null;
                }
            }
        }

        if ($show) {
            $this->log('Old text: '.$text);
            $this->log('New text: '.$newText);
        }

        return $newText;
    }

    private function fix(string $dbSource, string $prefix = '', bool $showText = false, bool $force = false)
    {
        /** @var EntityManager $em */
        $em = $this->getContainer()->get('doctrine.orm.entity_manager');

        // create a connection to a database which has not already processed the converter
        $conn = DriverManager::getConnection([
            'dbname' => $dbSource,
            'user' => $this->getContainer()->getParameter('database_user'),
            'password' => $this->getContainer()->getParameter('database_password'),
            'host' => $this->getContainer()->getParameter('database_host'),
            'driver' => $this->getContainer()->getParameter('database_driver'),
        ]);

        foreach (static::ENTITIES as $class => $properties) {
            foreach ($properties as $property) {
                foreach ($this->getPathsToReplace() as $regex => $replacement) {
                    // we search in the backup DB, because current DB has already been processed
                    $data = $this->search($conn, $class, $property, $regex);
                    foreach ($data as $i => $result) {
                        $matches = [];
                        preg_match_all('!'.$prefix.$regex.'!', $result['content'], $matches);
                        if (!empty($matches) && 1 < count($matches[0])) {
                            $text = $this->replace($regex, $replacement, $result['content'], $prefix, $showText);

                            if ($text && $force) {
                                $this->log('Updating '.$i.'/'.count($data));

                                // do the update in the current data base to correct converted routes
                                $this->update($em->getConnection(), $class, $property, ['id' => $result['id'], 'content' => $result['content']]);
                            }
                        }
                    }
                }
            }
        }
    }

    private function search(Connection $connection, string $class, string $property, string $regex)
    {
        $this->log(sprintf('Searching for route %s in prop "%s" of class "%s"', $regex, $property, $class));

        /** @var EntityManager $em */
        $em = $this->getContainer()->get('doctrine.orm.entity_manager');
        $metadata = $em->getClassMetadata($class);

        $tableName = $metadata->getTableName();
        $columnName = $metadata->getColumnName($property);

        $sqlRegex = addslashes($regex);
        $results = $connection
            ->query("SELECT id, $columnName as content FROM $tableName WHERE $columnName RLIKE '$sqlRegex'")
            ->fetchAll();

        $this->log(sprintf('Found %d results.', count($results)));

        return $results;
    }

    private function update(Connection $connection, string $class, string $property, array $data)
    {
        /** @var EntityManager $em */
        $em = $this->getContainer()->get('doctrine.orm.entity_manager');
        $metadata = $em->getClassMetadata($class);

        $tableName = $metadata->getTableName();
        $columnName = $metadata->getColumnName($property);

        $id = $data['id'];
        $newContent = addslashes($data['content']);
        $connection->exec("
            UPDATE $tableName SET $columnName = '$newContent' WHERE id = $id
        ");
    }

    private function setLogger($logger)
    {
        $this->consoleLogger = $logger;
    }

    private function log($log)
    {
        $this->consoleLogger->info($log);
    }

    private function error($error)
    {
        $this->consoleLogger->error($error);
    }
}
