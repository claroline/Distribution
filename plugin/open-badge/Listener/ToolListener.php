<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\OpenBadgeBundle\Listener;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\CoreBundle\Event\DisplayToolEvent;
use Claroline\CoreBundle\Event\Layout\InjectJavascriptEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;

/**
 * Badge tool.
 *
 * @DI\Service()
 */
class ToolListener
{
    /**
     * BadgeListener constructor.
     *
     * @DI\InjectParams({
     *     "serializer"      = @DI\Inject("claroline.api.serializer"),
     *     "templating"      = @DI\Inject("templating"),
     * })
     */
    public function __construct(
        SerializerProvider $serializer,
        EngineInterface $templating
    ) {
        $this->templating = $templating;
        $this->serializer = $serializer;
    }

    /**
     * Displays home on Desktop.
     *
     * @DI\Observe("open_tool_desktop_open-badge")
     *
     * @param DisplayToolEvent $event
     */
    public function onDisplayDesktop(DisplayToolEvent $event)
    {
        $event->setData([]);

        $event->stopPropagation();
    }

    /**
     * @DI\Observe("open_tool_workspace_open-badge")
     *
     * @param DisplayToolEvent $event
     */
    public function onDisplayWorkspace(DisplayToolEvent $event)
    {
        $event->setData([]);

        $event->stopPropagation();
    }

    /**
     * @DI\Observe("layout.inject.javascript")
     *
     * @param InjectJavascriptEvent $event
     *
     * @return string
     */
    public function onInjectJs(InjectJavascriptEvent $event)
    {
        $event->addContent(
            $this->templating->render('ClarolineOpenBadgeBundle::javascripts.html.twig')
        );
    }
}
