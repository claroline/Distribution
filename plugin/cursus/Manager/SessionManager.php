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
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\Template\Template;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\MailManager;
use Claroline\CoreBundle\Manager\RoleManager;
use Claroline\CoreBundle\Manager\Template\TemplateManager;
use Claroline\CoreBundle\Manager\Workspace\WorkspaceManager;
use Claroline\CursusBundle\Entity\AbstractRegistrationQueue;
use Claroline\CursusBundle\Entity\Course;
use Claroline\CursusBundle\Entity\CourseSession;
use Claroline\CursusBundle\Entity\CourseSessionGroup;
use Claroline\CursusBundle\Entity\CourseSessionRegistrationQueue;
use Claroline\CursusBundle\Entity\CourseSessionUser;
use Claroline\CursusBundle\Event\Log\LogSessionGroupRegistrationEvent;
use Claroline\CursusBundle\Event\Log\LogSessionQueueCreateEvent;
use Claroline\CursusBundle\Event\Log\LogSessionQueueUserValidateEvent;
use Claroline\CursusBundle\Event\Log\LogSessionQueueValidateEvent;
use Claroline\CursusBundle\Event\Log\LogSessionQueueValidatorValidateEvent;
use Claroline\CursusBundle\Event\Log\LogSessionUserRegistrationEvent;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class SessionManager
{
    /** @var EventDispatcherInterface */
    private $eventDispatcher;
    /** @var MailManager */
    private $mailManager;
    /** @var ObjectManager */
    private $om;
    /** @var RoleManager */
    private $roleManager;
    /** @var UrlGeneratorInterface */
    private $router;
    /** @var TemplateManager */
    private $templateManager;
    /** @var TokenStorageInterface */
    private $tokenStorage;
    /** @var WorkspaceManager */
    private $workspaceManager;
    /** @var SessionEventManager */
    private $sessionEventManager;

    private $courseSessionRepo;
    private $sessionUserRepo;
    private $sessionGroupRepo;
    private $sessionQueueRepo;

    public function __construct(
        EventDispatcherInterface $eventDispatcher,
        MailManager $mailManager,
        ObjectManager $om,
        RoleManager $roleManager,
        UrlGeneratorInterface $router,
        TemplateManager $templateManager,
        TokenStorageInterface $tokenStorage,
        WorkspaceManager $workspaceManager,
        SessionEventManager $sessionEventManager
    ) {
        $this->eventDispatcher = $eventDispatcher;
        $this->mailManager = $mailManager;
        $this->om = $om;
        $this->roleManager = $roleManager;
        $this->router = $router;
        $this->templateManager = $templateManager;
        $this->tokenStorage = $tokenStorage;
        $this->workspaceManager = $workspaceManager;
        $this->sessionEventManager = $sessionEventManager;

        $this->courseSessionRepo = $om->getRepository(CourseSession::class);
        $this->sessionUserRepo = $om->getRepository(CourseSessionUser::class);
        $this->sessionGroupRepo = $om->getRepository(CourseSessionGroup::class);
        $this->sessionQueueRepo = $om->getRepository(CourseSessionRegistrationQueue::class);
    }

    public function setDefaultSession(Course $course, CourseSession $session = null)
    {
        /** @var CourseSession[] $defaultSessions */
        $defaultSessions = $this->courseSessionRepo->findBy(['course' => $course, 'defaultSession' => true]);

        foreach ($defaultSessions as $defaultSession) {
            if ($defaultSession !== $session) {
                $defaultSession->setDefaultSession(false);
                $this->om->persist($defaultSession);
            }
        }

        $this->om->flush();
    }

    public function generateFromTemplate(CourseSession $session, string $basePath, string $locale)
    {
        $placeholders = [
            'session_name' => $session->getName(),
            'session_code' => $session->getCode(),
            'session_description' => $session->getDescription(),
            'session_poster_url' => $basePath.'/'.$session->getPoster(),
            'session_public_registration' => $session->getPublicRegistration(),
            'session_max_users' => $session->getMaxUsers(),
            'session_start_date' => $session->getStartDate()->format('d/m/Y'),
            'session_end_date' => $session->getEndDate()->format('d/m/Y'),
        ];

        return $this->templateManager->getTemplate('training_session', $placeholders, $locale);
    }

    /**
     * Generates a workspace from CourseSession.
     */
    public function generateWorkspace(CourseSession $session): Workspace
    {
        /** @var User $user */
        $user = $this->tokenStorage->getToken()->getUser();

        $course = $session->getCourse();
        if (!empty($course->getWorkspaceModel())) {
            $model = $course->getWorkspaceModel();
        } else {
            $model = $this->workspaceManager->getDefaultModel();
        }

        $workspace = $this->workspaceManager->copy($model, new Workspace());

        $workspace->setCreator($user);
        $workspace->setName($session->getName());
        $workspace->setCode($this->workspaceManager->getUniqueCode($session->getCode()));
        $workspace->setDescription($session->getDescription());
        $workspace->setPoster($session->getPoster());
        $workspace->setThumbnail($session->getThumbnail());
        $workspace->setAccessibleFrom($session->getStartDate());
        $workspace->setAccessibleUntil($session->getEndDate());

        $this->om->persist($workspace);

        return $workspace;
    }

    /**
     * Adds users to a session.
     */
    public function addUsersToSession(CourseSession $session, array $users, int $type = CourseSessionUser::TYPE_LEARNER): array
    {
        $results = [];
        $registrationDate = new \DateTime();

        $this->om->startFlushSuite();

        foreach ($users as $user) {
            $sessionUser = $this->sessionUserRepo->findOneBy(['session' => $session, 'user' => $user, 'userType' => $type]);

            if (empty($sessionUser)) {
                $sessionUser = new CourseSessionUser();
                $sessionUser->setSession($session);
                $sessionUser->setUser($user);
                $sessionUser->setUserType($type);
                $sessionUser->setRegistrationDate($registrationDate);

                // Registers user to session workspace
                $role = CourseSessionGroup::TYPE_TEACHER === $type ? $session->getTutorRole() : $session->getLearnerRole();

                if ($role) {
                    $this->roleManager->associateRole($user, $role);
                }
                $this->om->persist($sessionUser);

                $this->eventDispatcher->dispatch(new LogSessionUserRegistrationEvent($sessionUser), 'log');

                $results[] = $sessionUser;
            }
        }
        if (CourseSessionUser::TYPE_LEARNER === $type) {
            $events = $session->getEvents();

            foreach ($events as $event) {
                if (CourseSession::REGISTRATION_AUTO === $event->getRegistrationType() && !$event->isTerminated()) {
                    $this->sessionEventManager->addUsersToSessionEvent($event, $users);
                }
            }
        }
        $this->om->endFlushSuite();

        return $results;
    }

    /**
     * Adds groups to a session.
     */
    public function addGroupsToSession(CourseSession $session, array $groups, int $type = CourseSessionGroup::TYPE_LEARNER): array
    {
        $results = [];
        $registrationDate = new \DateTime();

        $this->om->startFlushSuite();

        foreach ($groups as $group) {
            $sessionGroup = $this->sessionGroupRepo->findOneBy(['session' => $session, 'group' => $group, 'groupType' => $type]);

            if (empty($sessionGroup)) {
                $sessionGroup = new CourseSessionGroup();
                $sessionGroup->setSession($session);
                $sessionGroup->setGroup($group);
                $sessionGroup->setGroupType($type);
                $sessionGroup->setRegistrationDate($registrationDate);

                // Registers group to session workspace
                $role = CourseSessionGroup::TYPE_TEACHER === $type ? $session->getTutorRole() : $session->getLearnerRole();

                if ($role) {
                    $this->roleManager->associateRole($group, $role);
                }
                $this->om->persist($sessionGroup);

                $this->eventDispatcher->dispatch(new LogSessionGroupRegistrationEvent($sessionGroup), 'log');

                $results[] = $sessionGroup;
            }
        }
        $this->om->endFlushSuite();

        return $results;
    }

    /**
     * Registers an user to a session if allowed.
     *
     * @return CourseSessionUser|CourseSessionRegistrationQueue|array
     */
    public function registerUserToSession(CourseSession $session, User $user, bool $skipValidation = false)
    {
        $validationMask = 0;

        if (!$skipValidation) {
            if ($session->getRegistrationValidation()) {
                $validationMask += AbstractRegistrationQueue::WAITING;
            }
            if ($session->getUserValidation()) {
                $validationMask += AbstractRegistrationQueue::WAITING_USER;
            }
        }

        if (0 < $validationMask) {
            $sessionQueue = $this->sessionQueueRepo->findOneBy(['session' => $session, 'user' => $user]);

            if (!$sessionQueue) {
                $sessionQueue = $this->createSessionQueue($session, $user, $validationMask);
            }

            return $sessionQueue;
        }

        if ($this->checkSessionCapacity($session)) {
            return $this->addUsersToSession($session, [$user]);
        }

        return null;
    }

    /**
     * Creates a queue for session and user.
     */
    public function createSessionQueue(CourseSession $session, User $user, int $mask = 0, \DateTime $date = null): CourseSessionRegistrationQueue
    {
        $this->om->startFlushSuite();
        $queue = new CourseSessionRegistrationQueue();
        $queue->setUser($user);
        $queue->setSession($session);
        $queue->setStatus($mask);

        if ($date) {
            $queue->setApplicationDate($date);
        }
        $this->om->persist($queue);

        $this->eventDispatcher->dispatch(new LogSessionQueueCreateEvent($queue), 'log');

        $this->om->endFlushSuite();

        return $queue;
    }

    /**
     * Validates user registration to session.
     */
    public function validateSessionQueueByType(CourseSessionRegistrationQueue $queue, User $user, int $type)
    {
        $mask = $queue->getStatus();

        if ($type === ($mask & $type)) {
            $this->om->startFlushSuite();

            switch ($type) {
                case CourseSessionRegistrationQueue::WAITING:
                    $mask -= CourseSessionRegistrationQueue::WAITING;
                    $queue->setValidationDate(new \DateTime());
                    $queue->setStatus($mask);
                    $this->om->persist($queue);

                    $this->eventDispatcher->dispatch(new LogSessionQueueValidateEvent($queue), 'log');
                    break;
                case CourseSessionRegistrationQueue::WAITING_USER:
                    $mask -= CourseSessionRegistrationQueue::WAITING_USER;
                    $queue->setUserValidationDate(new \DateTime());
                    $queue->setStatus($mask);
                    $this->om->persist($queue);

                    $this->eventDispatcher->dispatch(new LogSessionQueueUserValidateEvent($queue), 'log');
                    break;
                case CourseSessionRegistrationQueue::WAITING_VALIDATOR:
                    $mask -= CourseSessionRegistrationQueue::WAITING_VALIDATOR;
                    $queue->setValidatorValidationDate(new \DateTime());
                    $queue->setValidator($user);
                    $queue->setStatus($mask);
                    $this->om->persist($queue);

                    $this->eventDispatcher->dispatch(new LogSessionQueueValidatorValidateEvent($queue), 'log');
                    break;
            }
            $this->om->endFlushSuite();
        }
        if (0 === $mask) {
            $this->validateSessionQueue($queue);
        }
    }

    /**
     * Registers user to session from session queue.
     */
    public function validateSessionQueue(CourseSessionRegistrationQueue $queue)
    {
        $session = $queue->getSession();
        $user = $queue->getUser();

        if ($this->checkSessionCapacity($session)) {
            $this->om->startFlushSuite();
            $this->addUsersToSession($session, [$user]);
            $this->om->remove($queue);
            $this->om->endFlushSuite();
        }
    }

    /**
     * Gets/generates workspace role for session depending on given role name and type.
     */
    public function generateRoleForSession(Workspace $workspace, string $roleName, string $type = 'learner'): Role
    {
        if (empty($roleName)) {
            if ('manager' === $type) {
                $role = $this->roleManager->getManagerRole($workspace);
            } else {
                $role = $this->roleManager->getCollaboratorRole($workspace);
            }
        } else {
            $roles = $this->roleManager->getRolesByWorkspaceCodeAndTranslationKey(
                $workspace->getCode(),
                $roleName
            );

            if (count($roles) > 0) {
                $role = $roles[0];
            } else {
                $uuid = $workspace->getUuid();
                $wsRoleName = 'ROLE_WS_'.strtoupper($roleName).'_'.$uuid;

                $role = $this->roleManager->getRoleByName($wsRoleName);

                if (is_null($role)) {
                    $role = $this->roleManager->createWorkspaceRole(
                        $wsRoleName,
                        $roleName,
                        $workspace
                    );
                }
            }
        }

        return $role;
    }

    /**
     * Checks user limit of a session to know if there is still place for the given number of users.
     */
    public function checkSessionCapacity(CourseSession $session, $count = 1): bool
    {
        $hasPlace = true;
        $maxUsers = $session->getMaxUsers();

        if ($maxUsers) {
            $sessionUsers = $this->sessionUserRepo->findBy(['session' => $session, 'userType' => CourseSessionUser::TYPE_LEARNER]);
            $sessionGroups = $this->sessionGroupRepo->findBy(['session' => $session, 'groupType' => CourseSessionGroup::TYPE_LEARNER]);
            $groups = [];

            foreach ($sessionGroups as $sessionGroup) {
                $groups[] = $sessionGroup->getGroup();
            }
            $nbUsers = count($sessionUsers);

            foreach ($groups as $group) {
                $nbUsers += count($group->getUsers()->toArray());
            }
            $hasPlace = $nbUsers + $count <= $maxUsers;
        }

        return $hasPlace;
    }

    /**
     * Sends invitation to all session learners.
     */
    public function inviteAllSessionLearners(CourseSession $session, Template $template = null)
    {
        /** @var CourseSessionUser[] $sessionLearners */
        $sessionLearners = $this->sessionUserRepo->findBy([
            'session' => $session,
            'userType' => CourseSessionUser::TYPE_LEARNER,
        ]);
        /** @var CourseSessionGroup[] $sessionGroups */
        $sessionGroups = $this->sessionGroupRepo->findBy([
            'session' => $session,
            'groupType' => CourseSessionGroup::TYPE_LEARNER,
        ]);
        $users = [];

        foreach ($sessionLearners as $sessionLearner) {
            $user = $sessionLearner->getUser();
            $users[$user->getUuid()] = $user;
        }
        foreach ($sessionGroups as $sessionGroup) {
            $group = $sessionGroup->getGroup();
            $groupUsers = $group->getUsers();

            foreach ($groupUsers as $user) {
                $users[$user->getUuid()] = $user;
            }
        }

        $this->sendSessionInvitation($session, $users, $template);
    }

    /**
     * Sends invitation to session to given users.
     */
    public function sendSessionInvitation(CourseSession $session, array $users, Template $template = null)
    {
        $course = $session->getCourse();
        $trainersList = '';
        /** @var CourseSessionUser[] $sessionTrainers */
        $sessionTrainers = $this->sessionUserRepo->findBy([
            'session' => $session,
            'userType' => CourseSessionUser::TYPE_TEACHER,
        ]);

        if (0 < count($sessionTrainers)) {
            $trainersList = '<ul>';

            foreach ($sessionTrainers as $sessionTrainer) {
                $user = $sessionTrainer->getUser();
                $trainersList .= '<li>'.$user->getFirstName().' '.$user->getLastName().'</li>';
            }
            $trainersList .= '</ul>';
        }
        $basicPlaceholders = [
            'course_name' => $course->getName(),
            'course_code' => $course->getCode(),
            'course_description' => $course->getDescription(),
            'session_name' => $session->getName(),
            'session_description' => $session->getDescription(),
            'session_start' => $session->getStartDate()->format('Y-m-d'),
            'session_end' => $session->getEndDate()->format('Y-m-d'),
            'session_trainers' => $trainersList,
        ];

        foreach ($users as $user) {
            $locale = $user->getLocale();
            $placeholders = array_merge($basicPlaceholders, [
                'first_name' => $user->getFirstName(),
                'last_name' => $user->getLastName(),
                'username' => $user->getUsername(),
            ]);
            $title = $template ?
                $this->templateManager->getTemplateContent($template, $placeholders, 'title') :
                $this->templateManager->getTemplate('training_session_invitation', $placeholders, $locale);
            $content = $template ?
                $this->templateManager->getTemplateContent($template, $placeholders) :
                $this->templateManager->getTemplate('training_session_invitation', $placeholders, $locale);
            $this->mailManager->send($title, $content, [$user]);
        }
    }
}
