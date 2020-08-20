<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Listener\Log;

use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\AppBundle\Event\Crud\DeleteEvent;
use Claroline\AppBundle\Event\StrictDispatcher;

class WorkspaceListener
{
    public function __construct(StrictDispatcher $dispatcher)
    {
        $this->dispatcher = $dispatcher;
    }

    public function onWorkspacePostCreate(CreateEvent $event)
    {
        $workspace = $event->getObject();
        $this->dispatcher->dispatch('log', 'Log\LogWorkspaceCreate', [$workspace]);
    }

    public function onWorkspacePreDelete(DeleteEvent $event)
    {
        $workspace = $event->getObject();

        $this->dispatcher->dispatch('log', 'Log\LogWorkspaceDelete', [$workspace]);
    }
}
