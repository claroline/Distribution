<?php

namespace Claroline\CoreBundle\Command\DatabaseIntegrity;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ResourceSlugBuilderCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('claroline:resource:slug')
            ->setDescription('Rebuild the resources slug');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->conn = $this->getContainer()->get('doctrine.dbal.default_connection');

        $sql = "
             UPDATE claro_resource_node node set SLUG = CONCAT(SUBSTR(node.name,1,100) , '-', node.id)
        ";

        $output->writeln($sql);
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $output->writeln('Done !');
    }
}
