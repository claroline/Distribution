<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use Claroline\CoreBundle\Entity\Tool\OrderedTool;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Event\DisplayToolEvent;
use Claroline\CoreBundle\Event\Log\LogWorkspaceEnterEvent;
use Claroline\CoreBundle\Event\Log\LogWorkspaceToolReadEvent;
use Claroline\CoreBundle\Library\Security\Utilities;
use Claroline\CoreBundle\Manager\ResourceManager;
use Claroline\CoreBundle\Manager\ToolManager;
use Claroline\CoreBundle\Manager\Workspace\WorkspaceManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Role\SwitchUserRole;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @EXT\Route("/workspaces", options={"expose" = true})
 */
class WorkspaceController
{
    /** @var AuthorizationCheckerInterface */
    private $authorization;
    /** @var EventDispatcherInterface */
    private $eventDispatcher;
    /** @var ResourceManager */
    private $resourceManager;
    /** @var UrlGeneratorInterface */
    private $router;
    /** @var SessionInterface */
    private $session;
    /** @var TokenStorageInterface */
    private $tokenStorage;
    /** @var ToolManager */
    private $toolManager;
    /** @var TranslatorInterface */
    private $translator;
    /** @var Utilities */
    private $utils;
    /** @var WorkspaceManager */
    private $workspaceManager;
    /** @var ObjectManager */
    private $om;
    /** @var ParametersSerializer */
    private $parametersSerializer;

    /**
     * WorkspaceController constructor.
     *
     * @DI\InjectParams({
     *     "authorization"        = @DI\Inject("security.authorization_checker"),
     *     "eventDispatcher"      = @DI\Inject("event_dispatcher"),
     *     "resourceManager"      = @DI\Inject("claroline.manager.resource_manager"),
     *     "router"               = @DI\Inject("router"),
     *     "session"              = @DI\Inject("session"),
     *     "tokenStorage"         = @DI\Inject("security.token_storage"),
     *     "toolManager"          = @DI\Inject("claroline.manager.tool_manager"),
     *     "translator"           = @DI\Inject("translator"),
     *     "utils"                = @DI\Inject("claroline.security.utilities"),
     *     "workspaceManager"     = @DI\Inject("claroline.manager.workspace_manager"),
     *     "parametersSerializer" = @DI\Inject("claroline.serializer.parameters"),
     *     "om"                   = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param EventDispatcherInterface      $eventDispatcher
     * @param ResourceManager               $resourceManager
     * @param UrlGeneratorInterface         $router
     * @param SessionInterface              $session
     * @param TokenStorageInterface         $tokenStorage
     * @param ToolManager                   $toolManager
     * @param TranslatorInterface           $translator
     * @param Utilities                     $utils
     * @param WorkspaceManager              $workspaceManager
     * @param ParametersSerializer          $parametersSerializer
     * @param ObjectManager                 $om
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        EventDispatcherInterface $eventDispatcher,
        ResourceManager $resourceManager,
        UrlGeneratorInterface $router,
        SessionInterface $session,
        TokenStorageInterface $tokenStorage,
        ToolManager $toolManager,
        TranslatorInterface $translator,
        Utilities $utils,
        WorkspaceManager $workspaceManager,
        ParametersSerializer $parametersSerializer,
        ObjectManager $om
    ) {
        $this->authorization = $authorization;
        $this->eventDispatcher = $eventDispatcher;
        $this->resourceManager = $resourceManager;
        $this->router = $router;
        $this->session = $session;
        $this->tokenStorage = $tokenStorage;
        $this->toolManager = $toolManager;
        $this->translator = $translator;
        $this->utils = $utils;
        $this->workspaceManager = $workspaceManager;
        $this->parametersSerializer = $parametersSerializer;
        $this->om = $om;
    }

    /**
     * @EXT\Route("/{workspaceId}", name="claro_workspace_open")
     *
     * @param int     $workspaceId - the id or uuid of the WS to open
     * @param Request $request
     *
     * @throws AccessDeniedException
     *
     * @return JsonResponse
     */
    public function openAction($workspaceId, Request $request)
    {
        /** @var Workspace $workspace */
        $workspace = $this->om->getObject(['id' => $workspaceId], Workspace::class);
        if (!$workspace) {
            throw new NotFoundHttpException('Workspace not found');
        }

        if (!$this->authorization->isGranted('open', $workspace)) {
            throw new AccessDeniedException();
        }

        $this->forceWorkspaceLang($workspace, $request);

        // Log workspace opening
        $this->eventDispatcher->dispatch('log', new LogWorkspaceEnterEvent($workspace));

        // Add workspace to recent workspaces if user is not Usurped
        if ('anon.' !== $this->tokenStorage->getToken()->getUser() && !$this->isUsurpator($this->tokenStorage->getToken())) {
            $this->workspaceManager->addRecentWorkspaceForUser($this->tokenStorage->getToken()->getUser(), $workspace);
        }

        // Get the list of enabled workspace tool
        $this->toolManager->addMissingWorkspaceTools($workspace);
        if ($this->workspaceManager->isManager($workspace, $this->tokenStorage->getToken())) {
            // gets all available tools
            $orderedTools = $this->toolManager->getOrderedToolsByWorkspace($workspace);
        } else {
            // gets accessible tools by user
            $currentRoles = $this->utils->getRoles($this->tokenStorage->getToken());
            $orderedTools = $this->toolManager->getOrderedToolsByWorkspaceAndRoles($workspace, $currentRoles);
        }

        // TODO : impersonation
        // TODO : access errors

        return new JsonResponse([
            'impersonated' => false,
            'accessErrors' => [],
            'tools' => array_values(array_map(function (OrderedTool $orderedTool) { // todo : create a serializer
                return [
                    'icon' => $orderedTool->getTool()->getClass(),
                    'name' => $orderedTool->getTool()->getName(),
                ];
            }, $orderedTools)),
        ]);
    }

