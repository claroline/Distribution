<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Command\Workspace;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Command\AdminCliCommand;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\Tool\OrderedTool;
use Claroline\CoreBundle\Entity\Tool\Tool;
use Claroline\CoreBundle\Entity\Tool\ToolMaskDecoder;
use Claroline\CoreBundle\Entity\Tool\ToolRights;
use Claroline\CoreBundle\Entity\Workspace\Evaluation;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\Workspace\EvaluationManager;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class EvaluationCommand extends ContainerAwareCommand implements AdminCliCommand
{
    protected function configure()
    {
        parent::configure();

        $this->setName('claroline:workspace:evaluation')
            ->setDescription('computes all workspace evaluations');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        /** @var ObjectManager $om */
        $om = $container->get('doctrine.orm.entity_manager');
        /** @var EvaluationManager $manager */
        $manager = $container->get('claroline.manager.workspace.evaluation');

        /** @var Evaluation[] $workspaces */
        $evaluations = $om->getRepository(Evaluation::class)->findAll();

        $output->writeln(sprintf('Computing workspace evaluations...'));

        foreach ($evaluations as $evaluation) {
            $manager->computeEvaluation($evaluation->getWorkspace(), $evaluation->getUser());
        }

        $output->writeln('Done');
    }
}
