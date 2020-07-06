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
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Query\ResultSetMappingBuilder;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class Update1205Command extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('claroline:routes:12.5')
            ->setDescription('Update 12.5 routes')
            ->setDefinition([
                new InputArgument('base_path', InputArgument::OPTIONAL, 'The value'),
            ])
            ->addOption('force', 'f', InputOption::VALUE_NONE, 'If not force, command goes dry run')
            ->addOption('show-text', 's', InputOption::VALUE_NONE, 'Show the replaced texts')
            ->addOption('count', 'c', InputOption::VALUE_NONE, 'Count number of same urls in the same text');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $consoleLogger = ConsoleLogger::get($output);
        $this->setLogger($consoleLogger);

        $this->log('Updating routes in database rich text');
        $prefix = $input->getArgument('base_path');
        //the list is probably incomplete, but it is a start

        $parsableEntities = [
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

        $endOfUrl = '[^"^#^&^<^>]';

        //this is the list of regexes we'll need to use
        $regexes = [
            // home tabs
            '\/workspaces\/([0-9]+)\/open\/tool\/home#\/tab\/([^\/^"^#^&^<^>]+)' => [
                '#/desktop/workspaces/open/:slug0/home/:slug1',
                ['Claroline\CoreBundle\Entity\Workspace\Workspace', 'Claroline\CoreBundle\Entity\Tab\HomeTab'],
            ],
            //open can be id
            '\/workspaces\/([0-9]+)\/open\/tool\('.$endOfUrl.'*)' => [
                '#/desktop/workspaces/open/:slug0',
                ['Claroline\CoreBundle\Entity\Workspace\Workspace'],
            ],
            //open can be id
            '\/workspaces\/([0-9]+)\/open' => [
                '#/desktop/workspaces/open/:slug0',
                ['Claroline\CoreBundle\Entity\Workspace\Workspace'],
            ],
            //open can be uuid or id
            '\/resource\/open\/([^\/^"^#^&^<^>]+)' => [
                '#/desktop/workspaces/open/:slug0/resources/:slug1',
                ['Claroline\CoreBundle\Entity\Resource\ResourceNode'],
            ],
            //open can be uuid or id (resource type then id)
            '\/resource\/open\/([^\/]+)\/('.$endOfUrl.'*)' => [
                '#/desktop/workspaces/open/:slug0/resources/:slug1',
                ['Claroline\CoreBundle\Entity\Workspace\Workspace', 'Claroline\CoreBundle\Entity\Resource\ResourceNode'],
            ],
            //show is type then id or uuid
            '\/resources\/show\/(^\/^"^#^&^<^>]+)' => [
                '#/desktop/workspaces/open/:slug0/resources/:slug1',
                ['Claroline\CoreBundle\Entity\Workspace\Workspace', 'Claroline\CoreBundle\Entity\Resource\ResourceNode'],
            ],
            //show is type then id or uuid
            '\/resources\/show\/([^\/]*)\/('.$endOfUrl.'*)' => [
                '#/desktop/workspaces/open/:slug0/resources/:slug1',
                ['Claroline\CoreBundle\Entity\Workspace\Workspace', 'Claroline\CoreBundle\Entity\Resource\ResourceNode'],
            ],
        ];

        foreach ($parsableEntities as $class => $properties) {
            $this->log('Replacing old urls for '.$class.'...');
            foreach ($properties as $property) {
                $this->log('Looking for property '.$property.'...');
                /** @var EntityManager $em */
                $em = $this->getContainer()->get('doctrine.orm.entity_manager');
                $metadata = $em->getClassMetadata($class);

                $tableName = $metadata->getTableName();
                $columnName = $metadata->getColumnName($property);

                foreach ($regexes as $regex => $replacement) {
                    $this->log('Matching regex '.$regex.'...');

                    $rsm = new ResultSetMappingBuilder($em);
                    $rsm->addRootEntityFromClassMetadata($class, '');
                    $query = $em->createNativeQuery("SELECT * FROM $tableName WHERE $columnName RLIKE '$regex'", $rsm);
                    $data = $query->getResult();
                    $this->log(count($data).' results...');
                    $i = 0;

                    foreach ($data as $entity) {
                        $this->log('Updating '.$i.'/'.count($data));
                        $func = 'get'.ucfirst($property);
                        $text = $entity->$func();
                        $text = $this->replace($regex, $replacement, $text, $prefix, $input->getOption('show-text'), $input->getOption('count'));
                        $func = 'set'.ucfirst($property);

                        if ($input->getOption('force')) {
                            $entity->$func($text);
                            $em->persist($entity);
                        }

                        ++$i;
                    }

                    if ($input->getOption('force')) {
                        $this->log('Flushing...');
                        $em->flush();
                    }
                }
            }
        }
    }

    public function replace($regex, $replacement, $text, $prefix = '', $show = false, $count = false)
    {
        /** @var ObjectManager $om */
        $om = $this->getContainer()->get('Claroline\AppBundle\Persistence\ObjectManager');
        $matches = [];
        preg_match_all('!'.$prefix.$regex.'!', $text, $matches);

        $newText = $text;
        if (!empty($matches)) {
            if ($count && count($matches[0]) > 1) {
                $this->log('FOUND : '. count($matches[0]));
            } else {
                foreach ($matches[0] as $pathIndex => $fullPath) {
                    $this->log('Found path : '.$fullPath);

                    $newPath = $replacement[0];
                    foreach ($replacement[1] as $pos => $class) {
                        $id = trim($matches[$pos + 1][$pathIndex]);

                        $this->log('Finding resource of class '.$class.' with identifier '.$id);
                        $object = $om->find($class, $id);
                        if ($object) {
                            $newPath = str_replace(':slug'.$pos, $object->getSlug(), $newPath);
                        } else {
                            $this->error('Could not find object... skipping');
                            break 2; // go to next path, don't try any other replacement
                        }
                    }

                    $newText = str_replace($fullPath, $newPath, $newText);
                }
            }
        }

        if ($show) {
            $this->log('Old text: '.$text);
            $this->log('New text: '.$newText);
        }

        return $newText;
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
