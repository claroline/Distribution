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

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\ApiManager;
use Claroline\CursusBundle\Entity\Course;
use Claroline\CursusBundle\Entity\CourseSession;
use Claroline\CursusBundle\Entity\Cursus;
use Claroline\CursusBundle\Entity\SessionEvent;
use Claroline\CursusBundle\Event\Log\LogCourseEditEvent;
use Claroline\CursusBundle\Event\Log\LogCourseSessionEditEvent;
use Claroline\CursusBundle\Event\Log\LogCursusEditEvent;
use Claroline\CursusBundle\Event\Log\LogSessionEventEditEvent;
use Claroline\CursusBundle\Form\CourseSessionType;
use Claroline\CursusBundle\Form\CourseType;
use Claroline\CursusBundle\Form\CursusType;
use Claroline\CursusBundle\Form\SessionEventType;
use Claroline\CursusBundle\Manager\CursusManager;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\Serializer;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Tag("security.secure_service")
 * @SEC\PreAuthorize("canOpenAdminTool('claroline_cursus_tool')")
 */
class AdminManagementController extends Controller
{
    private $apiManager;
    private $cursusManager;
    private $eventDispatcher;
    private $request;
    private $serializer;
    private $translator;

    /**
     * @DI\InjectParams({
     *     "apiManager"      = @DI\Inject("claroline.manager.api_manager"),
     *     "cursusManager"   = @DI\Inject("claroline.manager.cursus_manager"),
     *     "eventDispatcher" = @DI\Inject("event_dispatcher"),
     *     "request"         = @DI\Inject("request"),
     *     "serializer"      = @DI\Inject("jms_serializer"),
     *     "translator"      = @DI\Inject("translator")
     * })
     */
    public function __construct(
        ApiManager $apiManager,
        CursusManager $cursusManager,
        EventDispatcherInterface $eventDispatcher,
        Request $request,
        Serializer $serializer,
        TranslatorInterface $translator
    ) {
        $this->apiManager = $apiManager;
        $this->cursusManager = $cursusManager;
        $this->eventDispatcher = $eventDispatcher;
        $this->request = $request;
        $this->serializer = $serializer;
        $this->translator = $translator;
    }

    /**
     * @EXT\Route(
     *     "/admin/management/index",
     *     name="claro_cursus_admin_management_index"
     * )
     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
     * @EXT\Template()
     */
    public function indexAction()
    {
        return [];
    }

    /**
     * @EXT\Route(
     *     "/api/cursus/create/form",
     *     name="api_get_cursus_creation_form",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Returns cursus creation form
     */
    public function getCursusCreationFormAction()
    {
        $formType = new CursusType();
        $formType->enableApi();
        $form = $this->createForm($formType);

        return $this->apiManager->handleFormView(
            'ClarolineCursusBundle:API:AdminManagement\CursusCreateForm.html.twig',
            $form
        );
    }

