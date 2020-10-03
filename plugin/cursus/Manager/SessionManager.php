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
use Claroline\CursusBundle\Entity\Course;
use Claroline\CursusBundle\Entity\Registration\AbstractRegistration;
use Claroline\CursusBundle\Entity\Registration\SessionGroup;
use Claroline\CursusBundle\Entity\Registration\SessionUser;
use Claroline\CursusBundle\Entity\Session;
use Claroline\CursusBundle\Event\Log\LogSessionGroupRegistrationEvent;
use Claroline\CursusBundle\Event\Log\LogSessionGroupUnregistrationEvent;
use Claroline\CursusBundle\Event\Log\LogSessionQueueUserValidateEvent;
use Claroline\CursusBundle\Event\Log\LogSessionQueueValidateEvent;
use Claroline\CursusBundle\Event\Log\LogSessionQueueValidatorValidateEvent;
use Claroline\CursusBundle\Event\Log\LogSessionUserRegistrationEvent;
use Claroline\CursusBundle\Event\Log\LogSessionUserUnregistrationEvent;
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
    /** @var EventManager */
    private $sessionEventManager;

    private $sessionRepo;
    private $sessionUserRepo;
    private $sessionGroupRepo;

    public function __construct(
        EventDispatcherInterface $eventDispatcher,
        MailManager $mailManager,
        ObjectManager $om,
        RoleManager $roleManager,
        UrlGeneratorInterface $router,
        TemplateManager $templateManager,
        TokenStorageInterface $tokenStorage,
        WorkspaceManager $workspaceManager,
        EventManager $sessionEventManager
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

        $this->sessionRepo = $om->getRepository(Session::class);
        $this->sessionUserRepo = $om->getRepository(SessionUser::class);
        $this->sessionGroupRepo = $om->getRepository(SessionGroup::class);
    }

    public function setDefaultSession(Course $course, Session $session = null)
    {
        /** @var Session[] $defaultSessions */
        $defaultSessions = $this->sessionRepo->findBy(['course' => $course, 'defaultSession' => true]);

        foreach ($defaultSessions as $defaultSession) {
            if ($defaultSession !== $session) {
                $defaultSession->setDefaultSession(false);
                $this->om->persist($defaultSession);
            }
        }

        $this->om->flush();
    }

    public function generateFromTemplate(Session $session, string $basePath, string $locale)
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
    public function generateWorkspace(Session $session): Workspace
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
        $workspace->setHidden($course->isHidden());

        $this->om->persist($workspace);

        return $workspace;
    }

    /**
     * Adds users to a session.
     */
    public function addUsers(Session $session, array $users, string $type = AbstractRegistration::LEARNER, bool $validated = false): array
    {
        $results = [];

        $course = $session->getCourse();
        $registrationDate = new \DateTime();

        $this->om->startFlushSuite();

        foreach ($users as $user) {
            $sessionUser = $this->sessionUserRepo->findOneBy(['session' => $session, 'user' => $user, 'type' => $type]);

            if (empty($sessionUser)) {
                $sessionUser = new SessionUser();
                $sessionUser->setSession($session);
                $sessionUser->setUser($user);
                $sessionUser->setType($type);
                $sessionUser->setDate($registrationDate);

                if (AbstractRegistration::TUTOR === $type) {
                    // no validation on tutors
                    $sessionUser->setValidated(true);
                    $sessionUser->setConfirmed(true);
                } else {
                    // set validations for users based on session config
                    $sessionUser->setValidated(!$session->getRegistrationValidation() || $validated);
                    $sessionUser->setConfirmed(!$session->getUserValidation());
                }

                // Registers user to session workspace
                $role = AbstractRegistration::TUTOR === $type ? $session->getTutorRole() : $session->getLearnerRole();

                if ($role) {
                    $this->roleManager->associateRole($user, $role);
                }
                $this->om->persist($sessionUser);

                $this->eventDispatcher->dispatch(new LogSessionUserRegistrationEvent($sessionUser), 'log');

                $results[] = $sessionUser;
            }
        }

        // TODO : send invitation mail if configured

        // TODO : what to do with this if he goes in pending state ?

        // registers users to linked trainings
        if ($course->getPropagateRegistration() && !empty($course->getChildren())) {
            foreach ($course->getChildren() as $childCourse) {
                $childSession = $childCourse->getDefaultSession();
                if ($childSession && !$childSession->isTerminated()) {
                    $this->addUsers($childSession, $users);
                }
            }
        }

        // registers users to linked events
        $events = $session->getEvents();
        foreach ($events as $event) {
            if (Session::REGISTRATION_AUTO === $event->getRegistrationType() && !$event->isTerminated()) {
                $this->sessionEventManager->addUsersToSessionEvent($event, $users);
            }
        }

        $this->om->endFlushSuite();

        return $results;
    }

    public function removeUsers(Session $session, array $sessionUsers)
    {
        foreach ($sessionUsers as $sessionUser) {
            $this->om->remove($sessionUser);

            // unregister user from the linked workspace
            if ($session->getWorkspace()) {
                $this->workspaceManager->unregister($sessionUser->getUser(), $session->getWorkspace());
            }

            // TODO : unregister from events

            $this->eventDispatcher->dispatch(new LogSessionUserUnregistrationEvent($sessionUser), 'log');
        }

        $this->om->flush();
    }

    /**
     * Adds groups to a session.
     */
    public function addGroups(Session $session, array $groups, string $type = AbstractRegistration::LEARNER): array
    {
        $results = [];
        $registrationDate = new \DateTime();

        $this->om->startFlushSuite();

        foreach ($groups as $group) {
            $sessionGroup = $this->sessionGroupRepo->findOneBy([
                'session' => $session,
                'group' => $group,
                'type' => $type,
            ]);

            if (empty($sessionGroup)) {
                $sessionGroup = new SessionGroup();
                $sessionGroup->setSession($session);
                $sessionGroup->setGroup($group);
                $sessionGroup->setType($type);
                $sessionGroup->setDate($registrationDate);

                // Registers group to session workspace
                $role = AbstractRegistration::TUTOR === $type ? $session->getTutorRole() : $session->getLearnerRole();

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

    public function removeGroups(Session $session, array $sessionGroups)
    {
        foreach ($sessionGroups as $sessionGroup) {
            $this->om->remove($sessionGroup);

            // unregister group from the linked workspace
            if ($session->getWorkspace()) {
                $this->workspaceManager->unregister($sessionGroup->getGroup(), $session->getWorkspace());
            }

            // TODO : unregister from events

            $this->eventDispatcher->dispatch(new LogSessionGroupUnregistrationEvent($sessionGroup), 'log');
        }

        $this->om->flush();
    }

    /**
     * Registers an user to a session if allowed.
     *
     * @return SessionUser
     */
    public function registerUserToSession(Session $session, User $user, bool $skipValidation = false)
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
            return $this->addUsers($session, [$user]);
        }

        return null;
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
            $this->addUsers($session, [$user]);
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
    public function checkSessionCapacity(Session $session, $count = 1): bool
    {
        $hasPlace = true;
        $maxUsers = $session->getMaxUsers();

        if ($maxUsers) {
            $sessionUsers = $this->sessionUserRepo->findBy(['session' => $session, 'type' => AbstractRegistration::LEARNER]);
            $sessionGroups = $this->sessionGroupRepo->findBy(['session' => $session, 'type' => AbstractRegistration::LEARNER]);
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
    public function inviteAllSessionLearners(Session $session, Template $template = null)
    {
        /** @var SessionUser[] $sessionLearners */
        $sessionLearners = $this->sessionUserRepo->findBy([
            'session' => $session,
            'type' => AbstractRegistration::LEARNER,
        ]);
        /** @var SessionGroup[] $sessionGroups */
        $sessionGroups = $this->sessionGroupRepo->findBy([
            'session' => $session,
            'type' => AbstractRegistration::LEARNER,
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
    public function sendSessionInvitation(Session $session, array $users, Template $template = null)
    {
        $course = $session->getCourse();
        $trainersList = '';
        /** @var SessionUser[] $sessionTrainers */
        $sessionTrainers = $this->sessionUserRepo->findBy([
            'session' => $session,
            'type' => AbstractRegistration::TUTOR,
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
