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

use Claroline\AppBundle\Command\BaseCommandTrait;
use Claroline\CoreBundle\Entity\Log\Log;
use Claroline\CoreBundle\Library\Logger\ConsoleLogger;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class LogsArchiverCommand extends ContainerAwareCommand
{
    use BaseCommandTrait;

    private $params = [
        'from' => 'from',
        'to' => 'to',
    ];

    protected function configure()
    {
        parent::configure();

        $this->setName('claroline:logs:archive')
            ->setDescription('Archive logs');
        $this->setDefinition(
            [
                new InputArgument('from', InputArgument::REQUIRED, 'from date'),
                new InputArgument('to', InputArgument::REQUIRED, 'to date'),
            ]
        );
        $this->addOption(
            'delete',
            'd',
            InputOption::VALUE_NONE,
            'When set to true, delete the archived logs (format: m-d-Y)'
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $from = \DateTime::createFromFormat('m-d-Y', $input->getArgument('from'));
        $to = \DateTime::createFromFormat('m-d-Y', $input->getArgument('to'));

        $consoleLogger = ConsoleLogger::get($output);

        $databaseManager = $this->getContainer()->get('claroline.manager.database_manager');
        $databaseManager->setLogger($consoleLogger);

        $logTables = [
            'claro_log',
        ];

        $delete = $input->getOption('delete') ? true : false;

        foreach ($logTables as $table) {
            $databaseManager->backupRows(
                Log::class,
                ['dateLog' => $from->format('Y-m-d h:i:s'), 'dateTo' => $to->format('Y-m-d h:i:s')],
                $table,
                uniqid(),
                $delete
            );
        }
    }
}
