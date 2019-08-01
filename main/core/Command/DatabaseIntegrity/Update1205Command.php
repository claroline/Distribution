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

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Library\Logger\ConsoleLogger;
use Doctrine\ORM\Query\ResultSetMappingBuilder;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class Update1205Command extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('claroline:routes:12.5')
            ->setDescription('Update 12.5 routes')
            ->setDefinition([
                new InputArgument('base_path', InputArgument::REQUIRED, 'The value'),
           ]);
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

        //this is the list of regexes we'll need to use
        $regexes = [
          '\/workspaces\/(.*)\/open' => [
              '/#/desktop/workspaces/open/:wslug',
              ['Claroline\CoreBundle\Entity\Workspace\Workspace'],
          ],
          '\/resource\/open/([^\/]*)\/(.*)' => [
            '/#/desktop/workspaces/open/:wslug/resource_manager/:nslug',
            ['Claroline\CoreBundle\Entity\Resource\ResourceNode'],
          ],
        ];

        foreach ($parsableEntities as $class => $properties) {
            $this->log('Replacing old urls for '.$class.'...');
            foreach ($properties as $property) {
                $this->log('Looking for property '.$property.'...');
                $em = $this->getContainer()->get('doctrine.orm.entity_manager');
                $metadata = $em->getClassMetadata($class);

                $tableName = $metadata->getTableName();
                $columnName = $metadata->getColumnName($property);

                foreach ($regexes as $regex => $replacement) {
                    $this->log('Matching regex '.$regex.'...');
                    $sql = 'SELECT * from '.$tableName.' WHERE '.$columnName." RLIKE '{$regex}'";
                    $this->log($sql);
                    $rsm = new ResultSetMappingBuilder($em);
                    $rsm->addRootEntityFromClassMetadata($class, '');
                    $query = $em->createNativeQuery($sql, $rsm);
                    $data = $query->getResult();
                    $this->log(count($data).' results...');
                    $i = 0;

                    foreach ($data as $entity) {
                        $this->log('Updating '.$i.'/'.count($data));
                        $func = 'get'.ucfirst($property);
                        $text = $entity->$func();
                        $text = $this->replace($regex, $replacement, $text, $prefix);
                        $func = 'set'.ucfirst($property);
                        //$entity->$func($text);
                        //$em->persist($entity);
                        ++$i;
                    }

                    $this->log('Flushing...');
                    $em->flush();
                }
            }
        }
    }

    public function replace($regex, $replacement, $text, $prefix)
    {
        $finder = $this->getContainer()->get('claroline.api.finder');
        $matches = [];
        preg_match('#'.$regex.'#', $text, $matches, PREG_OFFSET_CAPTURE);
        array_shift($matches);

        foreach ($replacement[1] as $pos => $class) {
            $object = $finder->get($class)->findOneBy(['identifier' => $matches[$pos][0]]);

            if (Workspace::class === $class) {
                $replacement[0] = str_replace(':wslug', $object->getSlug(), $replacement[0]);
            }

            if (ResourceNode::class === $class) {
                $replacement[0] = str_replace(':nslug', $object->getSlug(), $replacement[0]);
            }
        }

        $regex = $prefix.$regex;

        $text = preg_replace('#'.$regex.'#', $prefix.$replacement[0], $text);
    }

    private function setLogger($logger)
    {
        $this->consoleLogger = $logger;
    }

    private function log($log)
    {
        $this->consoleLogger->info($log);
    }
}
