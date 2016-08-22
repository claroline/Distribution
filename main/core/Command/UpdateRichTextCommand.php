<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Command;

use Claroline\CoreBundle\Library\Logger\ConsoleLogger;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\ChoiceQuestion;
use Symfony\Component\Console\Question\Question;

class UpdateRichTextCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('claroline:rich_texts:update')
            ->setDescription('Update a text string ')
            ->setDefinition([
               new InputArgument('old_string', InputArgument::REQUIRED, 'old str'),
               new InputArgument('new_string', InputArgument::REQUIRED, 'new str'),
               new InputArgument('entity', InputArgument::REQUIRED, 'entity'),
           ]);
    }

    protected function interact(InputInterface $input, OutputInterface $output)
    {
        //@todo ask authentication source
        $params = [
            'old_string' => 'The string to match',
            'new_string' => 'The string to replace',
        ];

        foreach ($params as $argument => $argumentName) {
            if (!$input->getArgument($argument)) {
                $input->setArgument(
                    $argument, $this->askArgument($output, $argumentName)
                );
            }
        }

        $helper = $this->getHelper('question');
        $entities = array_keys($this->getParsableEntities());
        $toolQuestion = new ChoiceQuestion('Entity to parse: ', $entities);

        while (null === $entity = $input->getArgument('entity')) {
            $entity = $helper->ask($input, $output, $toolQuestion);
            $input->setArgument('entity', $entity);
        }
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $consoleLogger = ConsoleLogger::get($output);
    }

    private function getParsableEntities()
    {
        return [
            'Claroline\CoreBundle\Entity\Resource\Text' => ['text'],
            'Claroline\AgendaBundle\Entity\Event' => ['description'],
            'Claroline\CoreBundle\Entity\Resource\Activity' => ['description'],
            'Innova\PathBundle\Entity\Path\Path' => ['description'],
        ];
    }
}
