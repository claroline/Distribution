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
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Manager\RoleManager;
use Claroline\TagBundle\Entity\TaggedObject;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Removes users from a workspace.
 */
class EmptyByTagCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('claroline:workspace:empty')
            ->setDescription('Empty workspaces')
            ->setDefinition([
                new InputArgument('workspace_tag', InputArgument::REQUIRED, 'The workspace code'),
                new InputArgument('role_key', InputArgument::REQUIRED, 'The role translation key'),
            ])
            ->addOption('user', 'u', InputOption::VALUE_NONE, 'When set to true, remove users from the workspace')
            ->addOption('group', 'g', InputOption::VALUE_NONE, 'When set to true, remove groups from the workspace');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $om = $this->getContainer()->get(ObjectManager::class);
        $roleManager = $this->getContainer()->get(RoleManager::class);

        $removeUsers = $input->getOption('user');
        $removeGroups = $input->getOption('group');

        $tag = $input->getArgument('workspace_tag');
        // the role to remove
        $roleKey = $input->getArgument('role_key');

        // find by tag (this make an hard dependency to TagBundle)
        $workspaces = $om->getRepository(TaggedObject::class)->findTaggedWorkspaces($tag);

        $output->writeln(sprintf('Found %d workspaces with tag %s to empty', count($workspaces), $tag));

        foreach ($workspaces as $workspace) {
            $output->writeln(sprintf('Processing Workspace %s (%s)', $workspace->getName(), $workspace->getUuid()));

            $role = $om->getRepository(Role::class)->findOneBy([
                'workspace' => $workspace,
                'translationKey' => $roleKey,
            ]);

            if (empty($role)) {
                $output->writeln(sprintf('Role %s cannot be found. Skip workspace.', $roleKey));
            } else {
                $om->startFlushSuite();

                if ($removeUsers) {
                    $count = $om->getRepository('ClarolineCoreBundle:User')->countUsersByRole($role);
                    $output->writeln("Removing {$count} users from role {$role->getTranslationKey()}");
                    $roleManager->emptyRole($role, RoleManager::EMPTY_USERS);
                }

                if ($removeGroups) {
                    $count = $om->getRepository('ClarolineCoreBundle:Group')->countGroupsByRole($role);
                    $output->writeln("Removing {$count} groups from role {$role->getTranslationKey()}");
                    $roleManager->emptyRole($role, RoleManager::EMPTY_GROUPS);
                }

                $om->endFlushSuite();
            }
        }
    }
}
