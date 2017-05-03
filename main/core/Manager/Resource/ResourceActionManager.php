<?php

namespace Claroline\CoreBundle\Manager\Resource;

use Claroline\CoreBundle\Entity\Resource\MenuAction;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.resource_action_manager")
 */
class ResourceActionManager
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * ResourceNodeManager constructor.
     *
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ObjectManager $om
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
    }

    /**
     * It would be great to unify the core & plugin install to avoid to duplicate code like this as we can already define all of this in the plugin.yml.
     */
    public function buildDefaultActions()
    {
        $activityType = $this->om->getRepository('ClarolineCoreBundle:Resource\ResourceType')->findOneByName('activity');
        $activityMenu = $this->om->getRepository('ClarolineCoreBundle:Resource\MenuAction')
          ->findOneBy(['name' => 'compose', 'resourceType' => $activityType]);

        if (!$activityMenu) {
            $activityMenu = new MenuAction();
        }

        $activityMenu->setName('compose');
        $activityMenu->setAsync(false);
        $activityMenu->setIsCustom(true);
        $activityMenu->setValue(pow(2, 10));
        $activityMenu->setResourceType($activityType);
        $activityMenu->setIsForm(false);
        $activityMenu->setGroup('actvity');

        $this->om->persist($activityMenu);

        $fileType = $this->om->getRepository('ClarolineCoreBundle:Resource\ResourceType')->findOneByName('activity');

        $fileMenu = $this->om->getRepository('ClarolineCoreBundle:Resource\MenuAction')
          ->findOneBy(['name' => 'compose', 'resourceType' => $fileType]);

        if (!$fileMenu) {
            $fileMenu = new MenuAction();
        }

        $fileMenu->setName('update_file');
        $fileMenu->setAsync(true);
        $fileMenu->setIsCustom(true);
        $fileMenu->setIsForm(false);
        $fileMenu->setResourceType($fileType);
        //16 is default for edit
        $fileMenu->setValue(16);
        $fileMenu->setGroup('core');

        $this->om->persist($fileMenu);

        $this->om->flush();
    }
}
