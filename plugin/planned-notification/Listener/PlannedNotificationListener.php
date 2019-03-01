<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\PlannedNotificationBundle\Listener;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Event\DisplayToolEvent;
use Claroline\CoreBundle\Event\Log\LogGenericEvent;
use Claroline\CoreBundle\Event\Log\LogRoleSubscribeEvent;
use Claroline\CoreBundle\Event\Log\LogWorkspaceEnterEvent;
use Claroline\CoreBundle\Event\WorkspaceCopyToolEvent;
use Claroline\PlannedNotificationBundle\Entity\Message;
use Claroline\PlannedNotificationBundle\Entity\PlannedNotification;
use Claroline\PlannedNotificationBundle\Manager\PlannedNotificationManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @DI\Service
 */
class PlannedNotificationListener
{
    /** @var AuthorizationCheckerInterface */
    private $authorization;
    /** @var PlannedNotificationManager */
    private $manager;
    /** @var TwigEngine */
    private $templating;
    /** @var TokenStorageInterface */
    private $tokenStorage;

    /**
     * @DI\InjectParams({
     *     "authorization" = @DI\Inject("security.authorization_checker"),
     *     "manager"       = @DI\Inject("claroline.manager.planned_notification_manager"),
     *     "templating"    = @DI\Inject("templating"),
     *     "tokenStorage"  = @DI\Inject("security.token_storage"),
     *     "om"            = @DI\Inject("claroline.persistence.object_manager"),
     *     "crud"          = @DI\Inject("claroline.api.crud"),
     *     "finder"        = @DI\Inject("claroline.api.finder")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param PlannedNotificationManager    $manager
     * @param TwigEngine                    $templating
     * @param TokenStorageInterface         $tokenStorage
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        PlannedNotificationManager $manager,
        TwigEngine $templating,
        TokenStorageInterface $tokenStorage,
        Crud $crud,
        FinderProvider $finder,
        ObjectManager $om
    ) {
        $this->authorization = $authorization;
        $this->manager = $manager;
        $this->templating = $templating;
        $this->tokenStorage = $tokenStorage;
        $this->om = $om;
        $this->crud = $crud;
        $this->finder = $finder;
    }

    /**
     * @DI\Observe("open_tool_workspace_claroline_planned_notification_tool")
     *
     * @param DisplayToolEvent $event
     */
    public function onWorkspaceToolOpen(DisplayToolEvent $event)
    {
        $workspace = $event->getWorkspace();

        if (!$this->authorization->isGranted(['claroline_planned_notification_tool', 'OPEN'], $workspace)) {
            throw new AccessDeniedException();
        }
        $content = $this->templating->render(
            'ClarolinePlannedNotificationBundle:planned_notification_tool:tool_open.html.twig', [
                'workspace' => $workspace,
                'canEdit' => $this->authorization->isGranted(['claroline_planned_notification_tool', 'EDIT'], $workspace),
            ]
        );
        $event->setContent($content);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("log", priority=1)
     *
     * @param LogGenericEvent $event
     */
    public function onLog(LogGenericEvent $event)
    {
        if ($event instanceof LogRoleSubscribeEvent) {
            $role = $event->getRole();
            $workspace = $role->getWorkspace();

            if (!empty($workspace)) {
                $this->manager->generateScheduledTasks(
                    $event->getActionKey(),
                    $event->getReceiver(),
                    $workspace,
                    $event->getReceiverGroup(),
                    $role
                );
            }
        } elseif ($event instanceof LogWorkspaceEnterEvent) {
            $user = $this->tokenStorage->getToken()->getUser();

            if ('anon.' !== $user) {
                $this->manager->generateScheduledTasks($event->getAction(), $user, $event->getWorkspace());
            }
        }
    }

    /**
     * @DI\Observe("workspace_copy_tool_claroline_planned_notification_tool")
     *
     * @param WorkspaceCopyToolEvent $event
     */
    public function onWorkspaceToolCopy(WorkspaceCopyToolEvent $event)
    {
        $oldWs = $event->getOldWorkspace();
        $workspace = $event->getNewWorkspace();

        $planned = $this->finder->fetch(PlannedNotification::class, ['workspace' => $oldWs->getUuid()]);
        $oldMessages = $this->finder->fetch(Message::class, ['workspace' => $oldWs->getUuid()]);

        foreach ($planned as $old) {
            $new = $this->crud->copy($old, [Options::GENERATE_UUID]);
            $new->setWorkspace($workspace);
            $this->om->persist($new);
            //fixme: role
        }

        foreach ($oldMessages as $old) {
            $new = $this->crud->copy($old, [Options::GENERATE_UUID]);
            $new->setWorkspace($workspace);
            $this->om->persist($new);
            //fixme: setPlannedNotif
        }

        $this->om->flush();
    }
}
