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

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Entity\Tool\Tool;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\Tool\ToolManager;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\CursusBundle\Entity\Course;
use Claroline\CursusBundle\Entity\CourseSession;
use Claroline\CursusBundle\Manager\CourseManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @Route("/cursus_course")
 */
class CourseController extends AbstractCrudController
{
    use PermissionCheckerTrait;

    /** @var TokenStorageInterface */
    private $tokenStorage;
    /** @var ToolManager */
    private $toolManager;
    /** @var CourseManager */
    private $manager;

    /**
     * CourseController constructor.
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param TokenStorageInterface         $tokenStorage
     * @param ToolManager                   $toolManager
     * @param CourseManager                 $manager
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        TokenStorageInterface $tokenStorage,
        ToolManager $toolManager,
        CourseManager $manager
    ) {
        $this->authorization = $authorization;
        $this->tokenStorage = $tokenStorage;
        $this->toolManager = $toolManager;
        $this->manager = $manager;
    }

    public function getName()
    {
        return 'cursus_course';
    }

    public function getClass()
    {
        return Course::class;
    }

    public function getIgnore()
    {
        return ['copyBulk', 'schema'];
    }

    public function getOptions()
    {
        return array_merge(parent::getOptions(), [
            'create' => [Options::PERSIST_TAG],
            'update' => [Options::PERSIST_TAG],
        ]);
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
     * @Route("/available", name="apiv2_cursus_course_available", methods={"GET"})
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function listAvailableAction(Request $request)
    {
        $this->checkToolAccess('OPEN');

        $params = $request->query->all();
        $params['hiddenFilters'] = $this->getDefaultHiddenFilters();

        if (empty($params['filters'])) {
            $params['filters'] = [];
        }

        $params['filters']['available'] = true;

        return new JsonResponse(
            $this->finder->search(Course::class, $params)
        );
    }

    /**
     * @Route("/{slug}/open", name="apiv2_cursus_course_open", methods={"GET"})
     * @EXT\ParamConverter("course", class="ClarolineCursusBundle:Course", options={"mapping": {"slug": "slug"}})
     *
     * @param Course $course
     *
     * @return JsonResponse
     */
    public function openAction(Course $course)
    {
        $this->checkPermission('OPEN', $course, [], true);

        $sessions = $this->finder->search(CourseSession::class, [
            'filters' => [
                'not_ended' => true,
                'course' => $course->getUuid(),
            ],
        ]);

        return new JsonResponse([
            'course' => $this->serializer->serialize($course),
            'defaultSession' => $course->getDefaultSession() ? $this->serializer->serialize($course->getDefaultSession()) : null,
            'availableSessions' => $sessions['data'],
        ]);
    }

