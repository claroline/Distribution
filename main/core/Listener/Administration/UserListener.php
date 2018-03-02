<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Listener\Administration;

use Claroline\CoreBundle\Event\AdminUserActionEvent;
use Claroline\CoreBundle\Event\User\MergeUsersEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\HttpKernelInterface;

/**
 * @DI\Service()
 */
class UserListener
{
    private $container;
    private $httpKernel;

    /**
     * @DI\InjectParams({
     *     "container"  = @DI\Inject("service_container"),
     *     "httpKernel" = @DI\Inject("http_kernel")
     * })
     */
    public function __construct(ContainerInterface $container, HttpKernelInterface $httpKernel)
    {
        $this->container = $container;
        $this->httpKernel = $httpKernel;
    }

    /**
     * @DI\Observe("admin_user_action_edit")
     */
    public function onEditUser(AdminUserActionEvent $event)
    {
        $params = [
            '_controller' => 'ClarolineCoreBundle:Profile:editProfile',
            'user' => $event->getUser()->getId(),
        ];

        $subRequest = $this->container->get('request')->duplicate([], null, $params);
        $response = $this->httpKernel->handle($subRequest, HttpKernelInterface::SUB_REQUEST);
        $event->setResponse($response);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("admin_user_action_show_workspaces")
     */
    public function onOpenWorkspaceUser(AdminUserActionEvent $event)
    {
        $params = [
            '_controller' => 'ClarolineCoreBundle:Administration\Users:userWorkspaceList',
            'user' => $event->getUser()->getId(),
            'page' => 1,
            'max' => 50,
        ];

        $subRequest = $this->container->get('request')->duplicate([], null, $params);
        $response = $this->httpKernel->handle($subRequest, HttpKernelInterface::SUB_REQUEST);
        $event->setResponse($response);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("merge_users")
     */
    public function onMergeUsers(MergeUsersEvent $event)
    {
        // Replace creator of resource nodes
        $resourcesCount = $this->container->get('claroline.manager.resource_node')->replaceCreator($event->getRemoved(), $event->getKept());
        $event->addMessage("[CoreBundle] updated resources count: $resourcesCount");

        // Merge all roles onto user to keep
        $rolesCount = $this->container->get('claroline.manager.user_manager')->transferRoles($event->getRemoved(), $event->getKept());
        $event->addMessage("[CoreBundle] transferred roles count: $rolesCount");

        // Change personal workspace into regular
        $event->getRemoved()->getPersonalWorkspace()->setPersonal(false);
    }
}
