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
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\CursusBundle\Entity\CourseSession;
use Claroline\CursusBundle\Entity\SessionEvent;
use Claroline\CursusBundle\Entity\SessionEventUser;
use Claroline\CursusBundle\Manager\SessionEventManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @Route("/cursus_event")
 */
class SessionEventController extends AbstractCrudController
{
    use PermissionCheckerTrait;

    /** @var TokenStorageInterface */
    private $tokenStorage;
    /** @var TranslatorInterface */
    private $translator;
    /** @var SessionEventManager */
    private $manager;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        TokenStorageInterface $tokenStorage,
        TranslatorInterface $translator,
        SessionEventManager $manager
    ) {
        $this->authorization = $authorization;
        $this->tokenStorage = $tokenStorage;
        $this->translator = $translator;
        $this->manager = $manager;
    }

    public function getName()
    {
        return 'cursus_event';
    }

    public function getClass()
    {
        return SessionEvent::class;
    }

    public function getIgnore()
    {
        return ['copyBulk'];
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
     * @Route("/{id}/users", name="apiv2_cursus_session_event_list_users", methods={"GET"})
     * @EXT\ParamConverter("sessionEvent", class="ClarolineCursusBundle:SessionEvent", options={"mapping": {"id": "uuid"}})
     */
    public function listUsersAction(SessionEvent $sessionEvent, Request $request): JsonResponse
    {
        $this->checkPermission('OPEN', $sessionEvent, [], true);

        $params = $request->query->all();

        if (!isset($params['hiddenFilters'])) {
            $params['hiddenFilters'] = [];
        }
        $params['hiddenFilters']['sessionEvent'] = $sessionEvent->getUuid();

        return new JsonResponse(
            $this->finder->search(SessionEventUser::class, $params)
        );
    }

    /**
     * @Route("/{id}/users", name="apiv2_cursus_session_event_add_users", methods={"PATCH"})
     * @EXT\ParamConverter("sessionEvent", class="ClarolineCursusBundle:SessionEvent", options={"mapping": {"id": "uuid"}})
     */
    public function addUsersAction(SessionEvent $sessionEvent, Request $request): JsonResponse
    {
        $this->checkPermission('EDIT', $sessionEvent, [], true);

        $users = $this->decodeIdsString($request, User::class);
        $nbUsers = count($users);

        if (!$this->manager->checkSessionEventCapacity($sessionEvent, $nbUsers)) {
            $errors = [$this->translator->trans('users_limit_reached', ['%count%' => $nbUsers], 'cursus')];

            return new JsonResponse(['errors' => $errors], 405);
        } else {
            $sessionEventUsers = $this->manager->addUsersToSessionEvent($sessionEvent, $users);

            return new JsonResponse(array_map(function (SessionEventUser $sessionEventUser) {
                return $this->serializer->serialize($sessionEventUser);
            }, $sessionEventUsers));
        }
    }

    /**
     * @Route("/{id}/users", name="apiv2_cursus_session_event_remove_users", methods={"DELETE"})
     * @EXT\ParamConverter("sessionEvent", class="ClarolineCursusBundle:SessionEvent", options={"mapping": {"id": "uuid"}})
     */
    public function removeUsersAction(SessionEvent $sessionEvent, Request $request): JsonResponse
    {
        $this->checkPermission('EDIT', $sessionEvent, [], true);

        $sessionEventUsers = $this->decodeIdsString($request, SessionEventUser::class);
        $this->manager->removeUsersFromSessionEvent($sessionEventUsers);

        return new JsonResponse(null, 204);
    }

    /**
     * @Route(
     *     "/{id}/self/register",
     *     name="apiv2_cursus_session_event_self_register",
     *     methods={"PUT"}
     * )
     * @EXT\ParamConverter(
     *     "sessionEvent",
     *     class="ClarolineCursusBundle:SessionEvent",
     *     options={"mapping": {"id": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     */
    public function selfRegisterAction(SessionEvent $sessionEvent, User $user): JsonResponse
    {
        $this->checkPermission('OPEN', $sessionEvent, [], true);

        if (CourseSession::REGISTRATION_PUBLIC !== $sessionEvent->getRegistrationType()) {
            throw new AccessDeniedException();
        }
        $this->manager->registerUserToSessionEvent($sessionEvent, $user);

        $eventsRegistration = [];
        $eventUsers = !is_null($user) ?
            $this->finder->fetch(
                SessionEventUser::class,
                ['session' => $sessionEvent->getSession()->getUuid(), 'user' => $user->getUuid()]
            ) :
            [];

        foreach ($eventUsers as $eventUser) {
            $event = $eventUser->getSessionEvent();
            $set = $event->getEventSet();
            $eventsRegistration[$event->getUuid()] = true;

            if ($set) {
                $setName = $set->getName();

                if (!isset($eventsRegistration[$setName])) {
                    $eventsRegistration[$setName] = $set->getLimit();
                }
                --$eventsRegistration[$setName];
            }
        }

        return new JsonResponse($eventsRegistration);
    }

    /**
     * @Route(
     *     "/{id}/all/invite",
     *     name="apiv2_cursus_session_event_invite_all",
     *     methods={"PUT"}
     * )
     * @EXT\ParamConverter(
     *     "sessionEvent",
     *     class="ClarolineCursusBundle:SessionEvent",
     *     options={"mapping": {"id": "uuid"}}
     * )
     */
    public function inviteAllUsersAction(SessionEvent $sessionEvent): JsonResponse
    {
        $this->checkPermission('EDIT', $sessionEvent, [], true);

        $this->manager->inviteAllSessionEventUsers($sessionEvent);

        return new JsonResponse();
    }

    /**
     * @Route(
     *     "/{id}/users/invite",
     *     name="apiv2_cursus_session_event_invite_users",
     *     methods={"PUT"}
     * )
     * @EXT\ParamConverter(
     *     "sessionEvent",
     *     class="ClarolineCursusBundle:SessionEvent",
     *     options={"mapping": {"id": "uuid"}}
     * )
     */
    public function inviteUsersAction(SessionEvent $sessionEvent, Request $request): JsonResponse
    {
        $this->checkPermission('EDIT', $sessionEvent, [], true);

        $users = $this->decodeIdsString($request, User::class);
        $this->manager->sendEventInvitation($sessionEvent, $users);

        return new JsonResponse();
    }

    /**
     * @Route(
     *     "/{id}/certificate/all/generate",
     *     name="apiv2_cursus_session_event_certificate_generate_all",
     *     methods={"PUT"}
     * )
     * @EXT\ParamConverter(
     *     "sessionEvent",
     *     class="ClarolineCursusBundle:SessionEvent",
     *     options={"mapping": {"id": "uuid"}}
     * )
     */
    public function generateAllCertificatesAction(SessionEvent $sessionEvent): JsonResponse
    {
        $this->checkPermission('EDIT', $sessionEvent, [], true);

        $this->manager->generateAllEventCertificates($sessionEvent);

        return new JsonResponse();
    }

    /**
     * @Route(
     *     "/{id}/certificate/users/generate",
     *     name="apiv2_cursus_session_event_certificate_generate_users",
     *     methods={"PUT"}
     * )
     * @EXT\ParamConverter(
     *     "sessionEvent",
     *     class="ClarolineCursusBundle:SessionEvent",
     *     options={"mapping": {"id": "uuid"}}
     * )
     */
    public function generateUsersCertificatesAction(SessionEvent $sessionEvent, Request $request): JsonResponse
    {
        $this->checkPermission('EDIT', $sessionEvent, [], true);

        $users = $this->decodeIdsString($request, User::class);
        $this->manager->generateEventCertificates($sessionEvent, $users);

        return new JsonResponse();
    }
}
