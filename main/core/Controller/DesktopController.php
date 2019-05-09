<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller;

use Claroline\CoreBundle\Entity\Tool\Tool;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\DisplayToolEvent;
use Claroline\CoreBundle\Event\Log\LogDesktopToolReadEvent;
use Claroline\CoreBundle\Manager\ToolManager;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * User desktop.
 *
 * @EXT\Route("/desktop", options={"expose"=true})
 *
 * @DI\Tag("security.secure_service")
 * @SEC\PreAuthorize("hasRole('ROLE_USER')")
 */
class DesktopController
{
    /** @var EventDispatcherInterface */
    private $eventDispatcher;

    /** @var ToolManager */
    private $toolManager;

    /**
     * DesktopController constructor.
     *
     * @DI\InjectParams({
     *     "eventDispatcher" = @DI\Inject("event_dispatcher"),
     *     "toolManager"     = @DI\Inject("claroline.manager.tool_manager")
     * })
     *
     * @param EventDispatcherInterface $eventDispatcher
     * @param ToolManager              $toolManager
     */
    public function __construct(
        EventDispatcherInterface $eventDispatcher,
        ToolManager $toolManager
    ) {
        $this->eventDispatcher = $eventDispatcher;
        $this->toolManager = $toolManager;
    }

    /**
     * Opens the desktop.
     *
     * @EXT\Route("/open", name="claro_desktop_open")
     * @EXT\ParamConverter("currentUser", converter="current_user", options={"allowAnonymous"=true})
     *
     * @param User $currentUser
     *
     * @return JsonResponse
     */
    public function openAction(User $currentUser = null)
    {
        // TODO : log desktop open
        // TODO : manage anonymous. This will break like this imo but they need to have access to tools opened to them.
        $tools = $this->toolManager->getDisplayedDesktopOrderedTools($currentUser);

        return new JsonResponse([
            'tools' => array_values(array_map(function (Tool $orderedTool) {
                return [
                    'icon' => $orderedTool->getClass(),
                    'name' => $orderedTool->getName(),
                ];
            }, $tools)),
        ]);
    }

    /**
     * Opens a tool.
     *
     * @EXT\Route("/tool/open/{toolName}", name="claro_desktop_open_tool")
     *
     * @param string $toolName
     *
     * @return Response
     */
    public function openToolAction($toolName)
    {
        // TODO : check user rights.

        /** @var DisplayToolEvent $event */
        $event = $this->eventDispatcher->dispatch('open_tool_desktop_'.$toolName, new DisplayToolEvent());

        $this->eventDispatcher->dispatch('log', new LogDesktopToolReadEvent($toolName));

        return new JsonResponse($event->getData());
    }
}