    /**
     * @EXT\Route(
     *     "/api/cursus/create",
     *     name="api_post_cursus_creation",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Creates a cursus
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function postCursusCreationAction()
    {
        $formType = new CursusType();
        $formType->enableApi();
        $cursus = new Cursus();
        $form = $this->createForm($formType, $cursus);
        $form->submit($this->request);

        if ($form->isValid()) {
            $color = $form->get('color')->getData();
            $createdCursus = $this->cursusManager->createCursus(
                $cursus->getTitle(),
                $cursus->getCode(),
                null,
                null,
                $cursus->getDescription(),
                $cursus->isBlocking(),
                $cursus->getIcon(),
                $color,
                $cursus->getWorkspace()
            );
            $serializedCursus = $this->serializer->serialize(
                $createdCursus,
                'json',
                SerializationContext::create()->setGroups(['api_cursus'])
            );

            return new JsonResponse($serializedCursus, 200);
        } else {
            $options = [
                'http_code' => 400,
                'extra_parameters' => null,
                'serializer_group' => 'api_cursus',
            ];

            return $this->apiManager->handleFormView(
                'ClarolineCursusBundle:API:AdminManagement\CursusCreateForm.html.twig',
                $form,
                $options
            );
        }
    }

    /**
     * @EXT\Route(
     *     "/api/cursus/{parent}/child/create",
     *     name="api_post_cursus_child_creation",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Creates a child cursus
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function postCursusChildCreationAction(Cursus $parent)
    {
        $formType = new CursusType();
        $formType->enableApi();
        $cursus = new Cursus();
        $form = $this->createForm($formType, $cursus);
        $form->submit($this->request);

        if ($form->isValid()) {
            $color = $form->get('color')->getData();
            $createdCursus = $this->cursusManager->createCursus(
                $cursus->getTitle(),
                $cursus->getCode(),
                $parent,
                null,
                $cursus->getDescription(),
                $cursus->isBlocking(),
                $cursus->getIcon(),
                $color,
                $cursus->getWorkspace()
            );
            $serializedCursus = $this->serializer->serialize(
                $createdCursus,
                'json',
                SerializationContext::create()->setGroups(['api_cursus'])
            );

            return new JsonResponse($serializedCursus, 200);
        } else {
            $options = [
                'http_code' => 400,
                'extra_parameters' => null,
                'serializer_group' => 'api_cursus',
            ];

            return $this->apiManager->handleFormView(
                'ClarolineCursusBundle:API:AdminManagement\CursusCreateForm.html.twig',
                $form,
                $options
            );
        }
    }

    /**
     * @EXT\Route(
     *     "/api/cursus/{cursus}/edit/form",
     *     name="api_get_cursus_edition_form",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Returns the cursus edition form
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getCursusEditionFormAction(Cursus $cursus)
    {
        $formType = new CursusType($cursus);
        $formType->enableApi();
        $form = $this->createForm($formType, $cursus);

        return $this->apiManager->handleFormView(
            'ClarolineCursusBundle:API:AdminManagement\CursusEditForm.html.twig',
            $form
        );
    }

    /**
     * @EXT\Route(
     *     "/api/cursus/{cursus}/edit",
     *     name="api_put_cursus_edition",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Edits a cursus
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function putCursusEditionAction(Cursus $cursus)
    {
        $formType = new CursusType($cursus);
        $formType->enableApi();
        $form = $this->createForm($formType, $cursus);
        $form->submit($this->request);

        if ($form->isValid()) {
            $color = $form->get('color')->getData();
            $details = $cursus->getDetails();

            if (is_null($details)) {
                $details = [];
            }
            $details['color'] = $color;
            $cursus->setDetails($details);
            $this->cursusManager->persistCursus($cursus);
            $event = new LogCursusEditEvent($cursus);
            $this->eventDispatcher->dispatch('log', $event);
            $serializedCursus = $this->serializer->serialize(
                $cursus,
                'json',
                SerializationContext::create()->setGroups(['api_cursus'])
            );

            return new JsonResponse($serializedCursus, 200);
        } else {
            $options = [
                'http_code' => 400,
                'extra_parameters' => null,
                'serializer_group' => 'api_cursus',
            ];

            return $this->apiManager->handleFormView(
                'ClarolineCursusBundle:API:AdminManagement\CursusEditForm.html.twig',
                $form,
                $options
            );
        }
    }

    /**
     * @EXT\Route(
     *     "/api/cursus/{cursus}/delete",
     *     name="api_delete_cursus",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Deletes cursus
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function deleteCursusAction(Cursus $cursus)
    {
        $serializedCursus = $this->serializer->serialize(
            $cursus,
            'json',
            SerializationContext::create()->setGroups(['api_cursus'])
        );
        $this->cursusManager->deleteCursus($cursus);

        return new JsonResponse($serializedCursus, 200);
    }

    /**
     * @EXT\Route(
     *     "/api/cursus/import",
     *     name="api_post_cursus_import",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
     */
    public function postCursusImportAction()
    {
        $file = $this->request->files->get('archive');
        $zip = new \ZipArchive();

        if (empty($file) || !$zip->open($file) || !$zip->getStream('cursus.json') || !$zip->getStream('courses.json')) {
            return new JsonResponse('invalid file', 500);
        }
        $coursesStream = $zip->getStream('courses.json');
        $coursesContents = '';

        while (!feof($coursesStream)) {
            $coursesContents .= fread($coursesStream, 2);
        }
        fclose($coursesStream);
        $courses = json_decode($coursesContents, true);
        $importedCourses = $this->cursusManager->importCourses($courses);
        $iconsDir = $this->container->getParameter('claroline.param.thumbnails_directory').'/';

        for ($i = 0; $i < $zip->numFiles; ++$i) {
            $name = $zip->getNameIndex($i);

            if (strpos($name, 'icons/') !== 0) {
                continue;
            }
            $iconFileName = $iconsDir.substr($name, 6);
            $stream = $zip->getStream($name);
            $destStream = fopen($iconFileName, 'w');

            while ($data = fread($stream, 1024)) {
                fwrite($destStream, $data);
            }
            fclose($stream);
            fclose($destStream);
        }
        $cursusStream = $zip->getStream('cursus.json');
        $cursuscontents = '';

        while (!feof($cursusStream)) {
            $cursuscontents .= fread($cursusStream, 2);
        }
        fclose($cursusStream);
        $zip->close();
        $cursus = json_decode($cursuscontents, true);
        $rootCursus = $this->cursusManager->importCursus($cursus, $importedCourses);
        $serializedCursus = $this->serializer->serialize(
            $rootCursus,
            'json',
            SerializationContext::create()->setGroups(['api_cursus'])
        );

        return new JsonResponse($serializedCursus, 200);
    }

