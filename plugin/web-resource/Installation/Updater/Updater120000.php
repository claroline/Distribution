<?php

namespace Claroline\WebResourceBundle\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\WebResourceBundle\Manager\WebResourceManager;
use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Updater120000 extends Updater
{
    /** @var ContainerInterface */
    private $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public function postUpdate()
    {
        $this->updateWebResourceFilePath();
    }

    /**
     * Update file path.
     */
    private function updateWebResourceFilePath()
    {
        $this->log('Update resourceWeb file path ...');

        /** @var ObjectManager $om */
        $om = $this->container->get('claroline.persistence.object_manager');
        $resourceType = $om->getRepository('Claroline\CoreBundle\Entity\Resource\ResourceType')->findOneBy(['name' => 'claroline_web_resource']);
        $resourceNodes = $om->getRepository('Claroline\CoreBundle\Entity\Resource\ResourceNode')->findBy(['resourceType' => $resourceType]);
        $resourceManager = $this->container->get('claroline.manager.resource_manager');

        foreach ($resourceNodes as $resourceNode) {
            $file = $resourceManager->getResourceFromNode($resourceNode);
            var_dump($file);
            // recupérer le hash, vérifier ancien endroit si existe déplacer dans nouveau doossier
        }

    }
}
