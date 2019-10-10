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

class RegisterUserToWorkspaceFromCsvCommand extends ContainerAwareCommand
{
    use BaseCommandTrait;
    private $params = ['user' => 'The username', 'role' => 'the role key'];

    protected function configure()
    {
        $this->setName('claroline:workspace:register-user')
            ->setDescription('Registers users to workspaces from a csv file')
            ->setAliases(['claroline:csv:workspace_register']);
        $this->setDefinition(
            [
                new InputArgument(
                    'user',
                    InputArgument::REQUIRED,
                    'The user username.'
                ),
            ],
            [
                new InputArgument(
                    'role',
                    InputArgument::REQUIRED,
                    'The role key.'
                ),
            ]
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $om = $this->getContainer()->get('Claroline\AppBundle\Persistence\ObjectManager');
    }
}