    /**
     * @EXT\Route(
     *     "/api/course/create/form",
     *     name="api_get_course_creation_form",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Returns course creation form
     */
    public function getCourseCreationFormAction(User $user)
    {
        $formType = new CourseType($user, $this->cursusManager, $this->translator);
        $formType->enableApi();
        $course = new Course();
        $form = $this->createForm($formType, $course);

        return $this->apiManager->handleFormView(
            'ClarolineCursusBundle:API:AdminManagement\CourseCreateForm.html.twig',
            $form
        );
    }

    /**
     * @EXT\Route(
     *     "/api/cursus/{cursus}/course/create",
     *     name="api_post_cursus_course_creation",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function postCursusCourseCreateAction(User $user, Cursus $cursus)
    {
        $formType = new CourseType($user, $this->cursusManager, $this->translator);
        $formType->enableApi();
        $course = new Course();
        $form = $this->createForm($formType, $course);
        $form->submit($this->request);

        if ($form->isValid()) {
//            $icon = $form->get('icon')->getData();
//
//            if (!is_null($icon)) {
//                $hashName = $this->cursusManager->saveIcon($icon);
//                $course->setIcon($hashName);
//            }
            $createdCourse = $this->cursusManager->createCourse(
                $course->getTitle(),
                $course->getCode(),
                $course->getDescription(),
                $course->getPublicRegistration(),
                $course->getPublicUnregistration(),
                $course->getRegistrationValidation(),
                $course->getTutorRoleName(),
                $course->getLearnerRoleName(),
                $course->getWorkspaceModel(),
                $course->getWorkspace(),
                $course->getIcon(),
                $course->getUserValidation(),
                $course->getOrganizationValidation(),
                $course->getMaxUsers(),
                $course->getDefaultSessionDuration(),
                $course->getWithSessionEvent(),
                $course->getValidators()
            );
            $createdCursus = $this->cursusManager->addCoursesToCursus($cursus, [$createdCourse]);
            $serializedCursus = $this->serializer->serialize(
                $createdCursus,
                'json',
                SerializationContext::create()->setGroups(['api_cursus'])
            );

            return new JsonResponse($serializedCursus, 200);
        } else {
            $options = [
                'http_code' => 400,
                'extra_parameters' => null,
                'serializer_group' => 'api_cursus',
            ];

            return $this->apiManager->handleFormView(
                'ClarolineCursusBundle:API:AdminManagement\CourseCreateForm.html.twig',
                $form,
                $options
            );
        }
    }

    /**
     * @EXT\Route(
     *     "/api/course/create",
     *     name="api_post_course_creation",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function postCourseCreateAction(User $user)
    {
        $formType = new CourseType($user, $this->cursusManager, $this->translator);
        $formType->enableApi();
        $course = new Course();
        $form = $this->createForm($formType, $course);
        $form->submit($this->request);

        if ($form->isValid()) {
//            $icon = $form->get('icon')->getData();
//
//            if (!is_null($icon)) {
//                $hashName = $this->cursusManager->saveIcon($icon);
//                $course->setIcon($hashName);
//            }
            $createdCourse = $this->cursusManager->createCourse(
                $course->getTitle(),
                $course->getCode(),
                $course->getDescription(),
                $course->getPublicRegistration(),
                $course->getPublicUnregistration(),
                $course->getRegistrationValidation(),
                $course->getTutorRoleName(),
                $course->getLearnerRoleName(),
                $course->getWorkspaceModel(),
                $course->getWorkspace(),
                $course->getIcon(),
                $course->getUserValidation(),
                $course->getOrganizationValidation(),
                $course->getMaxUsers(),
                $course->getDefaultSessionDuration(),
                $course->getWithSessionEvent(),
                $course->getValidators()
            );
            $serializedCourse = $this->serializer->serialize(
                $createdCourse,
                'json',
                SerializationContext::create()->setGroups(['api_cursus'])
            );

            return new JsonResponse($serializedCourse, 200);
        } else {
            $options = [
                'http_code' => 400,
                'extra_parameters' => null,
                'serializer_group' => 'api_cursus',
            ];

            return $this->apiManager->handleFormView(
                'ClarolineCursusBundle:API:AdminManagement\CourseCreateForm.html.twig',
                $form,
                $options
            );
        }
    }

    /**
     * @EXT\Route(
     *     "/api/cursus/{cursus}/course/{course}/add",
     *     name="api_post_cursus_course_add",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function postCursusCourseAddAction(Cursus $cursus, Course $course)
    {
        $createdCursus = $this->cursusManager->addCoursesToCursus($cursus, [$course]);
        $serializedCursus = $this->serializer->serialize(
            $createdCursus,
            'json',
            SerializationContext::create()->setGroups(['api_cursus'])
        );

        return new JsonResponse($serializedCursus, 200);
    }

    /**
     * @EXT\Route(
     *     "/api/course/{course}/edit/form",
     *     name="api_get_course_edition_form",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Returns the course edition form
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getCourseEditionFormAction(User $user, Course $course)
    {
        $formType = new CourseType($user, $this->cursusManager, $this->translator);
        $formType->enableApi();
        $form = $this->createForm($formType, $course);

        return $this->apiManager->handleFormView(
            'ClarolineCursusBundle:API:AdminManagement\CourseEditForm.html.twig',
            $form
        );
    }

    /**
     * @EXT\Route(
     *     "/api/course/{course}/edit",
     *     name="api_put_course_edition",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Edits a course
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function putCourseEditionAction(User $user, Course $course)
    {
        $formType = new CourseType($user, $this->cursusManager, $this->translator);
        $formType->enableApi();
        $form = $this->createForm($formType, $course);
        $form->submit($this->request);

        if ($form->isValid()) {
//            $icon = $form->get('icon')->getData();
//
//            if (!is_null($icon)) {
//                $hashName = $this->cursusManager->changeIcon($course, $icon);
//                $course->setIcon($hashName);
//            }
            $this->cursusManager->persistCourse($course);
            $event = new LogCourseEditEvent($course);
            $this->eventDispatcher->dispatch('log', $event);
            $serializedCourse = $this->serializer->serialize(
                $course,
                'json',
                SerializationContext::create()->setGroups(['api_cursus'])
            );

            return new JsonResponse($serializedCourse, 200);
        } else {
            $options = [
                'http_code' => 400,
                'extra_parameters' => null,
                'serializer_group' => 'api_cursus',
            ];

            return $this->apiManager->handleFormView(
                'ClarolineCursusBundle:API:AdminManagement\CourseEditForm.html.twig',
                $form,
                $options
            );
        }
    }

    /**
     * @EXT\Route(
     *     "/api/course/{course}/delete",
     *     name="api_delete_course",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Deletes course
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function deleteCourseAction(Course $course)
    {
        $serializedCourse = $this->serializer->serialize(
            $course,
            'json',
            SerializationContext::create()->setGroups(['api_cursus'])
        );
        $this->cursusManager->deleteCourse($course);

        return new JsonResponse($serializedCourse, 200);
    }

    /**
     * @EXT\Route(
     *     "/api/courses/import",
     *     name="api_post_courses_import",
     *     options={"expose"=true}
     * )
     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
     */
    public function postCoursesImportAction()
    {
        $file = $this->request->files->get('archive');
        $zip = new \ZipArchive();

        if (empty($file) || !$zip->open($file) || !$zip->getStream('courses.json')) {
            return new JsonResponse('invalid file', 500);
        }
        $coursesStream = $zip->getStream('courses.json');
        $coursesContents = '';

        while (!feof($coursesStream)) {
            $coursesContents .= fread($coursesStream, 2);
        }
        fclose($coursesStream);
        $courses = json_decode($coursesContents, true);
        $importedCourses = $this->cursusManager->importCourses($courses, false);
        $iconsDir = $this->container->getParameter('claroline.param.thumbnails_directory').'/';

        for ($i = 0; $i < $zip->numFiles; ++$i) {
            $name = $zip->getNameIndex($i);

            if (strpos($name, 'icons/') !== 0) {
                continue;
            }
            $iconFileName = $iconsDir.substr($name, 6);
            $stream = $zip->getStream($name);
            $destStream = fopen($iconFileName, 'w');

            while ($data = fread($stream, 1024)) {
                fwrite($destStream, $data);
            }
            fclose($stream);
            fclose($destStream);
        }
        $zip->close();
        $serializedCourses = $this->serializer->serialize(
            $importedCourses,
            'json',
            SerializationContext::create()->setGroups(['api_cursus'])
        );

        return new JsonResponse($serializedCourses, 200);
    }

