<?php

namespace Claroline\AnnouncementBundle\Crud;

use Claroline\AnnouncementBundle\Manager\AnnouncementManager;
use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\AppBundle\Event\Crud\DeleteEvent;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\AppBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.crud.announcement_aggregate")
 * @DI\Tag("claroline.crud")
 */
class AnnouncementAggregateCrud
{
    /**
     * AnnouncementManager constructor.
     *
     * @DI\InjectParams({
     *     "om"              = @DI\Inject("claroline.persistence.object_manager"),
     *     "eventDispatcher" = @DI\Inject("claroline.event.event_dispatcher"),
     *     "crud"            = @DI\Inject("claroline.api.crud")
     * })
     *
     * @param StrictDispatcher $eventDispatcher
     */
    public function __construct(
        ObjectManager $om,
        StrictDispatcher $eventDispatcher,
        Crud $crud
    ) {
        $this->eventDispatcher = $eventDispatcher;
        $this->crud = $crud;
        $this->om = $om;
    }

    /**
     * @DI\Observe("crud_pre_delete_object_claroline_announcementbundle_entity_announcementaggregate")
     *
     * @param CreateEvent $event
     */
    public function preDelete(DeleteEvent $event)
    {
        $aggregate = $event->getObject();

        foreach ($aggregate->getAnnouncements() as $announcement) {
            $this->crud->delete($announcement);
        }
    }
}
