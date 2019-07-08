<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Icap\NotificationBundle\Listener;

use Claroline\CoreBundle\Event\DisplayToolEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;

/**
 * Messaging tool.
 *
 * @DI\Service()
 */
class NotificationListener
{
    /** @var TwigEngine */
    private $templating;

    /**
     * MessagingListener constructor.
     *
     * @DI\InjectParams({
     *     "templating" = @DI\Inject("templating")
     * })
     *
     * @param TwigEngine $templating
     */
    public function __construct(
        TwigEngine $templating
    ) {
        $this->templating = $templating;
    }

    /**
     * Displays messaging on Desktop.
     *
     * @DI\Observe("open_tool_desktop_notification")
     *
     * @param DisplayToolEvent $event
     */
    public function onDisplayDesktop(DisplayToolEvent $event)
    {
        $content = $this->templating->render(
            'IcapNotificationBundle:notification:list.html.twig'
        );

        $event->setContent($content);
        $event->stopPropagation();
    }
}
