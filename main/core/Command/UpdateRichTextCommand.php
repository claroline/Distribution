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
               new InputArgument('classes', InputArgument::REQUIRED, 'classes'),
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
        $question = new ChoiceQuestion('Entity to parse: ', $entities);
        $question->setMultiselect(true);

        while (null === $entity = $input->getArgument('classes')) {
            $entity = $helper->ask($input, $output, $question);
            $input->setArgument('classes', $entity);
        }
    }

    protected function askArgument(OutputInterface $output, $argumentName)
    {
        $argument = $this->getHelper('dialog')->askAndValidate(
            $output,
            "Enter the {$argumentName}: ",
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
        $parsable = $this->getParsableEntities();
        $consoleLogger = ConsoleLogger::get($output);
        $toMatch = $input->getArgument('old_string');
        $toReplace = $input->getArgument('new_string');
        $classes = $input->getArgument('classes');
        $entities = [];

        foreach ($classes as $class) {
            $em = $this->getContainer()->get('doctrine.orm.entity_manager');
            $data = $em->getRepository($class)->createQueryBuilder('e')
                ->where("e.{$parsable[$class]} LIKE :str")
                ->setParameter('str', "%{$toMatch}%")
                ->getQuery()
                ->getResult();

            $entities = array_merge($entities, $data);
        }

        $texts = array_map(function ($el) use ($parsable) {
                $func = 'get'.ucFirst($parsable[get_class($el)]);

                return $el->$func();
            },
            $entities
        );

        $helper = $this->getHelper('question');
        $question = new ChoiceQuestion('Text founds: ', $texts);

        $entities = $helper->ask($input, $output, $question);
    }

    private function getParsableEntities()
    {
        return [
            'Claroline\CoreBundle\Entity\Resource\Text' => 'text',
            'Claroline\AgendaBundle\Entity\Event' => 'description',
            'Claroline\CoreBundle\Entity\Resource\Activity' => 'description',
            'Innova\PathBundle\Entity\Path\Path' => 'description',
        ];
    }
}
