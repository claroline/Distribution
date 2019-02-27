<?php

namespace Claroline\ForumBundle\Crud;

use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\CoreBundle\Manager\ResourceManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.crud.forum")
 * @DI\Tag("claroline.crud")
 */
class ForumCrud
{
    /**
     * ForumSerializer constructor.
     *
     * @DI\InjectParams({
     *     "manager" = @DI\Inject("claroline.manager.resource_manager")
     * })
     */
    public function __construct(ResourceManager $manager)
    {
        $this->manager = $manager;
    }

    /**
     * @DI\Observe("crud_post_create_object_claroline_forumbundle_entity_forum")
     *
     * @param CreateEvent $event
     */
    public function postCreate(CreateEvent $event)
    {
        $forum = $event->getObject();
        $node = $forum->getResourceNode();
        $rights = $node->getRights();

        foreach ($rights as $right) {
            var_dump($right->getRole()->getName());
        }
    }
}
