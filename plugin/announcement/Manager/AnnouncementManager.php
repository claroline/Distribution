<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AnnouncementBundle\Manager;

use Claroline\AnnouncementBundle\API\Serializer\AnnouncementSerializer;
use Claroline\AnnouncementBundle\Entity\Announcement;
use Claroline\AnnouncementBundle\Entity\AnnouncementSend;
use Claroline\AnnouncementBundle\Entity\AnnouncementsWidgetConfig;
use Claroline\AnnouncementBundle\Repository\AnnouncementRepository;
use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Widget\WidgetInstance;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\MailManager;
use Claroline\CoreBundle\Manager\Task\ScheduledTaskManager;
use Claroline\CoreBundle\Repository\RoleRepository;
use Claroline\CoreBundle\Repository\UserRepository;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.announcement_manager")
 */
class AnnouncementManager
{
    /** @var ObjectManager */
    private $om;

    /** @var StrictDispatcher */
    private $eventDispatcher;

    /** @var MailManager */
    private $mailManager;

    /** @var ScheduledTaskManager */
    private $taskManager;

    /** @var AnnouncementSerializer */
    private $serializer;

    /** @var AnnouncementRepository */
    private $announcementRepo;
    private $announcementsWidgetConfigRepo;

    /** @var RoleRepository */
    private $roleRepo;

    /** @var UserRepository */
    private $userRepo;

    /**
     * AnnouncementManager constructor.
     *
     * @DI\InjectParams({
     *     "om"              = @DI\Inject("claroline.persistence.object_manager"),
     *     "eventDispatcher" = @DI\Inject("claroline.event.event_dispatcher"),
     *     "serializer"      = @DI\Inject("claroline.serializer.announcement"),
     *     "mailManager"     = @DI\Inject("claroline.manager.mail_manager"),
     *     "taskManager"     = @DI\Inject("claroline.manager.scheduled_task_manager"),
     *     "finder"          = @DI\Inject("claroline.api.finder")
     * })
     *
     * @param ObjectManager          $om
     * @param StrictDispatcher       $eventDispatcher
     * @param AnnouncementSerializer $serializer
     * @param MailManager            $mailManager
     * @param ScheduledTaskManager   $taskManager
     */
    public function __construct(
        ObjectManager $om,
        StrictDispatcher $eventDispatcher,
        AnnouncementSerializer $serializer,
        MailManager $mailManager,
        ScheduledTaskManager $taskManager,
        FinderProvider $finder
    ) {
        $this->om = $om;
        $this->eventDispatcher = $eventDispatcher;
        $this->serializer = $serializer;
        $this->mailManager = $mailManager;
        $this->taskManager = $taskManager;
        $this->finder = $finder;

        $this->announcementRepo = $om->getRepository('ClarolineAnnouncementBundle:Announcement');
        $this->announcementsWidgetConfigRepo = $om->getRepository('ClarolineAnnouncementBundle:AnnouncementsWidgetConfig');
        $this->roleRepo = $om->getRepository('ClarolineCoreBundle:Role');
        $this->userRepo = $om->getRepository('ClarolineCoreBundle:User');
    }

    /**
     * Serializes an Announcement entity.
     *
     * @param Announcement $announcement
     *
     * @return array
     */
    public function serialize(Announcement $announcement)
    {
        return $this->serializer->serialize($announcement);
    }

    public function getVisibleAnnouncementsByWorkspace(Workspace $workspace, array $roles)
    {
        if (in_array('ROLE_ADMIN', $roles)
            || in_array("ROLE_WS_MANAGER_{$workspace->getGuid()}", $roles)) {
            return $this->announcementRepo->findVisibleByWorkspace($workspace);
        }

        return $this->announcementRepo->findVisibleByWorkspaceAndRoles($workspace, $roles);
    }

    public function getVisibleAnnouncementsByWorkspaces(array $workspaces, array $roles)
    {
        $managerWorkspaces = [];
        $nonManagerWorkspaces = [];

        foreach ($workspaces as $workspace) {
            if (in_array("ROLE_WS_MANAGER_{$workspace->getGuid()}", $roles)) {
                $managerWorkspaces[] = $workspace;
            } else {
                $nonManagerWorkspaces[] = $workspace;
            }
        }

        return $this->announcementRepo->findVisibleByWorkspacesAndRoles(
            $nonManagerWorkspaces,
            $managerWorkspaces,
            $roles
        );
    }

