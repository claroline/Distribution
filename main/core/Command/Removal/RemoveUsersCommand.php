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

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\ChoiceQuestion;
use Symfony\Component\Console\Question\ConfirmationQuestion;

/**
 * Removes users from the platform.
 */
class RemoveUsersCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('claroline:remove:users')
            ->setDescription('Remove users');

        $this->addOption(
            'all',
            'a',
            InputOption::VALUE_NONE,
            'When set to true, removes every users'
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $helper = $this->getHelper('question');
        //get excluding roles
        $roles = $this->getContainer()->get('claroline.persistence.object_manager')
            ->getRepository('ClarolineCoreBundle:Role')
            ->findAllPlatformRoles();
        $roleNames = array_map(function ($role) {
            return $role->getName();
        }, $roles);
        $roleNames[] = 'NONE';
        $all = $input->getOption('all');
        $questionString = $all ? 'Roles to exclude: ' : 'Roles to include: ';
        $question = new ChoiceQuestion($questionString, $roleNames);
        $question->setMultiselect(true);
        $roleNames = $helper->ask($input, $output, $question);
        $rolesSearch = array_filter($roles, function ($role) use ($roleNames) {
            return in_array($role->getName(), $roleNames);
        });

        $userManager = $this->getContainer()->get('claroline.manager.user_manager');
        $usersToDelete = $all ?
            $userManager->getUsersExcudingRoles($rolesSearch) :
            $userManager->getByRolesIncludingGroups($rolesSearch);

        foreach ($usersToDelete as $user) {
            $output->writeln("{$user->getId()}: {$user->getFirstName()} {$user->getLastName()} - {$user->getUsername()}");
        }

        $question = new ConfirmationQuestion('Do you really want to remove theses users ? ', false);
        $continue = $helper->ask($input, $output, $question);

        $consoleLogger = new ConsoleLogger($output, $verbosityLevelMap);
        $transferManager->setLogger($consoleLogger);

        if ($continue) {
            $om = $this->getContainer()->get('claroline.persistence.object_manager');
            $om->startFlushSuite();

            foreach ($usersToDelete as $user) {
                $userManager->deleteUser($user);
            }

            $om->endFlushSuite();
        }
    }
}