    /**
     * @EXT\Route(
     *     "/api/course/{course}/get/by/id",
     *     name="api_get_course_by_id",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Returns the course
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getCourseByIdAction(Course $course)
    {
        $serializedCourse = $this->serializer->serialize(
            $course,
            'json',
            SerializationContext::create()->setGroups(['api_cursus'])
        );

        return new JsonResponse($serializedCourse, 200);
    }

    /**
     * @EXT\Route(
     *     "/api/session/{session}/get/by/id",
     *     name="api_get_session_by_id",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Returns the session
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getSessionByIdAction(CourseSession $session)
    {
        $serializedSession = $this->serializer->serialize(
            $session,
            'json',
            SerializationContext::create()->setGroups(['api_cursus'])
        );

        return new JsonResponse($serializedSession, 200);
    }

    /**
     * @EXT\Route(
     *     "/api/course/{course}/session/create/form",
     *     name="api_get_session_creation_form",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Returns session creation form
     */
    public function getSessionCreationFormAction(Course $course)
    {
        $formType = new CourseSessionType($this->cursusManager, $this->translator);
        $formType->enableApi();
        $session = new CourseSession();
        $session->setCourse($course);
        $session->setPublicRegistration($course->getPublicRegistration());
        $session->setPublicUnregistration($course->getPublicUnregistration());
        $session->setMaxUsers($course->getMaxUsers());
        $session->setUserValidation($course->getUserValidation());
        $session->setOrganizationValidation($course->getOrganizationValidation());
        $session->setRegistrationValidation($course->getRegistrationValidation());
        $startDate = new \DateTime();
        $session->setStartDate($startDate);
        $endDate = clone $startDate;
        $endDate->add(new \DateInterval('P'.$course->getDefaultSessionDuration().'D'));
        $session->setEndDate($endDate);
        $form = $this->createForm($formType, $session);

        return $this->apiManager->handleFormView(
            'ClarolineCursusBundle:API:AdminManagement\SessionCreateForm.html.twig',
            $form
        );
    }

