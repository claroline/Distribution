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
use Claroline\CoreBundle\Library\Normalizer\TextNormalizer;
use Claroline\CoreBundle\Manager\Tool\ToolManager;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\CursusBundle\Entity\Course;
use Claroline\CursusBundle\Entity\CourseSession;
use Claroline\CursusBundle\Manager\CourseManager;
use Dompdf\Dompdf;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
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
            /** @var User $user */
            $user = $this->tokenStorage->getToken()->getUser();

            return [
                'hidden' => $this->checkToolAccess('EDIT'),
                'organizations' => array_map(function (Organization $organization) {
                    return $organization->getUuid();
                }, $user->getOrganizations()),
            ];
        }

        return [];
    }

    /**
     * @Route("/available", name="apiv2_cursus_course_available", methods={"GET"})
     */
    public function listAvailableAction(Request $request): JsonResponse
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
     */
    public function openAction(Course $course): JsonResponse
    {
        $this->checkPermission('OPEN', $course, [], true);

        $sessions = $this->finder->search(CourseSession::class, [
            'filters' => [
                'terminated' => false,
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
     * @Route("/{id}/pdf", name="apiv2_cursus_course_download_pdf", methods={"GET"})
     * @EXT\ParamConverter("course", class="ClarolineCursusBundle:Course", options={"mapping": {"id": "uuid"}})
     */
    public function downloadPdfAction(Course $course, Request $request): StreamedResponse
    {
        $this->checkPermission('OPEN', $course, [], true);

        $domPdf = new Dompdf([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
        ]);

        $domPdf->loadHtml($this->manager->generateFromTemplate(
            $course,
            $request->server->get('DOCUMENT_ROOT').$request->getBasePath(),
            $request->getLocale()
        ));

        // Render the HTML as PDF
        $domPdf->render();

        return new StreamedResponse(function () use ($domPdf) {
            echo $domPdf->output();
        }, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename='.TextNormalizer::toKey($course->getName()).'.pdf',
        ]);
    }

    /**
     * @Route("/{id}/sessions", name="apiv2_cursus_course_list_sessions", methods={"GET"})
     * @EXT\ParamConverter("course", class="ClarolineCursusBundle:Course", options={"mapping": {"id": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     */
    public function listSessionsAction(User $user, Course $course, Request $request): JsonResponse
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
     */
    public function listUsersAction(Course $course, $type, Request $request): JsonResponse
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
     */
    public function addUsersAction(Course $course, $type, Request $request): JsonResponse
    {
        $this->checkPermission('EDIT', $course, [], true);

        $users = $this->decodeIdsString($request, User::class);
        $cursusUsers = $this->manager->addUsersToCursus($course, $users, intval($type));

        return new JsonResponse(array_map(function (CursusUser $cursusUser) {
            return $this->serializer->serialize($cursusUser);
        }, $cursusUsers));
    }

    /**
     * @Route("/{id}/users/{type}", name="apiv2_cursus_course_remove_users", methods={"DELETE"})
     * @EXT\ParamConverter("course", class="ClarolineCursusBundle:Course", options={"mapping": {"id": "uuid"}})
     */
    public function removeUsersAction(Course $course, Request $request): JsonResponse
    {
        $this->checkPermission('EDIT', $course, [], true);

        $cursusUsers = $this->decodeIdsString($request, CursusUser::class);
        $this->manager->deleteEntities($cursusUsers);

        return new JsonResponse();
    }

    /**
     * @Route("/{id}/groups/{type}", name="apiv2_cursus_course_list_groups", methods={"GET"})
     * @EXT\ParamConverter("course", class="ClarolineCursusBundle:Course", options={"mapping": {"id": "uuid"}})
     */
    public function listGroupsAction(Course $course, $type, Request $request): JsonResponse
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
     */
    public function addGroupsAction(Course $course, $type, Request $request): JsonResponse
    {
        $this->checkPermission('EDIT', $course, [], true);

        $groups = $this->decodeIdsString($request, Group::class);
        $cursusGroups = $this->manager->addGroupsToCursus($course, $groups, intval($type));

        return new JsonResponse(array_map(function (CursusGroup $cursusGroup) {
            return $this->serializer->serialize($cursusGroup);
        }, $cursusGroups));
    }

    /**
     * @Route("/{id}/groups/{type}", name="apiv2_cursus_course_remove_groups", methods={"DELETE"})
     */
    public function removeGroupsAction(Course $course, Request $request): JsonResponse
    {
        $this->checkPermission('EDIT', $course, [], true);

        $cursusGroups = $this->decodeIdsString($request, CursusGroup::class);
        $this->manager->deleteEntities($cursusGroups);

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
