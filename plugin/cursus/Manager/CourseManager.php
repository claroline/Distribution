<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\RoleManager;
use Claroline\CoreBundle\Manager\Template\TemplateManager;
use Claroline\CursusBundle\Entity\AbstractRegistrationQueue;
use Claroline\CursusBundle\Entity\Course;
use Claroline\CursusBundle\Entity\CourseRegistrationQueue;
use Claroline\CursusBundle\Entity\CourseSessionRegistrationQueue;
use Claroline\CursusBundle\Entity\CourseSessionUser;
use Claroline\CursusBundle\Entity\Cursus;
use Claroline\CursusBundle\Entity\CursusGroup;
use Claroline\CursusBundle\Entity\CursusUser;
use Claroline\CursusBundle\Event\Log\LogCourseQueueCreateEvent;
use Claroline\CursusBundle\Event\Log\LogCursusGroupRegistrationEvent;
use Claroline\CursusBundle\Event\Log\LogCursusUserRegistrationEvent;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class CourseManager
{
    /** @var TokenStorageInterface */
    private $tokenStorage;
    /** @var EventDispatcherInterface */
    private $eventDispatcher;
    /** @var ObjectManager */
    private $om;
    /** @var TemplateManager */
    private $templateManager;
    /** @var RoleManager */
    private $roleManager;
    /** @var SessionManager */
    private $sessionManager;

    private $cursusUserRepo;
    private $cursusGroupRepo;
    private $courseQueueRepo;

    public function __construct(
        TokenStorageInterface $tokenStorage,
        EventDispatcherInterface $eventDispatcher,
        ObjectManager $om,
        TemplateManager $templateManager,
        RoleManager $roleManager,
        SessionManager $sessionManager
    ) {
        $this->eventDispatcher = $eventDispatcher;
        $this->om = $om;
        $this->roleManager = $roleManager;
        $this->tokenStorage = $tokenStorage;
        $this->templateManager = $templateManager;
        $this->sessionManager = $sessionManager;

        $this->cursusUserRepo = $om->getRepository(CursusUser::class);
        $this->cursusGroupRepo = $om->getRepository(CursusGroup::class);
        $this->courseQueueRepo = $om->getRepository(CourseRegistrationQueue::class);
    }

    public function generateFromTemplate(Course $course, string $basePath, string $locale)
    {
        $placeholders = [
            'course_name' => $course->getName(),
            'course_code' => $course->getCode(),
            'course_description' => $course->getDescription(),
            'course_poster_url' => $basePath.'/'.$course->getPoster(),
            'course_default_duration' => $course->getDefaultSessionDuration(),
            'course_public_registration' => $course->getPublicRegistration(),
            'course_max_users' => $course->getMaxUsers(),

            // TODO : add info about default session
        ];

        $content = $this->templateManager->getTemplate('training_course', $placeholders, $locale);

        // todo : append sessions templates

        return $content;
    }

    /**
     * Adds users to a cursus.
     */
    public function addUsersToCursus(Cursus $cursus, array $users, $type = CursusUser::TYPE_LEARNER): array
    {
        $results = [];
        $registrationDate = new \DateTime();
        $workspace = $cursus->getWorkspace();
        $role = $workspace ? $this->roleManager->getCollaboratorRole($workspace) : null;

        $this->om->startFlushSuite();

        foreach ($users as $user) {
            $cursusUser = $this->cursusUserRepo->findOneBy(['cursus' => $cursus, 'user' => $user, 'userType' => $type]);

            if (empty($cursusUser)) {
                $cursusUser = new CursusUser();
                $cursusUser->setCursus($cursus);
                $cursusUser->setUser($user);
                $cursusUser->setUserType($type);
                $cursusUser->setRegistrationDate($registrationDate);

                // Registers user to workspace if one is associated to cursus
                if ($role) {
                    $this->roleManager->associateRole($user, $role);
                }

                $this->om->persist($cursusUser);

                $this->eventDispatcher->dispatch('log', new LogCursusUserRegistrationEvent($cursusUser));

                $results[] = $cursusUser;
            }
        }
        $this->om->endFlushSuite();

        return $results;
    }

    /**
     * Adds groups to a cursus.
     */
    public function addGroupsToCursus(Cursus $cursus, array $groups, $type = CursusGroup::TYPE_LEARNER): array
    {
        $results = [];
        $registrationDate = new \DateTime();
        $workspace = $cursus->getWorkspace();
        $role = $workspace ? $this->roleManager->getCollaboratorRole($workspace) : null;

        $this->om->startFlushSuite();

        foreach ($groups as $group) {
            $cursusGroup = $this->cursusGroupRepo->findOneBy(['cursus' => $cursus, 'group' => $group, 'groupType' => $type]);

            if (empty($cursusGroup)) {
                $cursusGroup = new CursusGroup();
                $cursusGroup->setCursus($cursus);
                $cursusGroup->setGroup($group);
                $cursusGroup->setGroupType($type);
                $cursusGroup->setRegistrationDate($registrationDate);

                // Registers group to workspace if one is associated to cursus
                if ($role) {
                    $this->roleManager->associateRole($group, $role);
                }

                $this->om->persist($cursusGroup);

                $this->eventDispatcher->dispatch('log', new LogCursusGroupRegistrationEvent($cursusGroup));

                $results[] = $cursusGroup;
            }
        }
        $this->om->endFlushSuite();

        return $results;
    }

    /**
     * Registers an user to default session of a course if allowed.
     *
     * @return CourseRegistrationQueue|CourseSessionUser|CourseSessionRegistrationQueue|null
     */
    public function registerUserToCourse(Course $course, User $user, bool $skipValidation = false)
    {
        $validationMask = 0;

        if (!$skipValidation) {
            if ($course->getRegistrationValidation()) {
                $validationMask += AbstractRegistrationQueue::WAITING;
            }
            if ($course->getUserValidation()) {
                $validationMask += AbstractRegistrationQueue::WAITING_USER;
            }
            if (0 < count($course->getValidators())) {
                $validationMask += AbstractRegistrationQueue::WAITING_VALIDATOR;
            }
            if ($course->getOrganizationValidation()) {
                $validationMask += AbstractRegistrationQueue::WAITING_ORGANIZATION;
            }
        }

        if (0 < $validationMask) {
            $courseQueue = $this->courseQueueRepo->findOneBy(['course' => $course, 'user' => $user]);

            if (!$courseQueue) {
                $courseQueue = $this->createCourseQueue($course, $user, $validationMask);
            }

            return $courseQueue;
        }

        $defaultSession = $course->getDefaultSession();
        $result = null;

        if ($defaultSession && $defaultSession->isActive()) {
            $result = $this->sessionManager->registerUserToSession($defaultSession, $user, $skipValidation);
        }

        return $result;
    }

    /**
     * Creates a queue for course and user.
     */
    public function createCourseQueue(Course $course, User $user, int $mask = 0, \DateTime $date = null): CourseRegistrationQueue
    {
        $this->om->startFlushSuite();
        $queue = new CourseRegistrationQueue();
        $queue->setUser($user);
        $queue->setCourse($course);
        $queue->setStatus($mask);

        if ($date) {
            $queue->setApplicationDate($date);
        }
        $this->om->persist($queue);

        $this->eventDispatcher->dispatch('log', new LogCourseQueueCreateEvent($queue));

        $this->om->endFlushSuite();

        return $queue;
    }
}
