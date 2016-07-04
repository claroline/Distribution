<?php

namespace UJM\ExoBundle\Listener\Log;

use Claroline\CoreBundle\Event\Log\LogCreateDelegateViewEvent;
use Symfony\Component\DependencyInjection\ContainerAware;

class DisplayLogListener extends ContainerAware
{
    public function onCreateLogDetails(LogCreateDelegateViewEvent $event)
    {
        $content = $this->container->get('templating')->render(
            'UJMExoBundle:Log:log_details.html.twig',
            [
                'log' => $event->getLog(),
            ]
        );

        $event->setResponseContent($content);
        $event->stopPropagation();
    }
}