    /**
     * Opens a tool.
     *
     * @EXT\Route("/{id}/tool/{toolName}", name="claro_workspace_open_tool")
     * @EXT\ParamConverter(
     *      "workspace",
     *      class="ClarolineCoreBundle:Workspace\Workspace",
     *      options={"id" = "id", "strictId" = true},
     *      converter="strict_id"
     * )
     *
     * @param Workspace $workspace
     * @param string    $toolName
     *
     * @return Response
     */
    public function openToolAction(Workspace $workspace, $toolName)
    {
        $tool = $this->toolManager->getToolByName($toolName);
        if (!$tool) {
            throw new NotFoundHttpException('Tool not found');
        }

        if (!$this->authorization->isGranted($toolName, $workspace)) {
            throw new AccessDeniedException();
        }

        /** @var DisplayToolEvent $event */
        $event = $this->eventDispatcher->dispatch('open_tool_workspace_'.$toolName, new DisplayToolEvent($workspace));

        $this->eventDispatcher->dispatch('log', new LogWorkspaceToolReadEvent($workspace, $toolName));

        return new JsonResponse($event->getData());
    }

    /**
     * @EXT\Route("/{workspace}/denied/{action}", name="claro_workspace_denied")
     * @EXT\Template
     *
     * @param Workspace $workspace
     * @param string    $action
     *
     * @return array
     */
    public function openDeniedAction(Workspace $workspace, $action)
    {
        $user = $this->tokenStorage->getToken()->getUser();

        //check the expiration date first
        $now = new \DateTime();
        $dateValidity = true;

        if ($workspace->getEndDate()) {
            if ($now->getTimeStamp() > $workspace->getEndDate()->getTimeStamp()) {
                $dateValidity = false;
            }
        }

        if ($workspace->getStartDate()) {
            if ($now->getTimeStamp() < $workspace->getStartDate()->getTimeStamp()) {
                $dateValidity = false;
            }
        }

        return [
          'workspace' => $workspace,
          'action' => $action,
          'dateValidity' => $dateValidity,
          'isInQueue' => $this->workspaceManager->isUserInValidationQueue($workspace, $user),
        ];
    }

    private function isUsurpator(TokenInterface $token = null)
    {
        if ($token) {
            foreach ($token->getRoles() as $role) {
                if ('ROLE_USURPATE_WORKSPACE_ROLE' === $role->getRole() || $role instanceof SwitchUserRole) {
                    return true;
                }
            }
        }

        return false;
    }

    private function forceWorkspaceLang(Workspace $workspace, Request $request)
    {
        if ($workspace->getLang()) {
            $request->setLocale($workspace->getLang());
            //not sure if both lines are needed
            $this->translator->setLocale($workspace->getLang());
        }
    }
}
