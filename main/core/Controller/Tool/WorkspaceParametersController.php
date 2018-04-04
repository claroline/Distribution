<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\Tool;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\Entity\Tool\Tool;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Library\Utilities\ClaroUtilities;
use Claroline\CoreBundle\Manager\GroupManager;
use Claroline\CoreBundle\Manager\ResourceManager;
use Claroline\CoreBundle\Manager\ToolManager;
use Claroline\CoreBundle\Manager\TransferManager;
use Claroline\CoreBundle\Manager\UserManager;
use Claroline\CoreBundle\Manager\WorkspaceManager;
use Claroline\CoreBundle\Manager\WorkspaceTagManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class WorkspaceParametersController extends Controller
{
    private $workspaceManager;
    private $workspaceTagManager;
    private $tokenStorage;
    private $authorization;
    private $eventDispatcher;
    private $formFactory;
    private $router;
    private $request;
    private $userManager;
    private $utilities;
    private $groupManager;
    private $toolManager;
    private $transferManager;

    /**
     * @DI\InjectParams({
     *     "workspaceManager"    = @DI\Inject("claroline.manager.workspace_manager"),
     *     "workspaceTagManager" = @DI\Inject("claroline.manager.workspace_tag_manager"),
     *     "authorization"       = @DI\Inject("security.authorization_checker"),
     *     "tokenStorage"        = @DI\Inject("security.token_storage"),
     *     "eventDispatcher"     = @DI\Inject("claroline.event.event_dispatcher"),
     *     "formFactory"         = @DI\Inject("form.factory"),
     *     "router"              = @DI\Inject("router"),
     *     "userManager"         = @DI\Inject("claroline.manager.user_manager"),
     *     "groupManager"        = @DI\Inject("claroline.manager.group_manager"),
     *     "utilities"           = @DI\Inject("claroline.utilities.misc"),
     *     "toolManager"         = @DI\Inject("claroline.manager.tool_manager"),
     *     "transferManager"     = @DI\Inject("claroline.manager.transfer_manager"),
     *     "resourceManager"     = @DI\Inject("claroline.manager.resource_manager")
     * })
     */
    public function __construct(
        WorkspaceManager $workspaceManager,
        WorkspaceTagManager $workspaceTagManager,
        ResourceManager $resourceManager,
        TransferManager $transferManager,
        TokenStorageInterface $tokenStorage,
        AuthorizationCheckerInterface $authorization,
        StrictDispatcher $eventDispatcher,
        FormFactory $formFactory,
        UrlGeneratorInterface $router,
        Request $request,
        UserManager $userManager,
        GroupManager $groupManager,
        ClaroUtilities $utilities,
        ToolManager $toolManager
    ) {
        $this->workspaceManager = $workspaceManager;
        $this->workspaceTagManager = $workspaceTagManager;
        $this->tokenStorage = $tokenStorage;
        $this->authorization = $authorization;
        $this->eventDispatcher = $eventDispatcher;
        $this->formFactory = $formFactory;
        $this->router = $router;
        $this->request = $request;
        $this->userManager = $userManager;
        $this->groupManager = $groupManager;
        $this->utilities = $utilities;
        $this->toolManager = $toolManager;
        $this->resourceManager = $resourceManager;
        $this->transferManager = $transferManager;
    }

    /**
     * @EXT\Route(
     *     "/{workspace}/editform",
     *     name="claro_workspace_edit_form"
     * )
     *
     * @EXT\Template("ClarolineCoreBundle:Tool\workspace\parameters:workspaceEdit.html.twig")
     *
     * @param Workspace $workspace
     *
     * @return Response
     */
    public function workspaceEditFormAction(Workspace $workspace)
    {
        return ['workspace' => $workspace];
    }

    /**
     * @EXT\Route(
     *     "/{workspace}/tool/{tool}/config",
     *     name="claro_workspace_tool_config"
     * )
     *
     * @param Workspace $workspace
     * @param Tool      $tool
     *
     * @return Response
     */
    public function openWorkspaceToolConfig(Workspace $workspace, Tool $tool)
    {
        $this->checkAccess($workspace);
        $event = $this->eventDispatcher->dispatch(
            strtolower('configure_workspace_tool_'.$tool->getName()),
            'ConfigureWorkspaceTool',
            [$tool, $workspace]
        );

        return new Response($event->getContent());
    }

    /**
     * @EXT\Route(
     *     "/{workspace}/subscription/url/generate/anonymous",
     *     name="claro_workspace_subscription_url_generate_anonymous"
     * )
     *
     * @EXT\Template("ClarolineCoreBundle:Tool\workspace\parameters:generate_url_subscription_anonymous.html.twig")
     *
     * @param Request   $request
     * @param Workspace $workspace
     *
     * @return Response
     */
    public function anonymousSubscriptionAction(Request $request, Workspace $workspace)
    {
        $configHandler = $this->container->get('claroline.config.platform_config_handler');
        $profilerSerializer = $this->container->get('claroline.serializer.profile');
        $tosManager = $this->container->get('claroline.common.terms_of_service_manager');
        $allowWorkspace = $configHandler->getParameter('allow_workspace_at_registration');

        $data = [
          'facets' => $profilerSerializer->serialize([Options::REGISTRATION]),
          'termOfService' => $configHandler->getParameter('terms_of_service') ?
              $tosManager->getTermsOfService() : null,
          'options' => [
              'autoLog' => $configHandler->getParameter('auto_logging'),
              'localeLanguage' => $configHandler->getParameter('locale_language'),
              'defaultRole' => $configHandler->getParameter('default_role'),
              'redirectAfterLoginOption' => $configHandler->getParameter('redirect_after_login_option'),
              'redirectAfterLoginUrl' => $configHandler->getParameter('redirect_after_login_url'),
              'userNameRegex' => $configHandler->getParameter('username_regex'),
              'forceOrganizationCreation' => $configHandler->getParameter('force_organization_creation'),
              'allowWorkspace' => $allowWorkspace,
          ],
      ];

        $data['workspace'] = $workspace;

        return $data;
    }

    /**
     * @EXT\Route(
     *     "/user/subscribe/workspace/{workspace}",
     *     name="claro_workspace_subscription_url_generate_user",
     *     options={"expose"=true}
     * )
     *
     * @EXT\Template("ClarolineCoreBundle:Tool\workspace\parameters:url_subscription_user_login.html.twig")
     *
     * @param Workspace $workspace
     * @param Request   $request
     *
     * @throws \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException
     */
    public function userSubscriptionAction(Workspace $workspace, Request $request)
    {
        if (!$this->isGranted('IS_AUTHENTICATED_FULLY')) {
            throw new AccessDeniedException();
        }

        $user = $this->get('security.token_storage')->getToken()->getUser();

        // If user is admin or registration validation is disabled, subscribe user
        if ($this->isGranted('ROLE_ADMIN') || !$workspace->getRegistrationValidation()) {
            $this->workspaceManager->addUserAction($workspace, $user);

            return $this->redirect(
                $this->generateUrl(
                    'claro_workspace_open',
                    ['workspaceId' => $workspace->getId()]
                )
            );
        }
        // Otherwise add user to validation queue if not already there
        if (!$this->workspaceManager->isUserInValidationQueue($workspace, $user)) {
            $this->workspaceManager->addUserQueue($workspace, $user);
        }

        $flashBag = $request->getSession()->getFlashBag();
        $translator = $this->get('translator');
        $flashBag->set('warning', $translator->trans('workspace_awaiting_validation', [], 'platform'));

        return $this->redirect($this->generateUrl('claro_desktop_open'));
    }

    private function checkAccess(Workspace $workspace)
    {
        if (!$this->authorization->isGranted('parameters', $workspace)) {
            throw new AccessDeniedException();
        }
    }
}
