<?php
/**
 * Created by PhpStorm.
 * User: panos
 * Date: 17/10/17
 * Time: 14:10.
 */

namespace Claroline\CoreBundle\Command\DatabaseIntegrity;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class LogMigrationCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('claroline:log:migrate')
            ->setDescription('Migrate logs to a mongodb database');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
    }
}
