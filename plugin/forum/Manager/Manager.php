<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ForumBundle\Manager;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\MailManager;
use Claroline\ForumBundle\Entity\Category;
use Claroline\ForumBundle\Entity\Forum;
use Claroline\ForumBundle\Entity\Message;
use Claroline\ForumBundle\Entity\Subject;
use Claroline\ForumBundle\Event\Log\SubscribeForumEvent;
use Claroline\ForumBundle\Event\Log\UnsubscribeForumEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service("claroline.manager.forum_manager")
 */
class Manager
{
    private $authorization;
    private $container;
    private $dispatcher;
    private $mailManager;
    private $om;
    private $router;
    private $translator;
    private $resourceEvalManager;
    private $lastMessageWidgetConfigRepo;
    private $finder;

    /**
     * Constructor.
     *
     * @DI\InjectParams({
     *     "authorization"       = @DI\Inject("security.authorization_checker"),
     *     "container"           = @DI\Inject("service_container"),
     *     "dispatcher"          = @DI\Inject("event_dispatcher"),
     *     "mailManager"         = @DI\Inject("claroline.manager.mail_manager"),
     *     "om"                  = @DI\Inject("claroline.persistence.object_manager"),
     *     "router"              = @DI\Inject("router"),
     *     "translator"          = @DI\Inject("translator"),
     *     "finder"              = @DI\Inject("claroline.api.finder")
     * })
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        ContainerInterface $container,
        EventDispatcherInterface $dispatcher,
        MailManager $mailManager,
        ObjectManager $om,
        RouterInterface $router,
        TranslatorInterface $translator,
        FinderProvider $finder
    ) {
        $this->authorization = $authorization;
        $this->container = $container;
        $this->dispatcher = $dispatcher;
        $this->mailManager = $mailManager;
        $this->om = $om;
        $this->router = $router;
        $this->translator = $translator;
        $this->lastMessageWidgetConfigRepo = $om->getRepository('ClarolineForumBundle:Widget\LastMessageWidgetConfig');
        $this->finder = $finder;
    }

    /**
     * Subscribe a user to a forum. A email will be sent to the user each time
     * a message is posted.
     *
     * @param \Claroline\ForumBundle\Entity\Forum $forum
     * @param \Claroline\CoreBundle\Entity\User   $user
     */
    public function subscribe(Forum $forum, User $user, $selfActivation = true)
    {
        $this->om->startFlushSuite();
        $notification = new Notification();
        $notification->setUser($user);
        $notification->setForum($forum);
        $notification->setSelfActivation($selfActivation);
        $this->om->persist($notification);
        $this->dispatch(new SubscribeForumEvent($forum));
        $this->om->endFlushSuite();
    }

    /**
     * Unsubscribe a user from a forum.
     *
     * @param \Claroline\ForumBundle\Entity\Forum $forum
     * @param \Claroline\CoreBundle\Entity\User   $user
     */
    public function unsubscribe(Forum $forum, User $user)
    {
        $this->om->startFlushSuite();
        $notification = $this->notificationRepo->findOneBy(['forum' => $forum, 'user' => $user]);
        $this->om->remove($notification);
        $this->dispatch(new UnsubscribeForumEvent($forum));
        $this->om->endFlushSuite();
    }

    /**
     * @param \Claroline\CoreBundle\Entity\User   $user
     * @param \Claroline\ForumBundle\Entity\Forum $forum
     *
     * @return bool
     */
    public function hasSubscribed(User $user, Forum $forum)
    {
        $notify = $this->notificationRepo->findBy(['user' => $user, 'forum' => $forum]);

        return 1 === count($notify) ? true : false;
    }

    /**
     * Send a notification to a user about a message.
     *
     * @param \Claroline\ForumBundle\Entity\Message $message
     * @param \Claroline\CoreBundle\Entity\User     $user
     */
    public function sendMessageNotification(Message $message, User $user)
    {
        $forum = $message->getSubject()->getCategory()->getForum();
        $notifications = $this->notificationRepo->findBy(['forum' => $forum]);
        $users = [];

        foreach ($notifications as $notification) {
            $users[] = $notification->getUser();
        }

        $title = $this->translator->trans(
            'forum_new_message',
            ['%forum%' => $forum->getResourceNode()->getName(), '%subject%' => $message->getSubject()->getTitle(), '%author%' => $message->getCreator()->getUsername()],
            'forum'
        );

        $url = $this->router->generate(
            'claro_forum_subjects', ['category' => $message->getSubject()->getCategory()->getId()], true
        );

        $body = "<a href='{$url}'>{$title}</a><hr>{$message->getContent()}";
        $this->mailManager->send($title, $body, $users);
    }

    /**
     * Unsubscribe a user from a forum.
     *
     * @param \Claroline\ForumBundle\Entity\Forum        $forum
     * @param \Claroline\ForumBundle\Entity\Notification $notification
     */
    private function removeNotification(Forum $forum, Notification $notification)
    {
        $this->om->startFlushSuite();
        $this->om->remove($notification);
        $this->dispatch(new UnsubscribeForumEvent($forum));
        $this->om->endFlushSuite();
    }

    public function getHotSubjects(Forum $forum)
    {
        $date = new \DateTime();
        $date->modify('-1 week');

        $messages = $this->finder->fetch(
          'Claroline\ForumBundle\Entity\Message',
          ['createdAfter' => $date, 'forum' => $forum->getUuid()]
        );

        $totalMessages = count($messages);

        if (0 === $totalMessages) {
            return [];
        }

        $subjects = [];

        foreach ($messages as $message) {
            $total = isset($subjects[$message->getSubject()->getUuid()]) ?
              $subjects[$message->getSubject()->getUuid()] + 1 : 0;
            $subjects[$message->getSubject()->getUuid()] = $total;
        }

        $totalSubjects = count($subjects);
        $avg = $totalMessages / $totalSubjects;

        foreach ($subjects as $subject => $count) {
            if ($count < $avg) {
                unset($subjects[$subject]);
            }
        }

        return array_keys($subjects);
    }
}
