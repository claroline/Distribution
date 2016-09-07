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

use Claroline\CoreBundle\Command\BaseCommandTrait;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Creates an user, optionaly with a specific role (default to simple user).
 */
class RemoveWorkspaceCommand extends ContainerAwareCommand
{
    use BaseCommandTrait;

    protected function configure()
    {
        $this->setName('claroline:remove:users')
            ->setDescription('Remove users');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $infos = 'Class: '.get_class($entity)."\n";
        $infos .= 'Id: '.$entity->getId()."\n";
        $infos .= $text;
        $output->writeln('<comment>'.$infos.'</comment>');

        $helper = $this->getHelper('question');
        $question = new ChoiceQuestion('Edit ?', ['yes', 'no']);
        $answer = $helper->ask($input, $output, $question);
        if ($answer === 'yes') {
            $continue = true;
        }
    }
}