    /**
     * @EXT\Route(
     *     "/api/course/{course}/session/create",
     *     name="api_post_session_creation",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function postSessionCreateAction(Course $course)
    {
        $formType = new CourseSessionType($this->cursusManager, $this->translator);
        $formType->enableApi();
        $session = new CourseSession();
        $form = $this->createForm($formType, $session);
        $form->submit($this->request);

        if ($form->isValid()) {
            $createdSession = $this->cursusManager->createCourseSession(
                $course,
                $session->getName(),
                $session->getDescription(),
                $session->getCursus(),
                null,
                $session->getStartDate(),
                $session->getEndDate(),
                $session->isDefaultSession(),
                $session->getPublicRegistration(),
                $session->getPublicUnregistration(),
                $session->getRegistrationValidation(),
                $session->getUserValidation(),
                $session->getOrganizationValidation(),
                $session->getMaxUsers(),
                $session->getType(),
                $session->getValidators()
            );
            $serializedSession = $this->serializer->serialize(
                $createdSession,
                'json',
                SerializationContext::create()->setGroups(['api_cursus'])
            );

            return new JsonResponse($serializedSession, 200);
        } else {
            $options = [
                'http_code' => 400,
                'extra_parameters' => null,
                'serializer_group' => 'api_cursus',
            ];

            return $this->apiManager->handleFormView(
                'ClarolineCursusBundle:API:AdminManagement\SessionCreateForm.html.twig',
                $form,
                $options
            );
        }
    }

    /**
     * @EXT\Route(
     *     "/api/session/{session}/edit/form",
     *     name="api_get_session_edition_form",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Returns the session edition form
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getSessionEditionFormAction(CourseSession $session)
    {
        $formType = new CourseSessionType($this->cursusManager, $this->translator);
        $formType->enableApi();
        $form = $this->createForm($formType, $session);

        return $this->apiManager->handleFormView(
            'ClarolineCursusBundle:API:AdminManagement\SessionEditForm.html.twig',
            $form
        );
    }

    /**
     * @EXT\Route(
     *     "/api/session/{session}/edit",
     *     name="api_put_session_edition",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Edits a session
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function putSessionEditionAction(CourseSession $session)
    {
        $formType = new CourseSessionType($this->cursusManager, $this->translator);
        $formType->enableApi();
        $form = $this->createForm($formType, $session);
        $form->submit($this->request);

        if ($form->isValid()) {
//            $icon = $form->get('icon')->getData();
//
//            if (!is_null($icon)) {
//                $hashName = $this->cursusManager->changeIcon($course, $icon);
//                $course->setIcon($hashName);
//            }
            $this->cursusManager->persistCourseSession($session);
            $event = new LogCourseSessionEditEvent($session);
            $this->eventDispatcher->dispatch('log', $event);
            $serializedSession = $this->serializer->serialize(
                $session,
                'json',
                SerializationContext::create()->setGroups(['api_cursus'])
            );

            return new JsonResponse($serializedSession, 200);
        } else {
            $options = [
                'http_code' => 400,
                'extra_parameters' => null,
                'serializer_group' => 'api_cursus',
            ];

            return $this->apiManager->handleFormView(
                'ClarolineCursusBundle:API:AdminManagement\SessionEditForm.html.twig',
                $form,
                $options
            );
        }
    }

    /**
     * @EXT\Route(
     *     "/api/session/{session}/mode/{mode}/delete",
     *     name="api_delete_session",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Deletes session
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function deleteSessionAction(CourseSession $session, $mode = 0)
    {
        $serializedSession = $this->serializer->serialize(
            $session,
            'json',
            SerializationContext::create()->setGroups(['api_cursus'])
        );
        $withWorkspace = (intval($mode) === 1);
        $this->cursusManager->deleteCourseSession($session, $withWorkspace);

        return new JsonResponse($serializedSession, 200);
    }

    /**
     * @EXT\Route(
     *     "/api/course/{course}/session/{session}/default/reset",
     *     name="api_put_session_default_reset",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Deletes session
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function resetSessionsDefaultAction(Course $course, CourseSession $session)
    {
        $this->cursusManager->resetDefaultSessionByCourse($course, $session);

        return new JsonResponse('success', 200);
    }

    /**
     * @EXT\Route(
     *     "/api/session/{session}/event/create/form",
     *     name="api_get_session_event_creation_form",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Returns session event creation form
     */
    public function getSessionEventCreationFormAction(CourseSession $session)
    {
        $formType = new SessionEventType();
        $formType->enableApi();
        $sessionEvent = new SessionEvent();
        $sessionEvent->setSession($session);
        $startDate = new \DateTime();
        $sessionEvent->setStartDate($startDate);
        $sessionEvent->setEndDate($session->getEndDate());
        $form = $this->createForm($formType, $sessionEvent);

        return $this->apiManager->handleFormView(
            'ClarolineCursusBundle:API:AdminManagement\SessionEventCreateForm.html.twig',
            $form
        );
    }

