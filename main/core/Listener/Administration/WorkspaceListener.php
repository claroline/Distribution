<?php

namespace Claroline\CoreBundle\Listener\Administration;

use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use Claroline\CoreBundle\Entity\Tool\Tool;
use Claroline\CoreBundle\Event\OpenAdministrationToolEvent;
use Claroline\CoreBundle\Manager\ToolManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Component\HttpFoundation\Response;

/**
 * Workspace administration tool.
 *
 * @DI\Service()
 */
class WorkspaceListener
{
    /** @var TwigEngine */
    private $templating;

    /** @var ParametersSerializer */
    private $parametersSerializer;

    /** @var ToolManager */
    private $toolManager;

    /**
     * WorkspaceListener constructor.
     *
     * @DI\InjectParams({
     *     "parametersSerializer" = @DI\Inject("claroline.serializer.parameters"),
     *     "templating"           = @DI\Inject("templating"),
     *     "toolManager"          = @DI\Inject("claroline.manager.tool_manager")
     * })
     *
     * @param TwigEngine           $templating
     * @param ParametersSerializer $parametersSerializer,
     * @param ToolManager          $toolManager
     */
    public function __construct(
        TwigEngine $templating,
        ParametersSerializer $parametersSerializer,
        ToolManager $toolManager
    ) {
        $this->templating = $templating;
        $this->parametersSerializer = $parametersSerializer;
        $this->toolManager = $toolManager;
    }

    /**
     * Displays workspace administration tool.
     *
     * @DI\Observe("administration_tool_workspace_management")
     *
     * @param OpenAdministrationToolEvent $event
     */
    public function onDisplayTool(OpenAdministrationToolEvent $event)
    {
        $workspaceTools = $this->toolManager->getAvailableWorkspaceTools();

        $content = $this->templating->render(
            'ClarolineCoreBundle:administration:workspaces.html.twig',
            [
                'parameters' => $this->parametersSerializer->serialize(),
                'tools' => array_map(function (Tool $tool) {
                    return ['name' => $tool->getName()];
                }, $workspaceTools),
            ]
        );

        $event->setResponse(new Response($content));
        $event->stopPropagation();
    }
}
