<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Command\Removal;

use Claroline\CoreBundle\Command\Traits\AskRolesTrait;
use Psr\Log\LogLevel;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Logger\ConsoleLogger;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\ConfirmationQuestion;
use Symfony\Component\Console\Question\Question;

class RemoveWorkspaceCommand extends ContainerAwareCommand
{
    use AskRolesTrait;

    protected function configure()
    {
        $this->setName('claroline:remove:workspaces')
            ->setDescription('Remove workspaces');

        $this->addOption(
            'personal',
            'p',
            InputOption::VALUE_NONE,
            'When set to true, removes the personal workspaces'
        );

        $this->addOption(
            'standard',
            'i',
            InputOption::VALUE_NONE,
            'When set to true, removes the standard workspaces'
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $helper = $this->getHelper('question');
        $workspacesToRemove = [];
        $toDelete = [];
        $personal = $input->getOption('personal');
        $standard = $input->getOption('standard');

        $verbosityLevelMap = [
            LogLevel::NOTICE => OutputInterface::VERBOSITY_NORMAL,
            LogLevel::INFO => OutputInterface::VERBOSITY_NORMAL,
            LogLevel::DEBUG => OutputInterface::VERBOSITY_NORMAL,
        ];

        $consoleLogger = new ConsoleLogger($output, $verbosityLevelMap);
        $workspaceManager = $this->getContainer()->get('claroline.manager.workspace_manager');
        $workspaceManager->setLogger($consoleLogger);

        if ($personal) {
            $question = new ConfirmationQuestion('Remove all personal Workspaces ? y/n [y] ', true);
            $all = $helper->ask($input, $output, $question);
            $question = new ConfirmationQuestion('Include workspaces from removed users (orphans) ? y/n [y] ', true);
            $includeOrphans = $helper->ask($input, $output, $question);

            $rolesSearch = $this->askRoles($all, $input, $output, $this->getContainer(), $helper);

            $workspacesToDelete = $all ?
                $workspaceManager->getPersonalWorkspaceExcudingRoles($rolesSearch, $includeOrphans) :
                $workspaceManager->getPersonalWorkspaceByRolesIncludingGroups($rolesSearch, $includeOrphans);
        }

        if ($standard) {
            $question = new Question('Filter on code (continue if no filter)', null);
            $code = $helper->ask($input, $output, $question);
            $toDelete = $workspaceManager->getNonPersonalByCode($code);
        }

        $workspaces = array_unique(array_merge($workspacesToDelete, $toDelete));
        $output->writeln('Do you really want to remove theses workspaces ?');

        foreach ($workspaces as $workspace) {
            $output->writeln("{$workspace->getId()}: {$workspace->getName()} - {$workspace->getCode()} ");
        }

        $question = new ConfirmationQuestion('Do you really want to remove theses workspaces ? y/n [n] ', false);
        $continue = $helper->ask($input, $output, $question);

        if ($continue) {
            $om = $this->getContainer()->get('claroline.persistence.object_manager');
            $om->startFlushSuite();

            foreach ($workspaces as $workspace) {
                $workspaceManager->deleteWorkspace($workspace);
            }

            $om->endFlushSuite();
        }
    }
}
