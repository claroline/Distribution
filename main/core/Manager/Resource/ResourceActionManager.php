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

    public function getGroup(MenuAction $action)
    {
        return 'main';
    }
}
