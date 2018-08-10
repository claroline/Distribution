<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\Administration;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use Claroline\CoreBundle\API\Serializer\User\ProfileSerializer;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Manager\AuthenticationManager;
use Claroline\CoreBundle\Manager\GroupManager;
use Claroline\CoreBundle\Manager\LocaleManager;
use Claroline\CoreBundle\Manager\MailManager;
use Claroline\CoreBundle\Manager\Resource\RightsManager;
use Claroline\CoreBundle\Manager\RoleManager;
use Claroline\CoreBundle\Manager\ToolManager;
use Claroline\CoreBundle\Manager\ToolMaskDecoderManager;
use Claroline\CoreBundle\Manager\UserManager;
use Claroline\CoreBundle\Manager\WorkspaceManager;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @todo check what is still used
 *
 * @DI\Tag("security.secure_service")
 * @SEC\PreAuthorize("canOpenAdminTool('user_management')")
 */
class UsersController extends Controller
{
    private $configHandler;
    private $eventDispatcher;
    private $formFactory;
    private $localeManager;
    private $mailManager;
    private $request;
    private $rightsManager;
    private $roleManager;
    private $router;
    private $session;
    private $toolManager;
    private $toolMaskDecoderManager;
    private $translator;
    private $userAdminTool;
    private $userManager;
    private $workspaceManager;
    private $authorization;
    private $groupManager;
    private $tokenStorage;
    private $finder;
    private $parametersSerializer;
    private $profileSerializer;

    /**
     * @DI\InjectParams({
     *     "authenticationManager"  = @DI\Inject("claroline.common.authentication_manager"),
     *     "configHandler"          = @DI\Inject("claroline.config.platform_config_handler"),
     *     "eventDispatcher"        = @DI\Inject("claroline.event.event_dispatcher"),
     *     "formFactory"            = @DI\Inject("form.factory"),
     *     "localeManager"          = @DI\Inject("claroline.manager.locale_manager"),
     *     "mailManager"            = @DI\Inject("claroline.manager.mail_manager"),
     *     "request"                = @DI\Inject("request_stack"),
     *     "rightsManager"          = @DI\Inject("claroline.manager.rights_manager"),
     *     "roleManager"            = @DI\Inject("claroline.manager.role_manager"),
     *     "router"                 = @DI\Inject("router"),
     *     "authorization"          = @DI\Inject("security.authorization_checker"),
     *     "tokenStorage"           = @DI\Inject("security.token_storage"),
     *     "session"                = @DI\Inject("session"),
     *     "toolManager"            = @DI\Inject("claroline.manager.tool_manager"),
     *     "toolMaskDecoderManager" = @DI\Inject("claroline.manager.tool_mask_decoder_manager"),
     *     "translator"             = @DI\Inject("translator"),
     *     "userManager"            = @DI\Inject("claroline.manager.user_manager"),
     *     "workspaceManager"       = @DI\Inject("claroline.manager.workspace_manager"),
     *     "groupManager"           = @DI\Inject("claroline.manager.group_manager"),
     *     "finder"                 = @DI\Inject("claroline.api.finder"),
     *     "parametersSerializer"   = @DI\Inject("claroline.serializer.parameters"),
     *     "profileSerializer"      = @DI\Inject("claroline.serializer.profile")
     * })
     */
    public function __construct(
        AuthenticationManager $authenticationManager,
        FormFactory $formFactory,
        LocaleManager $localeManager,
        MailManager $mailManager,
        PlatformConfigurationHandler $configHandler,
        RequestStack $request,
        RightsManager $rightsManager,
        RoleManager $roleManager,
        RouterInterface $router,
        AuthorizationCheckerInterface $authorization,
        TokenStorageInterface $tokenStorage,
        SessionInterface $session,
        StrictDispatcher $eventDispatcher,
        ToolManager $toolManager,
        ToolMaskDecoderManager $toolMaskDecoderManager,
        TranslatorInterface $translator,
        UserManager $userManager,
        WorkspaceManager $workspaceManager,
        GroupManager $groupManager,
        FinderProvider $finder,
        ParametersSerializer $parametersSerializer,
        ProfileSerializer $profileSerializer
    ) {
        $this->authenticationManager = $authenticationManager;
        $this->configHandler = $configHandler;
        $this->eventDispatcher = $eventDispatcher;
        $this->formFactory = $formFactory;
        $this->localeManager = $localeManager;
        $this->mailManager = $mailManager;
        $this->request = $request->getMasterRequest();
        $this->rightsManager = $rightsManager;
        $this->roleManager = $roleManager;
        $this->router = $router;
        $this->authorization = $authorization;
        $this->session = $session;
        $this->toolManager = $toolManager;
        $this->toolMaskDecoderManager = $toolMaskDecoderManager;
        $this->translator = $translator;
        $this->userAdminTool = $this->toolManager->getAdminToolByName('user_management');
        $this->userManager = $userManager;
        $this->workspaceManager = $workspaceManager;
        $this->groupManager = $groupManager;
        $this->tokenStorage = $tokenStorage;
        $this->finder = $finder;
        $this->parametersSerializer = $parametersSerializer;
        $this->profileSerializer = $profileSerializer;
    }

    /**
     * @EXT\Route(
     *     "/user/{user}/workspaces/page/{page}/max/{max}",
     *     name="claro_admin_user_workspaces",
     *     defaults={"page"=1, "max"=50},
     *     options={"expose"=true}
     * )
     * @EXT\Template("ClarolineCoreBundle:administration/user:user_workspace_list.html.twig")
     *
     * @param User $user
     * @param int  $page
     * @param int  $max
     *
     * @return array
     */
    public function userWorkspaceListAction(User $user, $page, $max)
    {
        $pager = $this->workspaceManager->getOpenableWorkspacesByRolesPager($user->getRoles(), $page, $max);

        return ['user' => $user, 'pager' => $pager, 'page' => $page, 'max' => $max];
    }

    /**
     * @EXT\Route("/export/users/{format}", name="claro_admin_export_users")
     *
     * @return Response
     */
    public function export($format)
    {
        $exporter = $this->container->get('claroline.exporter.'.$format);
        $exporterManager = $this->container->get('claroline.manager.exporter_manager');
        $file = $exporterManager->export('Claroline\CoreBundle\Entity\User', $exporter);
        $response = new StreamedResponse();

        $response->setCallBack(
            function () use ($file) {
                readfile($file);
            }
        );

        $response->headers->set('Content-Transfer-Encoding', 'octet-stream');
        $response->headers->set('Content-Type', 'application/force-download');
        $response->headers->set('Content-Disposition', 'attachment; filename=users.'.$format);

        switch ($format) {
            case 'csv': $response->headers->set('Content-Type', 'text/csv'); break;
            case 'xls': $response->headers->set('Content-Type', 'application/vnd.ms-excel'); break;
        }

        $response->headers->set('Connection', 'close');

        return $response;
    }
}
