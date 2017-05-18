<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Controller\API;

use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CursusBundle\Entity\SessionEvent;
use Claroline\CursusBundle\Manager\CursusManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class SessionEventsToolController extends Controller
{
    private $authorization;
    private $cursusManager;

    /**
     * @DI\InjectParams({
     *     "authorization" = @DI\Inject("security.authorization_checker"),
     *     "cursusManager" = @DI\Inject("claroline.manager.cursus_manager")
     * })
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        CursusManager $cursusManager
    ) {
        $this->authorization = $authorization;
        $this->cursusManager = $cursusManager;
    }

    /**
     * @EXT\Route(
     *     "/workspace/{workspace}/tool/session/events/index",
     *     name="claro_cursus_session_events_tool_index"
     * )
     * @EXT\Template()
     *
     * @return array
     */
    public function indexAction(Workspace $workspace)
    {
        $this->checkToolAccess($workspace);
        $canEdit = $this->authorization->isGranted(['claroline_session_events_tool', 'edit'], $workspace);
        $sessions = $this->cursusManager->getSessionsByWorkspace($workspace);
        $sessionEvents = [];

        foreach ($sessions as $session) {
            $sessionEvents[$session->getId()] = $session->getEvents();
        }

        return [
            'workspace' => $workspace,
            'canEdit' => $canEdit ? 1 : 0,
            'sessions' => $sessions,
            'sessionEvents' => $sessionEvents,
        ];
    }

    /**
     * @EXT\Route(
     *     "/workspace/{workspace}/session/event/{sessionEvent}/delete",
     *     name="claro_cursus_session_event_delete",
     *     options = {"expose"=true}
     * )
     */
    public function sessionEventDeleteAction(Workspace $workspace, SessionEvent $sessionEvent)
    {
        $this->checkSessionEventEditionAccess($workspace, $sessionEvent);
        $this->cursusManager->deleteSessionEvent($sessionEvent);

        return new JsonResponse('success', 200);
    }

    private function checkToolAccess(Workspace $workspace)
    {
        if (!$this->authorization->isGranted(['claroline_session_events_tool', 'open'], $workspace)) {
            throw new AccessDeniedException();
        }
    }

    private function checkSessionEventEditionAccess(Workspace $workspace, SessionEvent $sessionEvent)
    {
        if (!$this->authorization->isGranted(['claroline_session_events_tool', 'edit'], $workspace) ||
            $workspace->getId() !== $sessionEvent->getSession()->getWorkspace()->getId()
        ) {
            throw new AccessDeniedException();
        }
    }
}
