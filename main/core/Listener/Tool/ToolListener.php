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

use Claroline\CoreBundle\Event\DisplayToolEvent;
use Claroline\CoreBundle\Manager\ToolManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;

/**
 * @DI\Service()
 */
class ToolListener
{
    private $templating;
    private $toolManager;

    /**
     * ToolListener constructor.
     *
     * @DI\InjectParams({
     *     "templating"  = @DI\Inject("templating"),
     *     "toolManager" = @DI\Inject("claroline.manager.tool_manager")
     * })
     *
     * @param TwigEngine  $templating
     * @param ToolManager $toolManager
     */
    public function __construct(TwigEngine $templating, ToolManager $toolManager)
    {
        $this->templating = $templating;
        $this->toolManager = $toolManager;
    }

    /**
     * @DI\Observe("open_tool_desktop_parameters")
     *
     * @param DisplayToolEvent $event
     */
    public function onDisplayDesktopParameters(DisplayToolEvent $event)
    {
        $desktopTools = $this->toolManager->getToolByCriterias([
            'isConfigurableInDesktop' => true,
            'isDisplayableInDesktop' => true,
        ]);

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
                ['tools' => $tools]
            )
        );
    }
}
