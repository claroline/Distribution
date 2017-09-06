<?php
/**
 * This file is part of the Claroline Connect package
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * Author: Panagiotis TSAVDARIS
 *
 * Date: 10/24/16
 */

namespace Inwicast\ClarolinePluginBundle\Listener;

use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\Event\OpenAdministrationToolEvent;
use Claroline\CoreBundle\Listener\AdministrationToolListener as BaseAdministrationToolListener;

/**
 * Class AdministrationToolListener
 * @package Inwicast\ClarolinePluginBundle\Listener
 *
 * @DI\Service()
 */
class AdministrationToolListener extends BaseAdministrationToolListener
{
    /**
     * @DI\Observe("administration_tool_inwicast_configuration")
     *
     * @param OpenAdministrationToolEvent $event
     */
    public function onOpenInwicastConfiguration(OpenAdministrationToolEvent $event)
    {
        $this->redirect(['_controller' => 'InwicastClarolinePluginBundle:Mediacenter:configure'], $event);
    }
}