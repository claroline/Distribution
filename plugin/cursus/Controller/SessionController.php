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
use Claroline\CoreBundle\Manager\Tool\ToolManager;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\CursusBundle\Entity\CourseSession;
use Claroline\CursusBundle\Entity\CourseSessionGroup;
use Claroline\CursusBundle\Entity\CourseSessionRegistrationQueue;
use Claroline\CursusBundle\Entity\CourseSessionUser;
use Claroline\CursusBundle\Entity\SessionEvent;
use Claroline\CursusBundle\Manager\SessionManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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
        return CourseSession::class;
    }

    public function getIgnore()
    {
        return ['schema'];
    }

    protected function getDefaultHiddenFilters()
    {
        if (!$this->authorization->isGranted('ROLE_ADMIN')) {
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
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     */
    public function listPublicAction(User $user, Request $request): JsonResponse
    {
        $params = $request->query->all();

        $params['hiddenFilters'] = $this->getDefaultHiddenFilters();
        $params['hiddenFilters']['publicRegistration'] = true;
        $params['hiddenFilters']['terminated'] = false;

        return new JsonResponse(
            $this->finder->search(CourseSession::class, $params)
        );
    }

    /**
     * @Route("/{id}/events", name="apiv2_cursus_session_list_events")
     * @EXT\ParamConverter("session", class="ClarolineCursusBundle:CourseSession", options={"mapping": {"id": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     */
    public function listEventsAction(User $user, CourseSession $session, Request $request): JsonResponse
    {
        $this->checkPermission('OPEN', $session, [], true);

        $params = $request->query->all();
        $params['hiddenFilters'] = $this->getDefaultHiddenFilters();

        return new JsonResponse(
            $this->finder->search(SessionEvent::class, $params)
        );
    }

    /**
     * @Route("/{id}/users/{type}", name="apiv2_cursus_session_list_users", methods={"GET"})
     * @EXT\ParamConverter("session", class="ClarolineCursusBundle:CourseSession", options={"mapping": {"id": "uuid"}})
     */
    public function listUsersAction(CourseSession $session, $type, Request $request): JsonResponse
    {
        $this->checkPermission('OPEN', $session, [], true);

        $params = $request->query->all();

        if (!isset($params['hiddenFilters'])) {
            $params['hiddenFilters'] = [];
        }
        $params['hiddenFilters']['session'] = $session->getUuid();
        $params['hiddenFilters']['type'] = intval($type);

        return new JsonResponse(
            $this->finder->search(CourseSessionUser::class, $params)
        );
    }

    /**
     * @Route("/{id}/users/{type}", name="apiv2_cursus_session_add_users", methods={"PATCH"})
     * @EXT\ParamConverter("session", class="ClarolineCursusBundle:CourseSession", options={"mapping": {"id": "uuid"}})
     */
    public function addUsersAction(CourseSession $session, $type, Request $request): JsonResponse
    {
        $this->checkPermission('EDIT', $session, [], true);

        $typeInt = intval($type);
        $users = $this->decodeIdsString($request, User::class);
        $nbUsers = count($users);

        if (CourseSessionUser::TYPE_LEARNER === $typeInt && !$this->manager->checkSessionCapacity($session, $nbUsers)) {
            $errors = [$this->translator->trans('users_limit_reached', ['%count%' => $nbUsers], 'cursus')];

            return new JsonResponse(['errors' => $errors], 405);
        } else {
            $sessionUsers = $this->manager->addUsersToSession($session, $users, $typeInt);

            return new JsonResponse(array_map(function (CourseSessionUser $sessionUser) {
                return $this->serializer->serialize($sessionUser);
            }, $sessionUsers));
        }
    }

    /**
     * @Route("/{id}/users/{type}", name="apiv2_cursus_session_remove_users", methods={"DELETE"})
     * @EXT\ParamConverter("session", class="ClarolineCursusBundle:CourseSession", options={"mapping": {"id": "uuid"}})
     */
    public function removeUsersAction(CourseSession $session, Request $request): JsonResponse
    {
        $this->checkPermission('EDIT', $session, [], true);

        $sessionUsers = $this->decodeIdsString($request, CourseSessionUser::class);
        $this->manager->deleteEntities($sessionUsers);

        return new JsonResponse();
    }

    /**
     * @Route("/{id}/groups/{type}", name="apiv2_cursus_session_list_groups", methods={"GET"})
     * @EXT\ParamConverter("session", class="ClarolineCursusBundle:CourseSession", options={"mapping": {"id": "uuid"}})
     */
    public function listGroupsAction(CourseSession $session, $type, Request $request): JsonResponse
    {
        $this->checkPermission('OPEN', $session, [], true);

        $params = $request->query->all();

        if (!isset($params['hiddenFilters'])) {
            $params['hiddenFilters'] = [];
        }
        $params['hiddenFilters']['session'] = $session->getUuid();
        $params['hiddenFilters']['type'] = intval($type);

        return new JsonResponse(
            $this->finder->search(CourseSessionGroup::class, $params)
        );
    }

    /**
     * @Route("/{id}/groups/{type}", name="apiv2_cursus_session_add_groups")
     * @EXT\ParamConverter("session", class="ClarolineCursusBundle:CourseSession", options={"mapping": {"id": "uuid"}})
     */
    public function addGroupsAction(CourseSession $session, $type, Request $request): JsonResponse
    {
        $this->checkPermission('EDIT', $session, [], true);

        $typeInt = intval($type);
        $groups = $this->decodeIdsString($request, Group::class);
        $nbUsers = 0;

        foreach ($groups as $group) {
            $nbUsers += count($group->getUsers()->toArray());
        }

        if (CourseSessionGroup::TYPE_LEARNER === $typeInt && !$this->manager->checkSessionCapacity($session, $nbUsers)) {
            $errors = [$this->translator->trans('users_limit_reached', ['%count%' => $nbUsers], 'cursus')];

            return new JsonResponse(['errors' => $errors], 405);
        } else {
            $sessionGroups = $this->manager->addGroupsToSession($session, $groups, $typeInt);

            return new JsonResponse(array_map(function (CourseSessionGroup $sessionGroup) {
                return $this->serializer->serialize($sessionGroup);
            }, $sessionGroups));
        }
    }

    /**
     * @Route("/{id}/groups/{type}", name="apiv2_cursus_session_remove_groups", methods={"DELETE"})
     * @EXT\ParamConverter("session", class="ClarolineCursusBundle:CourseSession", options={"mapping": {"id": "uuid"}})
     */
    public function removeGroupsAction(CourseSession $session, Request $request): JsonResponse
    {
        $this->checkPermission('EDIT', $session, [], true);

        $sessionGroups = $this->decodeIdsString($request, CourseSessionGroup::class);
        $this->manager->deleteEntities($sessionGroups);

        return new JsonResponse(null, 204);
    }

    /**
     * @Route("/{id}/self/register", name="apiv2_cursus_session_self_register", methods={"PUT"})
     * @EXT\ParamConverter("session", class="ClarolineCursusBundle:CourseSession", options={"mapping": {"id": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     */
    public function selfRegisterAction(CourseSession $session, User $user): JsonResponse
    {
        $this->checkPermission('OPEN', $session, [], true);

        if (!$session->getPublicRegistration()) {
            throw new AccessDeniedException();
        }

        $result = $this->manager->registerUserToSession($session, $user);
        $data = null;

        if ($result instanceof CourseSessionRegistrationQueue) {
            $data = $this->serializer->serialize($result);
        } elseif (is_array($result) && 0 < count($result)) {
            $data = $this->serializer->serialize($result[0]);
        }

        return new JsonResponse($data);
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
     * @EXT\ParamConverter("queue", class="ClarolineCursusBundle:CourseSessionRegistrationQueue", options={"mapping": {"queue": "uuid"}})
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
                $this->translator->trans('users_limit_reached', ['%count%' => 1], 'cursus')
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
     *     class="ClarolineCursusBundle:CourseSession",
     *     options={"mapping": {"id": "uuid"}}
     * )
     */
    public function inviteAllAction(CourseSession $session): JsonResponse
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
     *     class="ClarolineCursusBundle:CourseSession",
     *     options={"mapping": {"id": "uuid"}}
     * )
     */
    public function inviteUsersAction(CourseSession $session, Request $request): JsonResponse
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
     *     class="ClarolineCursusBundle:CourseSession",
     *     options={"mapping": {"id": "uuid"}}
     * )
     */
    public function inviteGroupsAction(CourseSession $session, Request $request): JsonResponse
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

    /**
     * @Route(
     *     "/{id}/certificate/all/generate",
     *     name="apiv2_cursus_session_certificate_generate_all",
     *     methods={"PUT"}
     * )
     * @EXT\ParamConverter(
     *     "session",
     *     class="ClarolineCursusBundle:CourseSession",
     *     options={"mapping": {"id": "uuid"}}
     * )
     */
    public function generateAllCertificatesAction(CourseSession $session): JsonResponse
    {
        $this->checkToolAccess();
        $this->manager->generateAllSessionCertificates($session);

        return new JsonResponse();
    }

    /**
     * @Route(
     *     "/{id}/certificate/users/generate",
     *     name="apiv2_cursus_session_certificate_generate_users",
     *     methods={"PUT"}
     * )
     * @EXT\ParamConverter(
     *     "session",
     *     class="ClarolineCursusBundle:CourseSession",
     *     options={"mapping": {"id": "uuid"}}
     * )
     */
    public function generateUsersCertificatesAction(CourseSession $session, Request $request): JsonResponse
    {
        $this->checkToolAccess();
        $users = $this->decodeIdsString($request, User::class);
        $this->manager->generateSessionCertificates($session, $users);

        return new JsonResponse();
    }

    /**
     * @Route(
     *     "/{id}/certificate/groups/generate",
     *     name="apiv2_cursus_session_certificate_generate_groups",
     *     methods={"PUT"}
     * )
     * @EXT\ParamConverter(
     *     "session",
     *     class="ClarolineCursusBundle:CourseSession",
     *     options={"mapping": {"id": "uuid"}}
     * )
     */
    public function generateGroupsCertificatesAction(CourseSession $session, Request $request): JsonResponse
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
        $this->manager->generateSessionCertificates($session, $users);

        return new JsonResponse();
    }

    /**
     * @param string $rights
     */
    private function checkToolAccess(string $rights = 'OPEN')
    {
        $trainingsTool = $this->toolManager->getOrderedTool('trainings', Tool::DESKTOP);

        if (is_null($trainingsTool) || !$this->authorization->isGranted($rights, $trainingsTool)) {
            throw new AccessDeniedException();
        }
    }
}
