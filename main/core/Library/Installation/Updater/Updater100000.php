<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 3/1/17
 */

namespace Claroline\CoreBundle\Library\Installation\Updater;

use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Updater100000 extends Updater
{
    private $container;
    protected $logger;
    private $om;

    public function __construct(ContainerInterface $container, $logger)
    {
        $this->container = $container;
        $this->logger = $logger;
        $this->om = $container->get('claroline.persistence.object_manager');
    }

    public function postUpdate()
    {
        $this->setResourceNodeProperties();
        $this->rebuildMaskAndMenus();
    }

    public function setResourceNodeProperties()
    {
        $entities = $this->om->getRepository('ClarolineCoreBundle:Resource\ResourceNode')->findAll();
        $totalObjects = count($entities);
        $i = 0;
        $this->log("Adding properties for {$totalObjects} resource nodes...");

        foreach ($entities as $entity) {
            if ($entity->isFullscreen() === null) {
                $entity->setFullscreen(false);
            }
            if (!$entity->isClosable() === null) {
                $entity->setClosable(false);
            }
            if (!$entity->getCloseTarget() === null) {
                $entity->setCloseTarget(0);
            }

            ++$i;

            $this->om->persist($entity);

            if ($i % 300 === 0) {
                $this->log("Flushing [{$i}/{$totalObjects}]");
                $this->om->flush();
            }
        }

        $this->om->flush();
        $this->log('Clearing object manager...');
        $this->om->clear();
        $this->log('done !');
    }

    public function rebuildMaskAndMenus()
    {
        $this->log('Removing old menus and masks...');
        $classes = ['ClarolineCoreBundle:Resource\MaskDecoder', 'ClarolineCoreBundle:Resource\MenuAction'];

        foreach ($classes as $class) {
            $entities = $this->om->getRepository($class)->findAll();

            foreach ($entities as $entity) {
                $this->om->remove($entity);
            }
        }

        $this->om->flush();

        $this->log('Building new menus and masks');
        $this->container->get('claroline.plugin.installer')->setLogger($this->logger);
        $this->container->get('claroline.plugin.installer')->updateAllConfiguration();
        $this->log('On older plateforms, resource permissions might have changed');
    }
}
