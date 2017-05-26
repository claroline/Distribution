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
use Claroline\CursusBundle\Entity\CourseSession;
use Claroline\CursusBundle\Entity\SessionEvent;
use Claroline\CursusBundle\Manager\CursusManager;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\Serializer;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class SessionEventsToolController extends Controller
{
    private $authorization;
    private $cursusManager;
    private $request;
    private $serializer;

    /**
     * @DI\InjectParams({
     *     "authorization" = @DI\Inject("security.authorization_checker"),
     *     "cursusManager" = @DI\Inject("claroline.manager.cursus_manager"),
     *     "request"       = @DI\Inject("request"),
     *     "serializer"    = @DI\Inject("jms_serializer")
     * })
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        CursusManager $cursusManager,
        Request $request,
        Serializer $serializer
    ) {
        $this->authorization = $authorization;
        $this->cursusManager = $cursusManager;
        $this->request = $request;
        $this->serializer = $serializer;
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
        $sessionEventsData = count($sessions) > 0 ?
            $this->cursusManager->searchSessionEventsPartialList($sessions[0], [], 0, 20) :
            ['sessionsEvents' => [], 'count' => 0];

        return [
            'workspace' => $workspace,
            'canEdit' => $canEdit ? 1 : 0,
            'sessions' => $sessions,
            'sessionEvents' => $sessionEventsData['sessionEvents'],
            'sessionEventsTotal' => $sessionEventsData['count'],
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

    /**
     * @EXT\Route(
     *     "/workspace/{workspace}/session/events/delete",
     *     name="claro_cursus_session_events_delete",
     *     options = {"expose"=true}
     * )
     */
    public function sessionEventsDeleteAction(Workspace $workspace)
    {
        $sessionEvents = $this->container->get('claroline.manager.api_manager')
            ->getParameters('ids', 'Claroline\CursusBundle\Entity\SessionEvent');
        $this->checkSessionEventsEditionAccess($workspace, $sessionEvents);
        $this->cursusManager->deleteSessionEvents($sessionEvents);

        return new JsonResponse('success', 200);
    }

    /**
     * @EXT\Route(
     *     "/workspace/session/{session}/events/page/{page}/limit/{limit}/search",
     *     name="claro_cursus_session_events_search",
     *     options = {"expose"=true}
     * )
     */
    public function sessionEventsSearchAction(CourseSession $session, $page, $limit)
    {
        $workspace = $session->getWorkspace();
        $this->checkToolAccess($workspace);
        $searches = $this->request->query->all();
        $data = $this->cursusManager->searchSessionEventsPartialList($session, $searches, $page, $limit);
        $content = [
            'sessionEvents' => $this->serializer->serialize(
                $data['sessionEvents'],
                'json',
                SerializationContext::create()->setGroups(['api_cursus_min'])
            ),
            'total' => $data['count'],
        ];

        return new JsonResponse($content, 200);
    }

    private function checkToolAccess(Workspace $workspace = null)
    {
        if (is_null($workspace) || !$this->authorization->isGranted(['claroline_session_events_tool', 'open'], $workspace)) {
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

    private function checkSessionEventsEditionAccess(Workspace $workspace, array $sessionEvents)
    {
        if (!$this->authorization->isGranted(['claroline_session_events_tool', 'edit'], $workspace)) {
            throw new AccessDeniedException();
        }
        foreach ($sessionEvents as $sessionEvent) {
            if ($workspace->getId() !== $sessionEvent->getSession()->getWorkspace()->getId()) {
                throw new AccessDeniedException();
            }
        }
    }
}
