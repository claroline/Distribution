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
use Symfony\Component\Console\Input\InputOption;
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
           ])
           ->addOption(
               'confirm',
               'c',
               InputOption::VALUE_NONE,
               'When set to true, no confirmation required'
           );
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
        $toMatch = $input->getArgument('old_string');
        $toReplace = $input->getArgument('new_string');
        $classes = $input->getArgument('classes');
        $entities = [];
        $em = $this->getContainer()->get('doctrine.orm.entity_manager');

        foreach ($classes as $class) {
            $data = $em->getRepository($class)->createQueryBuilder('e')
                ->where("e.{$parsable[$class]} LIKE :str")
                ->setParameter('str', "%{$toMatch}%")
                ->getQuery()
                ->getResult();

            if ($data) {
                $entities = array_merge($entities, $data);
            }
        }

        if (!$entities) {
            $output->writeln('<error>No entities found...</error>');

            return;
        }

        $i = 0;
        $texts = array_map(function ($el) use ($parsable, &$i) {
                $func = 'get'.ucFirst($parsable[get_class($el)]);
                $text = "\n";
                $text .= "[[index={$i}]]\n";
                $text .= 'Class: '.get_class($el)."\n";
                $text .= 'Id: '.$el->getId()."\n";
                $text .= $el->$func();
                ++$i;

                return $text;
            },
            $entities
        );

        if ($input->getOption('confirm')) {
            $data = $texts;
        } else {
            $helper = $this->getHelper('question');
            $question = new ChoiceQuestion('Text founds: ', $texts);
            $question->setMultiselect(true);
            $data = $helper->ask($input, $output, $question);
        }

        $placeholder = '#\[\[index=([^\]]+)\]\]#';
        $i = 0;
        //get the index
        foreach ($data as $el) {
            preg_match_all($placeholder, $el, $matches, PREG_SET_ORDER);
            $entity = $entities[$matches[0][1]];
            $func = 'get'.ucFirst($parsable[get_class($entity)]);
            $text = $entity->$func();
            $text = str_replace($toMatch, $toReplace, $text);
            $func = 'set'.ucFirst($parsable[get_class($entity)]);
            $entity->$func($text);
            $em->persist($entity);
            ++$i;
        }

        $output->writeln("<comment>{$i} element changed... flushing</comment>");
        $em->flush();
        $output->writeln('<comment>Done</comment>');
    }

    private function getParsableEntities()
    {
        return [
            'Claroline\CoreBundle\Entity\Resource\Text' => 'text',
            'Claroline\AgendaBundle\Entity\Event' => 'description',
            'Claroline\CoreBundle\Entity\Resource\Activity' => 'description',
            'Innova\PathBundle\Entity\Path\Path' => 'description',
            'Claroline\CoreBundle\Entity\Widget\SimpleTextConfig' => 'content',
        ];
    }
}
