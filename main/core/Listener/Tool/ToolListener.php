<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Listener\Tool;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\CoreBundle\Entity\Tool\Tool;
use Claroline\CoreBundle\Event\DisplayToolEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;

/**
 * @DI\Service()
 */
class ToolListener
{
    /** @var FinderProvider */
    private $finder;

    /** @var SerializerProvider */
    private $serializer;

    /** @var TwigEngine */
    private $templating;

    /**
     * ToolListener constructor.
     *
     * @DI\InjectParams({
     *     "finder"      = @DI\Inject("claroline.api.finder"),
     *     "serializer"  = @DI\Inject("claroline.api.serializer"),
     *     "templating"  = @DI\Inject("templating")
     * })
     *
     * @param FinderProvider     $finder
     * @param SerializerProvider $serializer
     * @param TwigEngine         $templating
     */
    public function __construct(
        FinderProvider $finder,
        SerializerProvider $serializer,
        TwigEngine $templating
    ) {
        $this->finder = $finder;
        $this->serializer = $serializer;
        $this->templating = $templating;
    }

    /**
     * @DI\Observe("open_tool_desktop_parameters")
     *
     * @param DisplayToolEvent $event
     */
    public function onDisplayDesktopParameters(DisplayToolEvent $event)
    {
        $desktopTools = $this->finder->get(Tool::class)->find(
            ['isDisplayableInDesktop' => true],
            ['property' => 'name', 'direction' => 1]
        );
        $tools = [];

        foreach ($desktopTools as $desktopTool) {
            $toolName = $desktopTool->getName();

            if ('home' !== $toolName && 'parameters' !== $toolName) {
                $tools[] = $desktopTool;
            }
        }
        $event->setContent(
            $this->templating->render(
                'ClarolineCoreBundle:tool\desktop\parameters:parameters.html.twig',
                [
                    'tools' => array_map(function (Tool $tool) {
                        return $this->serializer->serialize($tool);
                    }, $tools),
                ]
            )
        );
    }
}
