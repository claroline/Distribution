<?php

namespace Claroline\CoreBundle\API\Crud;

use Claroline\AppBundle\Event\Crud\DeleteEvent;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.crud.widget_instance")
 * @DI\Tag("claroline.crud")
 */
class WidgetInstanceCrud
{
    /**
     * @DI\Observe("crud_pre_delete_object_claroline_corebundle_entity_widget_widget_instance")
     *
     * @param DeleteEvent $event
     */
    public function preDelete(DeleteEvent $event)
    {
    }
}
