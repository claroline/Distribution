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
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class LogsFetcherCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        parent::configure();

        $this->setName('claroline:logs:fetch')
            ->setDescription('Send a friend request to a Claroline platform');
        $this->setDefinition(
            [
                new InputArgument('group', InputArgument::REQUIRED, 'The group to fetch'),
                //1472688000 1st sept 2016
                new InputArgument('from', InputArgument::REQUIRED, 'timestamp from'),
            ]
        );
    }

    protected function interact(InputInterface $input, OutputInterface $output)
    {
        $params = [
            'group' => 'group',
            'from' => 'from',
        ];

        foreach ($params as $argument => $argumentName) {
            if (!$input->getArgument($argument)) {
                $input->setArgument(
                    $argument, $this->askArgument($output, $argumentName)
                );
            }
        }
    }

    protected function askArgument(OutputInterface $output, $argumentName)
    {
        $argument = $this->getHelper('dialog')->askAndValidate(
            $output,
            "Enter the platform {$argumentName}: ",
            function ($argument) {
                if (empty($argument)) {
                    throw new \Exception('This argument is required');
                }

                return $argument;
            }
        );

        return $argument;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $name = $input->getArgument('group');
        $om = $this->getContainer()->get('claroline.persistence.object_manager');
        $logRepo = $om->getRepository('Claroline\CoreBundle\Entity\Log\Log');
        $xlsExporter = $this->getContainer()->get('claroline.exporter.xls');

        $query = $logRepo->findFilteredLogsQuery(
            'all',
            [$input->getArgument('from'), time()],
            null,
            [],
            null,
            -1,
            null,
            null,
            $name
        );

        $results = $query->getResult();

        $titles = [
          'id', 'action', 'date', /*'details',*/ 'user',
        ];

        $lines = [];

        foreach ($results as $result) {
            $lines[] = [
            $result->getId(),
            $result->getAction(),
            $result->getDateLog()->format('d-m-Y H:i:s'),
            //serialize($result->getDetails()),
            $result->getDoer()->getUsername(),
          ];
        }

        $path = $xlsExporter->export($titles, $lines);
        $output->writeln('Check your file at '.$path);
    }
}
