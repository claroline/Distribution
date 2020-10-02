<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Controller;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Entity\Tool\Tool;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Normalizer\TextNormalizer;
use Claroline\CoreBundle\Manager\Tool\ToolManager;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\CursusBundle\Entity\Registration\AbstractRegistration;
use Claroline\CursusBundle\Entity\Registration\SessionGroup;
use Claroline\CursusBundle\Entity\Registration\SessionUser;
use Claroline\CursusBundle\Entity\Session;
use Claroline\CursusBundle\Entity\Event;
use Claroline\CursusBundle\Manager\SessionManager;
use Dompdf\Dompdf;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @Route("/cursus_session")
 */
class SessionController extends AbstractCrudController
{
    use PermissionCheckerTrait;

    /** @var TokenStorageInterface */
    private $tokenStorage;
    /** @var TranslatorInterface */
    private $translator;
    /** @var ToolManager */
    private $toolManager;
    /** @var SessionManager */
    private $manager;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        TokenStorageInterface $tokenStorage,
        TranslatorInterface $translator,
        ToolManager $toolManager,
        SessionManager $manager
    ) {
        $this->authorization = $authorization;
        $this->tokenStorage = $tokenStorage;
        $this->translator = $translator;
        $this->toolManager = $toolManager;
        $this->manager = $manager;
    }

    public function getName()
    {
        return 'cursus_session';
    }

    public function getClass()
    {
        return Session::class;
    }

    public function getIgnore()
    {
        return ['schema'];
    }

    protected function getDefaultHiddenFilters()
    {
        if (!$this->authorization->isGranted('ROLE_ADMIN')) {
            /** @var User $user */
            $user = $this->tokenStorage->getToken()->getUser();

            return [
                'organizations' => array_map(function (Organization $organization) {
                    return $organization->getUuid();
                }, $user->getOrganizations()),
            ];
        }

        return [];
    }

    /**
     * @Route("/public", name="apiv2_cursus_session_public", methods={"GET"})
     */
    public function listPublicAction(Request $request): JsonResponse
    {
        $params = $request->query->all();

        $params['hiddenFilters'] = $this->getDefaultHiddenFilters();
        $params['hiddenFilters']['publicRegistration'] = true;
        $params['hiddenFilters']['terminated'] = false;

        return new JsonResponse(
            $this->finder->search(Session::class, $params)
        );
    }

    /**
     * @Route("/registered", name="apiv2_cursus_session_registered", methods={"GET"})
     */
    public function listRegisteredAction(Request $request): JsonResponse
    {
        if (!$this->authorization->isGranted('IS_AUTHENTICATED_FULLY')) {
            throw new AccessDeniedException();
        }

        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();

        $params = $request->query->all();
        $params['hiddenFilters'] = $this->getDefaultHiddenFilters();
        $params['hiddenFilters']['user'] = $user->getUuid();

        return new JsonResponse(
            $this->finder->search(Session::class, $params)
        );
    }

    /**
     * @Route("/{id}/pdf", name="apiv2_cursus_session_download_pdf", methods={"GET"})
     * @EXT\ParamConverter("session", class="Claroline\CursusBundle\Entity\Session", options={"mapping": {"id": "uuid"}})
     */
    public function downloadPdfAction(Session $session, Request $request): StreamedResponse
    {
        $this->checkPermission('OPEN', $session, [], true);

        $domPdf = new Dompdf([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
        ]);
        $domPdf->loadHtml($this->manager->generateFromTemplate(
            $session,
            $request->server->get('DOCUMENT_ROOT').$request->getBasePath(),
            $request->getLocale())
        );

        // Render the HTML as PDF
        $domPdf->render();

        return new StreamedResponse(function () use ($domPdf) {
            echo $domPdf->output();
        }, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename='.TextNormalizer::toKey($session->getName()).'.pdf',
        ]);
    }

    /**
     * @Route("/{id}/events", name="apiv2_cursus_session_list_events")
     * @EXT\ParamConverter("session", class="Claroline\CursusBundle\Entity\Session", options={"mapping": {"id": "uuid"}})
     */
    public function listEventsAction(Session $session, Request $request): JsonResponse
    {
        $this->checkPermission('OPEN', $session, [], true);

        $params = $request->query->all();
        $params['hiddenFilters'] = $this->getDefaultHiddenFilters();

        return new JsonResponse(
            $this->finder->search(Event::class, $params)
        );
    }

    /**
     * @Route("/{id}/users/{type}", name="apiv2_cursus_session_list_users", methods={"GET"})
     * @EXT\ParamConverter("session", class="Claroline\CursusBundle\Entity\Session", options={"mapping": {"id": "uuid"}})
     */
    public function listUsersAction(Session $session, string $type, Request $request): JsonResponse
    {
        $this->checkPermission('OPEN', $session, [], true);

        $params = $request->query->all();

        if (!isset($params['hiddenFilters'])) {
            $params['hiddenFilters'] = [];
        }
        $params['hiddenFilters']['session'] = $session->getUuid();
        $params['hiddenFilters']['type'] = $type;
        $params['hiddenFilters']['pending'] = false;

        return new JsonResponse(
            $this->finder->search(SessionUser::class, $params)
        );
    }

    /**
     * @Route("/{id}/pending/{type}", name="apiv2_cursus_session_list_pending", methods={"GET"})
     * @EXT\ParamConverter("session", class="Claroline\CursusBundle\Entity\Session", options={"mapping": {"id": "uuid"}})
     */
    public function listPendingAction(Session $session, string $type, Request $request): JsonResponse
    {
        $this->checkPermission('OPEN', $session, [], true);

        $params = $request->query->all();

        if (!isset($params['hiddenFilters'])) {
            $params['hiddenFilters'] = [];
        }
        $params['hiddenFilters']['session'] = $session->getUuid();
        $params['hiddenFilters']['type'] = $type;
        $params['hiddenFilters']['pending'] = true;

        return new JsonResponse(
            $this->finder->search(SessionUser::class, $params)
        );
    }

    /**
     * @Route("/{id}/users/{type}", name="apiv2_cursus_session_add_users", methods={"PATCH"})
     * @EXT\ParamConverter("session", class="Claroline\CursusBundle\Entity\Session", options={"mapping": {"id": "uuid"}})
     */
    public function addUsersAction(Session $session, string $type, Request $request): JsonResponse
    {
        $this->checkPermission('EDIT', $session, [], true);

        $users = $this->decodeIdsString($request, User::class);
        $nbUsers = count($users);

        if (AbstractRegistration::LEARNER === $type && !$this->manager->checkSessionCapacity($session, $nbUsers)) {
            return new JsonResponse(['errors' => [
                $this->translator->trans('users_limit_reached', ['%count%' => $nbUsers], 'cursus'),
            ]], 405);
        }

        $sessionUsers = $this->manager->addUsersToSession($session, $users, $type);

        return new JsonResponse(array_map(function (SessionUser $sessionUser) {
            return $this->serializer->serialize($sessionUser);
        }, $sessionUsers));
    }

    /**
     * @Route("/{id}/users/{type}", name="apiv2_cursus_session_remove_users", methods={"DELETE"})
     * @EXT\ParamConverter("session", class="Claroline\CursusBundle\Entity\Session", options={"mapping": {"id": "uuid"}})
     */
    public function removeUsersAction(Session $session, Request $request): JsonResponse
    {
        $this->checkPermission('EDIT', $session, [], true);

        $sessionUsers = $this->decodeIdsString($request, SessionUser::class);
        $this->manager->removeUsersFromSession($session, $sessionUsers);

        return new JsonResponse(null, 204);
    }

    /**
     * @Route("/{id}/groups/{type}", name="apiv2_cursus_session_list_groups", methods={"GET"})
     * @EXT\ParamConverter("session", class="Claroline\CursusBundle\Entity\Session", options={"mapping": {"id": "uuid"}})
     */
    public function listGroupsAction(Session $session, $type, Request $request): JsonResponse
    {
        $this->checkPermission('OPEN', $session, [], true);

        $params = $request->query->all();
        if (!isset($params['hiddenFilters'])) {
            $params['hiddenFilters'] = [];
        }
        $params['hiddenFilters']['session'] = $session->getUuid();
        $params['hiddenFilters']['type'] = intval($type);

        return new JsonResponse(
            $this->finder->search(SessionGroup::class, $params)
        );
    }

    /**
     * @Route("/{id}/groups/{type}", name="apiv2_cursus_session_add_groups")
     * @EXT\ParamConverter("session", class="Claroline\CursusBundle\Entity\Session", options={"mapping": {"id": "uuid"}})
     */
    public function addGroupsAction(Session $session, string $type, Request $request): JsonResponse
    {
        $this->checkPermission('EDIT', $session, [], true);

        $groups = $this->decodeIdsString($request, Group::class);
        $nbUsers = 0;

        foreach ($groups as $group) {
            $nbUsers += count($group->getUsers()->toArray());
        }

        if (AbstractRegistration::LEARNER === $type && !$this->manager->checkSessionCapacity($session, $nbUsers)) {
            return new JsonResponse(['errors' => [
                $this->translator->trans('users_limit_reached', ['%count%' => $nbUsers], 'cursus'),
            ]], 405);
        }

        $sessionGroups = $this->manager->addGroupsToSession($session, $groups, $type);

        return new JsonResponse(array_map(function (SessionGroup $sessionGroup) {
            return $this->serializer->serialize($sessionGroup);
        }, $sessionGroups));
    }

    /**
     * @Route("/{id}/groups/{type}", name="apiv2_cursus_session_remove_groups", methods={"DELETE"})
     * @EXT\ParamConverter("session", class="Claroline\CursusBundle\Entity\Session", options={"mapping": {"id": "uuid"}})
     */
    public function removeGroupsAction(Session $session, Request $request): JsonResponse
    {
        $this->checkPermission('EDIT', $session, [], true);

        $sessionGroups = $this->decodeIdsString($request, SessionGroup::class);
        $this->manager->deleteEntities($sessionGroups);

        return new JsonResponse(null, 204);
    }

    /**
     * @Route("/{id}/self/register", name="apiv2_cursus_session_self_register", methods={"PUT"})
     * @EXT\ParamConverter("session", class="Claroline\CursusBundle\Entity\Session", options={"mapping": {"id": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     */
    public function selfRegisterAction(Session $session, User $user): JsonResponse
    {
        $this->checkPermission('OPEN', $session, [], true);

        if (!$session->getPublicRegistration()) {
            throw new AccessDeniedException();
        }

        $result = $this->manager->registerUserToSession($session, $user);

        return new JsonResponse($this->serializer->serialize($result));
    }

    /**
     * @Route("/queues", name="apiv2_cursus_session_list_queues", methods={"GET"})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     */
    public function listSessionQueuesAction(User $user, Request $request): JsonResponse
    {
        $this->checkToolAccess();

        $params = $request->query->all();

        if (!isset($params['hiddenFilters'])) {
            $params['hiddenFilters'] = [];
        }
        if (!$this->authorization->isGranted('ROLE_ADMIN')) {
            $params['hiddenFilters']['organizations'] = array_map(function (Organization $organization) {
                return $organization->getUuid();
            }, $user->getAdministratedOrganizations()->toArray());
        }

        return new JsonResponse(
            $this->finder->search(CourseSessionRegistrationQueue::class, $params)
        );
    }

    /**
     * @Route("/queues", name="apiv2_cursus_session_remove_queues", methods={"DELETE"})
     */
    public function removeQueuesAction(Request $request): JsonResponse
    {
        $this->checkToolAccess();
        $sessionQueues = $this->decodeIdsString($request, CourseSessionRegistrationQueue::class);
        $this->manager->deleteEntities($sessionQueues);

        return new JsonResponse();
    }

    /**
     * @Route("/queues/{queue}/validate", name="apiv2_cursus_session_validate_queue", methods={"PUT"})
     * @EXT\ParamConverter("queue", class="Claroline\CursusBundle\Entity\SessionRegistrationQueue", options={"mapping": {"queue": "uuid"}})
     */
    public function sessionQueueValidateAction(CourseSessionRegistrationQueue $queue): JsonResponse
    {
        $this->checkToolAccess();

        if ($this->manager->checkSessionCapacity($queue->getSession())) {
            $this->manager->validateSessionQueue($queue);

            return new JsonResponse();
        }

        return new JsonResponse([
            'errors' => [
                $this->translator->trans('users_limit_reached', ['%count%' => 1], 'cursus'),
            ],
        ], 405);
    }

    /**
     * @Route(
     *     "/{id}/all/invite",
     *     name="apiv2_cursus_session_invite_all",
     *     methods={"PUT"}
     * )
     * @EXT\ParamConverter(
     *     "session",
     *     class="Claroline\CursusBundle\Entity\Session",
     *     options={"mapping": {"id": "uuid"}}
     * )
     */
    public function inviteAllAction(Session $session): JsonResponse
    {
        $this->checkToolAccess();
        $this->manager->inviteAllSessionLearners($session);

        return new JsonResponse();
    }

    /**
     * @Route(
     *     "/{id}/users/invite",
     *     name="apiv2_cursus_session_invite_users",
     *     methods={"PUT"}
     * )
     * @EXT\ParamConverter(
     *     "session",
     *     class="Claroline\CursusBundle\Entity\Session",
     *     options={"mapping": {"id": "uuid"}}
     * )
     */
    public function inviteUsersAction(Session $session, Request $request): JsonResponse
    {
        $this->checkToolAccess();
        $users = $this->decodeIdsString($request, User::class);
        $this->manager->sendSessionInvitation($session, $users);

        return new JsonResponse();
    }

    /**
     * @Route(
     *     "/{id}/groups/invite",
     *     name="apiv2_cursus_session_invite_groups",
     *     methods={"PUT"}
     * )
     * @EXT\ParamConverter(
     *     "session",
     *     class="Claroline\CursusBundle\Entity\Session",
     *     options={"mapping": {"id": "uuid"}}
     * )
     */
    public function inviteGroupsAction(Session $session, Request $request): JsonResponse
    {
        $this->checkToolAccess();
        $groups = $this->decodeIdsString($request, Group::class);
        $users = [];

        foreach ($groups as $group) {
            $groupUsers = $group->getUsers();

            foreach ($groupUsers as $user) {
                $users[$user->getUuid()] = $user;
            }
        }
        $this->manager->sendSessionInvitation($session, $users);

        return new JsonResponse();
    }

    private function checkToolAccess(string $rights = 'OPEN')
    {
        $trainingsTool = $this->toolManager->getOrderedTool('trainings', Tool::DESKTOP);

        if (is_null($trainingsTool) || !$this->authorization->isGranted($rights, $trainingsTool)) {
            throw new AccessDeniedException();
        }
    }
}
