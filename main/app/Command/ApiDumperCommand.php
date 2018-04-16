<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ApiDumperCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('claroline:api:dump')->setDescription('Dump the api doc as json');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $data = [];
        $classes = $this->getContainer()->get('claroline.api.routing.finder')->getHandledClasses();

        foreach ($classes as $class) {
            $data[$class] = $this->getContainer()->get('claroline.api.routing.documentator')->documentClass($class);
        }

        $output->writeln(json_encode($data));
    }
}
