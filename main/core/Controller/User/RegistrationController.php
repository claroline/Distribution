<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\User;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Controller\RequestDecoderTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use Claroline\CoreBundle\API\Serializer\User\ProfileSerializer;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Manager\UserManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * Controller for user self-registration. Access to this functionality requires
 * that the user is anonymous and the self-registration is allowed by the
 * platform configuration.
 *
 * @EXT\Route("/user/registration", options={"expose"=true})
 */
class RegistrationController extends Controller
{
    use RequestDecoderTrait;

    /** @var TokenStorageInterface */
    private $tokenStorage;
    /** @var SessionInterface */
    private $session;
    /** @var TranslatorInterface */
    private $translator;
    /** @var ProfileSerializer */
    private $profileSerializer;
    /** @var UserManager */
    private $userManager;

    private $parameters;

    /**
     * RegistrationController constructor.
     *
     * @DI\InjectParams({
     *     "tokenStorage"         = @DI\Inject("security.token_storage"),
     *     "session"              = @DI\Inject("session"),
     *     "translator"           = @DI\Inject("translator"),
     *     "profileSerializer"    = @DI\Inject("claroline.serializer.profile"),
     *     "userManager"          = @DI\Inject("claroline.manager.user_manager"),
     *     "parametersSerializer" = @DI\Inject("claroline.serializer.parameters"),
     *     "serializer"           = @DI\Inject("claroline.api.serializer"),
     *     "crud"                 = @DI\Inject("claroline.api.crud"),
     *     "configHandler"        = @DI\Inject("claroline.config.platform_config_handler"),
     *     "om"                   = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param TokenStorageInterface $tokenStorage
     * @param SessionInterface      $session
     * @param TranslatorInterface   $translator
     * @param ProfileSerializer     $profileSerializer
     * @param UserManager           $userManager
     * @param ParametersSerializer  $parametersSerializer
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        PlatformConfigurationHandler $configHandler,
        SessionInterface $session,
        TranslatorInterface $translator,
        ProfileSerializer $profileSerializer,
        UserManager $userManager,
        ParametersSerializer $parametersSerializer,
        SerializerProvider $serializer,
        ObjectManager $om,
        Crud $crud
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->session = $session;
        $this->translator = $translator;
        $this->profileSerializer = $profileSerializer;
        $this->userManager = $userManager;
        $this->serializer = $serializer;
        $this->configHandler = $configHandler;
        $this->parameters = $parametersSerializer->serialize();
        $this->om = $om;
        $this->crud = $crud;
    }

    /**
     * Displays the user self-registration form.
     *
     * @EXT\Route("", name="claro_user_registration")
     * @EXT\Template("ClarolineCoreBundle:user:registration.html.twig")
     *
     * @return array
     */
    public function indexAction()
    {
        $this->checkAccess();

        return [];
    }

    /**
     * @EXT\Route("/activate/{hash}", name="claro_security_activate_user")
     *
     * @param string $hash
     *
     * @return RedirectResponse
     *
     * @todo move this to the api
     */
    public function activateUserAction($hash)
    {
        $user = $this->userManager->getByResetPasswordHash($hash);
        if (!$user) {
            $this->session->getFlashBag()->add(
                'warning',
                $this->translator->trans('link_outdated', [], 'platform')
            );

            return new RedirectResponse($this->generateUrl('claro_security_login'));
        }

        $this->userManager->activateUser($user);
        $this->userManager->logUser($user);

        return new RedirectResponse($this->generateUrl('claro_desktop_open'));
    }

    /**
     * Fetches data self-registration form.
     *
     * @EXT\Route("/fetch", name="claro_user_registration_data_fetch")
     *
     * @return JsonResponse
     */
    public function registrationDataFetchAction()
    {
        $this->checkAccess();

        return new JsonResponse([
            'facets' => $this->profileSerializer->serialize([Options::REGISTRATION]),
            'termOfService' => $this->parameters['tos']['text'] ? $this->parameters['tos']['text'] : null,
            'options' => [
                'autoLog' => $this->parameters['registration']['auto_logging'],
                'localeLanguage' => $this->parameters['locales']['default'],
                'defaultRole' => $this->parameters['registration']['default_role'],
                'redirectAfterLoginOption' => $this->parameters['authentication']['redirect_after_login_option'],
                'redirectAfterLoginUrl' => $this->parameters['authentication']['redirect_after_login_url'],
                'userNameRegex' => $this->parameters['registration']['username_regex'],
                'forceOrganizationCreation' => $this->parameters['registration']['force_organization_creation'],
                'allowWorkspace' => $this->parameters['registration']['allow_workspace'],
            ],
        ]);
    }

    /**
     * @EXT\Route("/user/login", name="apiv2_user_create_and_login")
     * @EXT\Method("POST")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function createAndLoginAction(Request $request)
    {
        //there is a little bit of computation involved here (ie, do we need to validate the account or stuff like this)
        //but keep it easy for now because an other route could be relevant
        $options = [
              //maybe move these options in an other class
              Options::SEND_EMAIL,
              Options::ADD_NOTIFICATIONS,
              Options::WORKSPACE_VALIDATE_ROLES,
        ];

        $selfLog = true;
        $autoOrganization = $this->configHandler->getParameter('force_organization_creation');

        $organizationRepository = $this->om->getRepository('ClarolineCoreBundle:Organization\Organization');

        //step one: creation the organization if it's here. If it exists, we fetch it.
        $data = $this->decodeRequest($request);

        $organization = null;

        if ($autoOrganization) {
            //try to find orga first
            //first find by vat
            if (isset($data['mainOrganization'])) {
                if (isset($data['mainOrganization']['vat']) && null !== $data['mainOrganization']['vat']) {
                    $organization = $organizationRepository
                      ->findOneBy(['vat' => $data['mainOrganization']['vat']]);
                //then by code
                } else {
                    $organization = $organizationRepository
                      ->findOneBy(['code' => $data['mainOrganization']['code']]);
                }
            }

            if (!$organization && isset($data['mainOrganization'])) {
                $organization = $this->crud->create(
                    'Claroline\CoreBundle\Entity\Organization\Organization',
                    $data['mainOrganization']
                );
            }

            //error handling
            if (is_array($organization)) {
                return new JsonResponse($organization, 400);
            }
        }

        $user = $this->crud->create(
            User::class,
            $this->decodeRequest($request),
            array_merge($options, [Options::VALIDATE_FACET])
        );

        //error handling
        if (is_array($user)) {
            return new JsonResponse($user, 400);
        }

        if ($organization) {
            $this->crud->replace($user, 'mainOrganization', $organization);
        }

        if ($selfLog && 'anon.' === $this->tokenStorage->getToken()->getUser()) {
            $this->userManager->logUser($user);
        }

        return new JsonResponse(
            $this->serializer->serialize($user, [Options::SERIALIZE_FACET]),
            201
        );
    }

    /**
     * Checks if a user is allowed to register.
     * ie: if the self registration is disabled, he can't.
     *
     * @throws AccessDeniedException
     */
    private function checkAccess()
    {
        if (!$this->parameters['registration']['self'] || $this->tokenStorage->getToken()->getUser() instanceof User) {
            throw new AccessDeniedException();
        }
    }
}
