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

use Psr\Log\LogLevel;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Logger\ConsoleLogger;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\ConfirmationQuestion;
use Symfony\Component\Console\Question\Question;

/**
 * Removes users from the platform.
 */
class EmptyGroupsCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('claroline:groups:empty')
            ->setDescription('Empty groups');

        $this->addOption(
            'all',
            'a',
            InputOption::VALUE_NONE,
            'When set to true, removes every users'
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();

        $verbosityLevelMap = [
            LogLevel::NOTICE => OutputInterface::VERBOSITY_NORMAL,
            LogLevel::INFO => OutputInterface::VERBOSITY_NORMAL,
            LogLevel::DEBUG => OutputInterface::VERBOSITY_NORMAL,
        ];
        $consoleLogger = new ConsoleLogger($output, $verbosityLevelMap);
        $helper = $this->getHelper('question');
        //get excluding roles

        $all = $input->getOption('all');
        $question = $all ? 'Excude on name (continue if no filter): ' : 'Filter on name (continue if no filter): ';
        $question = new Question($question, null);
        $name = $helper->ask($input, $output, $question);
        $groups = $container->get('claroline.manager.group_manager')->searchPartialList(['name' => [$name]], null, null, false, $all);
        $output->writeln('These groups are going to be emptied: ');

        foreach ($groups as $group) {
            $output->writeln($group->getName());
        }

        $question = new ConfirmationQuestion('Do you really want to empty these groups ? y/n [y] ', true);
        $continue = $helper->ask($input, $output, $question);
        $om = $container->get('claroline.persistence.object_manager');

        if ($continue) {
            $om->startFlushSuite();

            foreach ($groups as $group) {
                $output->writeln("Emptying {$group->getName()}...");
                $container->get('claroline.manager.group_manager')->emptyGroup($group);
            }

            $output->writeln('Persisting changes...');
            $om->endFlushSuite();
        }
    }
}
