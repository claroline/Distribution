<?php

namespace HeVinci\CompetencyBundle\Command;

use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class LoadFixtureCommand extends AbstractFixtureCommand
{
    protected function configure()
    {
        $this->setName('hevinci:fixture:load')
            ->setDescription('Loads a data fixture.')
            ->addArgument('fixture', InputArgument::REQUIRED, 'Fixture class file', null);
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $fixture = $this->getFixture($input->getArgument('fixture'), $output);
        $fixture->load();

        return 0;
    }
}
