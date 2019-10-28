<?php

namespace Claroline\AnalyticsBundle\Listener\Administration;

use Claroline\CoreBundle\Event\Tool\OpenToolEvent;

class DashboardListener
{
    /**
     * Displays dashboard administration tool.
     *
     * @param OpenToolEvent $event
     */
    public function onDisplayTool(OpenToolEvent $event)
    {
        $event->setData([]);
        $event->stopPropagation();
    }
}