    /**
     * @EXT\Route(
     *     "/api/session/{session}/event/create",
     *     name="api_post_session_event_creation",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function postSessionEventCreateAction(CourseSession $session)
    {
        $formType = new SessionEventType();
        $formType->enableApi();
        $sessionEvent = new SessionEvent();
        $form = $this->createForm($formType, $sessionEvent);
        $form->submit($this->request);

        if ($form->isValid()) {
            $createdSessionEvent = $this->cursusManager->createSessionEvent(
                $session,
                $sessionEvent->getName(),
                $sessionEvent->getDescription(),
                $sessionEvent->getStartDate(),
                $sessionEvent->getEndDate(),
                $sessionEvent->getLocation()
            );
            $serializedSessionEvent = $this->serializer->serialize(
                $createdSessionEvent,
                'json',
                SerializationContext::create()->setGroups(['api_cursus'])
            );

            return new JsonResponse($serializedSessionEvent, 200);
        } else {
            $options = [
                'http_code' => 400,
                'extra_parameters' => null,
                'serializer_group' => 'api_cursus',
            ];

            return $this->apiManager->handleFormView(
                'ClarolineCursusBundle:API:AdminManagement\SessionEventCreateForm.html.twig',
                $form,
                $options
            );
        }
    }

    /**
     * @EXT\Route(
     *     "/api/session/event/{sessionEvent}/edit/form",
     *     name="api_get_session_event_edition_form",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Returns the session event edition form
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getSessionEventEditionFormAction(SessionEvent $sessionEvent)
    {
        $formType = new SessionEventType();
        $formType->enableApi();
        $form = $this->createForm($formType, $sessionEvent);

        return $this->apiManager->handleFormView(
            'ClarolineCursusBundle:API:AdminManagement\SessionEventEditForm.html.twig',
            $form
        );
    }

    /**
     * @EXT\Route(
     *     "/api/session/event/{sessionEvent}/edit",
     *     name="api_put_session_event_edition",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Edits a session event
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function putSessionEventEditionAction(SessionEvent $sessionEvent)
    {
        $formType = new SessionEventType();
        $formType->enableApi();
        $form = $this->createForm($formType, $sessionEvent);
        $form->submit($this->request);

        if ($form->isValid()) {
            $this->cursusManager->persistSessionEvent($sessionEvent);
            $event = new LogSessionEventEditEvent($sessionEvent);
            $this->eventDispatcher->dispatch('log', $event);
            $serializedSessionEvent = $this->serializer->serialize(
                $sessionEvent,
                'json',
                SerializationContext::create()->setGroups(['api_cursus'])
            );

            return new JsonResponse($serializedSessionEvent, 200);
        } else {
            $options = [
                'http_code' => 400,
                'extra_parameters' => null,
                'serializer_group' => 'api_cursus',
            ];

            return $this->apiManager->handleFormView(
                'ClarolineCursusBundle:API:AdminManagement\SessionEventEditForm.html.twig',
                $form,
                $options
            );
        }
    }

    /**
     * @EXT\Route(
     *     "/api/session/event/{sessionEvent}/delete",
     *     name="api_delete_session_event",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * Deletes session event
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function deleteSessionEventAction(SessionEvent $sessionEvent)
    {
        $serializedSessionEvent = $this->serializer->serialize(
            $sessionEvent,
            'json',
            SerializationContext::create()->setGroups(['api_cursus'])
        );
        $this->cursusManager->deleteSessionEvent($sessionEvent);

        return new JsonResponse($serializedSessionEvent, 200);
    }
}
