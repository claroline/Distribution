<?php

namespace Claroline\CursusBundle\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Updater130000 extends Updater
{
    protected $logger;
    private $container;
    /** @var ObjectManager */
    private $om;

    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->logger = $logger;
        $this->container = $container;
        $this->om = $container->get(ObjectManager::class);
    }

    public function preUpdate()
    {
        $this->renameTool('cursus', 'trainings');
        $this->renameTool('claroline_session_events_tool', 'training_events');
    }

    private function renameTool($oldName, $newName)
    {
        $this->log(sprintf('Renaming `%s` tool into `%s`...', $oldName, $newName));

        $tool = $this->om->getRepository('ClarolineCoreBundle:Tool\Tool')->findOneBy(['name' => $oldName]);
        if (!empty($tool)) {
            $tool->setName($newName);
            $this->om->persist($tool);
            $this->om->flush();
        }
    }
}
