<?php

namespace Claroline\CoreBundle\API\Crud\Home;

use Claroline\AppBundle\Event\Crud\DeleteEvent;
use Claroline\AppBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.crud.widget_instance")
 * @DI\Tag("claroline.crud")
 */
class WidgetInstanceCrud
{
    /**
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
     * @DI\Observe("crud_pre_delete_object_claroline_corebundle_entity_widget_widget_instance")
     *
     * @param DeleteEvent $event
     */
    public function preDelete(DeleteEvent $event)
    {
        $widgetInstance = $event->getObject();

        foreach ($widgetInstance->getWidgetContainerConfigs() as $config) {
            $this->om->remove($config);
        }
    }
}
