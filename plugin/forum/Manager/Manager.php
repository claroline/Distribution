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

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Security\Utilities;
use Claroline\CoreBundle\Manager\MailManager;
use Claroline\CoreBundle\Manager\Resource\MaskManager;
use Claroline\CoreBundle\Manager\Resource\ResourceEvaluationManager;
use Claroline\CoreBundle\Manager\Resource\RightsManager;
use Claroline\CoreBundle\Manager\ResourceManager;
use Claroline\CoreBundle\Manager\WorkspaceManager;
use Claroline\CoreBundle\Pager\PagerFactory;
use Claroline\ForumBundle\Entity\Category;
use Claroline\ForumBundle\Entity\Forum;
use Claroline\ForumBundle\Entity\Message;
use Claroline\ForumBundle\Entity\Subject;
use Claroline\ForumBundle\Event\Log\SubscribeForumEvent;
use Claroline\ForumBundle\Event\Log\UnsubscribeForumEvent;
use Claroline\MessageBundle\Manager\MessageManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
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
    private $maskManager;
    private $messageManager;
    private $om;
    private $pagerFactory;
    private $resourceManager;
    private $rightsManager;
    private $router;
    private $securityUtilities;
    private $tokenStorage;
    private $translator;
    private $workspaceManager;
    private $resourceEvalManager;

    private $forumRepo;
    private $lastMessageWidgetConfigRepo;
    private $messageRepo;
    private $notificationRepo;
    private $roleRepo;
    private $subjectRepo;
    private $userRepo;

    /**
     * Constructor.
     *
     * @DI\InjectParams({
     *     "authorization"       = @DI\Inject("security.authorization_checker"),
     *     "container"           = @DI\Inject("service_container"),
     *     "dispatcher"          = @DI\Inject("event_dispatcher"),
     *     "mailManager"         = @DI\Inject("claroline.manager.mail_manager"),
     *     "maskManager"         = @DI\Inject("claroline.manager.mask_manager"),
     *     "messageManager"      = @DI\Inject("claroline.manager.message_manager"),
     *     "om"                  = @DI\Inject("claroline.persistence.object_manager"),
     *     "pagerFactory"        = @DI\Inject("claroline.pager.pager_factory"),
     *     "resourceManager"     = @DI\Inject("claroline.manager.resource_manager"),
     *     "rightsManager"       = @DI\Inject("claroline.manager.rights_manager"),
     *     "router"              = @DI\Inject("router"),
     *     "securityUtilities"   = @DI\Inject("claroline.security.utilities"),
     *     "tokenStorage"        = @DI\Inject("security.token_storage"),
     *     "translator"          = @DI\Inject("translator"),
     *     "workspaceManager"    = @DI\Inject("claroline.manager.workspace_manager"),
     *     "resourceEvalManager" = @DI\Inject("claroline.manager.resource_evaluation_manager")
     * })
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        ContainerInterface $container,
        EventDispatcherInterface $dispatcher,
        MailManager $mailManager,
        MaskManager $maskManager,
        MessageManager $messageManager,
        ObjectManager $om,
        PagerFactory $pagerFactory,
        ResourceManager $resourceManager,
        RightsManager $rightsManager,
        RouterInterface $router,
        Utilities $securityUtilities,
        TokenStorageInterface $tokenStorage,
        TranslatorInterface $translator,
        WorkspaceManager $workspaceManager,
        ResourceEvaluationManager $resourceEvalManager
    ) {
        $this->authorization = $authorization;
        $this->container = $container;
        $this->dispatcher = $dispatcher;
        $this->mailManager = $mailManager;
        $this->maskManager = $maskManager;
        $this->messageManager = $messageManager;
        $this->om = $om;
        $this->pagerFactory = $pagerFactory;
        $this->resourceManager = $resourceManager;
        $this->rightsManager = $rightsManager;
        $this->router = $router;
        $this->securityUtilities = $securityUtilities;
        $this->tokenStorage = $tokenStorage;
        $this->translator = $translator;
        $this->workspaceManager = $workspaceManager;
        $this->resourceEvalManager = $resourceEvalManager;
        $this->forumRepo = $om->getRepository('ClarolineForumBundle:Forum');
        $this->lastMessageWidgetConfigRepo = $om->getRepository('ClarolineForumBundle:Widget\LastMessageWidgetConfig');
        $this->messageRepo = $om->getRepository('ClarolineForumBundle:Message');
        $this->notificationRepo = $om->getRepository('ClarolineForumBundle:Notification');
        $this->roleRepo = $om->getRepository('ClarolineCoreBundle:Role');
        $this->subjectRepo = $om->getRepository('ClarolineForumBundle:Subject');
        $this->userRepo = $om->getRepository('ClarolineCoreBundle:User');
        $this->resourceEvalManager = $resourceEvalManager;
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
}
