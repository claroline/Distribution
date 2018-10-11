<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Command\Logs;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class LogConnectionComputeCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        parent::configure();

        $this->setName('claroline:connection:duration')
            ->setDescription('Computes duration for connection logs');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $logConnectManager = $this->getContainer()->get('claroline.manager.log_connect');

        $output->writeln('<info>  Computing duration for platform connections...</info>');
        $logConnectManager->computeAllPlatformDuration();
        $output->writeln('<info>  Duration for platform connections computed.</info>');
    }
}
