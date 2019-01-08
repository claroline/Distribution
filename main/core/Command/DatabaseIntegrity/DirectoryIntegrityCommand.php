<?php

namespace Claroline\CoreBundle\Command\DatabaseIntegrity;

use Claroline\CoreBundle\Entity\Resource\Directory;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class DirectoryIntegrityCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('claroline:directory:check')
            ->setDescription('Checks the resource nodes integrity of the platform.')
            ->addOption('workspace', 'w', InputOption::VALUE_OPTIONAL, 'User login or email. Restore roles only for this user.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $om = $container->get('claroline.persistence.object_manager');

        if ($code = $input->getOption('workspace')) {
            $workspace = $om->getRepository(Workspace::class)->findOneByCode($code);
            $dirType = $om->getRepository(ResourceType::class)->findOneByName('directory');

            $nodes = $om->getRepository(ResourceNode::class)->findBy([
                'workspace' => $workspace,
                'resourceType' => $dirType,
            ]);

            foreach ($nodes as $node) {
                $directory = $container->get('claroline.manager.resource_manager')->getResourceFromNode($node);

                if (!$directory) {
                    $newDir = new Directory();
                    $newDir->setResourceNode($node);

                    $om->persist($newDir);
                    $output->writeln("Add directory for node {$node->getName()}");
                }
            }

            $output->writeln('Flushing...');
            $om->flush();
        }
    }
}
