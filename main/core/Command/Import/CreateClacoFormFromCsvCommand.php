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
use Claroline\CoreBundle\Library\Logger\ConsoleLogger;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CreateClacoFormFromCsvCommand extends ContainerAwareCommand
{
    use BaseCommandTrait;

    private $params = ['csv_clacoform_path' => 'Absolute path to the csv file: '];

    protected function configure()
    {
        $this->setName('claroline:csv:clacoform')
            ->setDescription('Create clacoforms from a csv file');

        $this->setDefinition(
            [new InputArgument('csv_clacoform_path', InputArgument::REQUIRED, 'The absolute path to the csv file.')]
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $consoleLogger = ConsoleLogger::get($output);
        $om = $this->getContainer()->get('claroline.persistence.object_manager');

        $file = $input->getArgument('csv_clacoform_path');
        $lines = str_getcsv(file_get_contents($file), PHP_EOL);

        var_dump($lines);
    }
}
