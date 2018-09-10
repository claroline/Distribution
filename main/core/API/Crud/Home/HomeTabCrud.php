<?php

namespace Claroline\CoreBundle\API\Crud;

use Claroline\AppBundle\Event\Crud\DeleteEvent;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.crud.home_tab")
 * @DI\Tag("claroline.crud")
 */
class HomeTabCrud
{
    /**
     * @DI\Observe("crud_pre_delete_object_claroline_corebundle_entity_tab_home_tab")
     *
     * @param DeleteEvent $event
     */
    public function preDelete(DeleteEvent $event)
    {
    }
}