    /**
     * Sends an Announcement by message to Users that can access it.
     *
     * @param Announcement $announcement
     * @param array        $roles
     */
    public function sendMessage(Announcement $announcement, array $users = [])
    {
        $message = $this->getMessage($announcement, $users);

        $announcementSend = new AnnouncementSend();
        $data = $message;
        $data['receivers'] = array_map(function ($receiver) {
            return $receiver->getUsername();
        }, $message['receivers']);
        $data['sender'] = $message['sender']->getUsername();
        $announcementSend->setAnnouncement($announcement);
        $announcementSend->setData($data);
        $this->om->persist($announcementSend);
        $this->om->flush();

        $this->eventDispatcher->dispatch(
            'claroline_message_sending_to_users',
            'SendMessage',
            [
                $message['sender'],
                $message['content'],
                $message['object'],
                null,
                $message['receivers'],
            ]
        );
    }

    public function scheduleMessage(Announcement $announcement, \DateTime $scheduledDate, array $roles = [])
    {
        $this->om->startFlushSuite();

        $message = $this->getMessage($announcement, $roles);
        $taskData = [
            'name' => $message['object'],
            'type' => 'message',
            'scheduledDate' => $scheduledDate->format('Y-m-d\TH:i:s'),
            'data' => [
                'object' => $message['object'],
                'content' => $announcement->getContent(),
                'users' => array_map(function (User $user) {
                    return ['id' => $user->getId()];
                }, $message['receivers']),
            ],
        ];

        if (empty($announcement->getTask())) {
            $task = $this->taskManager->create($taskData);

            // link new task to announcement
            $announcement->setTask($task);
            $this->om->persist($announcement);
        } else {
            $this->taskManager->update($taskData, $announcement->getTask());
        }

        $this->om->endFlushSuite();
    }

    public function unscheduleMessage(Announcement $announcement)
    {
        $this->om->startFlushSuite();

        if (!empty($announcement->getTask())) {
            $this->taskManager->delete($announcement->getTask());

            // unlink task and announcement
            $announcement->setTask(null);
            $this->om->persist($announcement);
        }

        $this->om->endFlushSuite();
    }

    /**
     * Gets the data which will be sent by message (internal &email) to Users.
     *
     * @param Announcement $announce
     * @param array        $roles
     *
     * @return array
     */
    private function getMessage(Announcement $announce, array $users = [])
    {
        $resourceNode = $announce->getAggregate()->getResourceNode();

        $object = !empty($announce->getTitle()) ? $announce->getTitle() : $announce->getAggregate()->getName();

        if (empty($announce->getTitle()) && !empty($announce->getVisibleFrom())) {
            $object .= ' ['.$announce->getVisibleFrom()->format('Y-m-d H:i').']';
        }

        $content = $announce->getContent().'<br>['.$resourceNode->getWorkspace()->getCode().'] '.$resourceNode->getWorkspace()->getName();

        return [
            'sender' => $announce->getCreator(),
            'receivers' => $users,
            'object' => $object,
            'content' => $content,
        ];
    }

    /**
     * Gets the list of Users that can see an announce.
     *
     * @todo make a dql request to retrieve the users (it may be a difficult one to do)
     *
     * @param Announcement $announce
     * @param array        $roles
     *
     * @return User[]
     */
    public function getVisibleBy(Announcement $announce, array $roles = [])
    {
        $node = $announce->getAggregate()->getResourceNode();

        $rights = $node->getRights();

        if (0 === count($roles)) {
            foreach ($rights as $right) {
                //1 is the default "open" mask
                if ($right->getMask() & 1) {
                    $roles[] = $right->getRole();
                }
            }

            $roles[] = $this->roleRepo->findOneBy([
                'name' => 'ROLE_WS_MANAGER_'.$node->getWorkspace()->getGuid(),
            ]);
        }

        return $this->userRepo->findByRolesIncludingGroups($roles, false, 'id', 'ASC');
    }

    public function getAnnouncementsWidgetConfig(WidgetInstance $widgetInstance)
    {
        $config = $this->announcementsWidgetConfigRepo->findOneBy(['widgetInstance' => $widgetInstance]);

        if (is_null($config)) {
            $config = new AnnouncementsWidgetConfig();
            $config->setWidgetInstance($widgetInstance);
            $this->om->persist($config);
            $this->om->flush();
        }

        return $config;
    }

    public function persistAnnouncementsWidgetConfig(AnnouncementsWidgetConfig $config)
    {
        $this->om->persist($config);
        $this->om->flush();
    }
}
