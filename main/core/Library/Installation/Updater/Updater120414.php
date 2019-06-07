<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Library\Installation\Updater;

use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Updater120414 extends Updater
{
    protected $logger;
    private $container;
    private $om;

    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->logger = $logger;
        $this->container = $container;
        $this->om = $container->get('claroline.persistence.object_manager');
    }

    public function preUpdate()
    {
        //$this->renameTool('resource_manager', 'resources');
    }

    public function postUpdate()
    {
        $this->removeTool('my_contacts');
        $this->removeTool('workspace_management');
    }

    private function removeTool($toolName, $admin = false)
    {
        $this->log(sprintf('Removing `%s` tool...', $toolName));

        $tool = $this->om->getRepository($admin ? 'ClarolineCoreBundle:Tool\AdminTool' : 'ClarolineCoreBundle:Tool\Tool')->findOneBy(['name' => $toolName]);
        if (!empty($tool)) {
            $this->om->remove($tool);
            $this->om->flush();
        }
    }

    private function renameTool($oldName, $newName, $admin = false)
    {
        $this->log(sprintf('Renaming `%s` tool into %s...', $oldName, $newName));

        $tool = $this->om->getRepository($admin ? 'ClarolineCoreBundle:Tool\AdminTool' : 'ClarolineCoreBundle:Tool\Tool')->findOneBy(['name' => $oldName]);
        if (!empty($tool)) {
            $tool->setName($newName);

            $this->om->persist($tool);
            $this->om->flush();
        }
    }
}
