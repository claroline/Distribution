<?php

namespace UJM\ExoBundle\Listener\Log;

use Claroline\CoreBundle\Event\Log\LogCreateDelegateViewEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerAware;

/**
 * @DI\Service("ujm.exo.exercise_log_listener")
 */
class DisplayLogListener extends ContainerAware
{
    /**
     * @DI\Observe("create_log_details_resource-ujm_exercise-exercise_evaluated")
     *
     * @param LogCreateDelegateViewEvent $event
     */
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
