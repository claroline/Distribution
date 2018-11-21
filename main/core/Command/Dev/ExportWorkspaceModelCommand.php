<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Command\Dev;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ExportWorkspaceModelCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('claroline:workspace:export_model')
            ->setDescription('export workspace into archives');
        $this->setDefinition(
            [
                new InputArgument('export_directory', InputArgument::REQUIRED, 'The absolute path to the zip file.'),
                new InputArgument('code', InputArgument::OPTIONAL, 'The workspace code'),
            ]
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
    }
}