    /**
     * @Route("/{id}/sessions", name="apiv2_cursus_course_list_sessions", methods={"GET"})
     * @EXT\ParamConverter("course", class="ClarolineCursusBundle:Course", options={"mapping": {"id": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param User    $user
     * @param Course  $course
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function listSessionsAction(User $user, Course $course, Request $request)
    {
        $this->checkPermission('OPEN', $course, [], true);

        $params = $request->query->all();

        if (!isset($params['hiddenFilters'])) {
            $params['hiddenFilters'] = [];
        }
        $params['hiddenFilters']['course'] = $course->getUuid();

        if (!$this->authorization->isGranted('ROLE_ADMIN')) {
            $params['hiddenFilters']['organizations'] = array_map(function (Organization $organization) {
                return $organization->getUuid();
            }, $user->getAdministratedOrganizations()->toArray());
        }

        return new JsonResponse(
            $this->finder->search('Claroline\CursusBundle\Entity\CourseSession', $params)
        );
    }

    /**
     * @Route("/{id}/users/{type}", name="apiv2_cursus_course_list_users", methods={"GET"})
     * @EXT\ParamConverter("course", class="ClarolineCursusBundle:Course", options={"mapping": {"id": "uuid"}})
     *
     * @param Course  $course
     * @param int     $type
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function listUsersAction(Course $course, $type, Request $request)
    {
        $this->checkPermission('OPEN', $course, [], true);

        $params = $request->query->all();

        if (!isset($params['hiddenFilters'])) {
            $params['hiddenFilters'] = [];
        }
        $params['hiddenFilters']['course'] = $course->getUuid();
        $params['hiddenFilters']['type'] = intval($type);

        return new JsonResponse(
            $this->finder->search(CursusUser::class, $params)
        );
    }

    /**
     * @Route("/{id}/users/{type}", name="apiv2_cursus_course_add_users", methods={"PATCH"})
     * @EXT\ParamConverter("course", class="ClarolineCursusBundle:Course", options={"mapping": {"id": "uuid"}})
     *
     * @param Course  $course
     * @param int     $type
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function addUsersAction(Course $course, $type, Request $request)
    {
        $this->checkPermission('EDIT', $course, [], true);

        $users = $this->decodeIdsString($request, User::class);
        $cursusUsers = $this->manager->addUsersToCursus($cursus, $users, intval($type));

        return new JsonResponse(array_map(function (CursusUser $cursusUser) {
            return $this->serializer->serialize($cursusUser);
        }, $cursusUsers));
    }

    /**
     * @Route("/{id}/users/{type}", name="apiv2_cursus_course_remove_users", methods={"DELETE"})
     * @EXT\ParamConverter("course", class="ClarolineCursusBundle:Course", options={"mapping": {"id": "uuid"}})
     *
     * @param Course  $course
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function removeUsersAction(Course $course, Request $request)
    {
        $this->checkPermission('EDIT', $course, [], true);

        $cursusUsers = $this->decodeIdsString($request, CursusUser::class);
        $this->manager->deleteEntities($cursusUsers);

        return new JsonResponse();
    }

    /**
     * @Route("/{id}/groups/{type}", name="apiv2_cursus_course_list_groups", methods={"GET"})
     * @EXT\ParamConverter("course", class="ClarolineCursusBundle:Course", options={"mapping": {"id": "uuid"}})
     *
     * @param Course  $course
     * @param int     $type
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function listGroupsAction(Course $course, $type, Request $request)
    {
        $this->checkPermission('OPEN', $course, [], true);

        $params = $request->query->all();

        if (!isset($params['hiddenFilters'])) {
            $params['hiddenFilters'] = [];
        }
        $params['hiddenFilters']['course'] = $course->getUuid();
        $params['hiddenFilters']['type'] = intval($type);

        return new JsonResponse(
            $this->finder->search(CursusGroup::class, $params)
        );
    }

    /**
     * @Route("/{id}/{type}/groups", name="apiv2_cursus_course_add_groups", methods={"PATCH"})
     * @EXT\ParamConverter("course", class="ClarolineCursusBundle:Course", options={"mapping": {"id": "uuid"}})
     *
     * @param Course  $course
     * @param int     $type
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function addGroupsAction(Course $course, $type, Request $request)
    {
        $this->checkPermission('EDIT', $course, [], true);

        $groups = $this->decodeIdsString($request, Group::class);
        $cursusGroups = $this->manager->addGroupsToCursus($cursus, $groups, intval($type));

        return new JsonResponse(array_map(function (CursusGroup $cursusGroup) {
            return $this->serializer->serialize($cursusGroup);
        }, $cursusGroups));
    }

    /**
     * @Route("/{id}/groups/{type}", name="apiv2_cursus_course_remove_groups", methods={"DELETE"})
     *
     * @param Course  $course
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function removeGroupsAction(Course $course, Request $request)
    {
        $this->checkPermission('EDIT', $course, [], true);

        $cursusGroups = $this->decodeIdsString($request, CursusGroup::class);
        $this->manager->deleteEntities($cursusGroups);

        return new JsonResponse();
    }

    /**
     * @param string $rights
     */
    private function checkToolAccess($rights = 'OPEN')
    {
        $trainingsTool = $this->toolManager->getOrderedTool('trainings', Tool::DESKTOP);

        if (is_null($trainingsTool) || !$this->authorization->isGranted($rights, $trainingsTool)) {
            throw new AccessDeniedException();
        }
    }
}
