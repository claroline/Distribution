<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Command\Import;

use Claroline\AppBundle\Command\BaseCommandTrait;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Creates an user, optionaly with a specific role (default to simple user).
 */
class ImportCsvCommand extends ContainerAwareCommand
{
    use BaseCommandTrait;
    private $params = ['id' => 'The file id', 'action' => 'The action to execute'];

    protected function configure()
    {
        $this->setName('claroline:api:load')
            ->setDescription('Load from csv for the api');
        $this->setDefinition(
            [
              new InputArgument('id', InputArgument::REQUIRED, 'The file id.'),
              new InputArgument('action', InputArgument::REQUIRED, 'The action to execute.'),
            ]
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $id = $input->getArgument('id');
        $action = $input->getArgument('action');

        $id = 1;
        $action = 2;
    }
}
