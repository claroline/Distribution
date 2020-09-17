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

use Claroline\AppBundle\API\Options;
use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use Claroline\CoreBundle\API\Serializer\User\ProfileSerializer;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\RoutingHelper;
use Claroline\CoreBundle\Manager\UserManager;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * Controller for user self-registration. Access to this functionality requires
 * that the user is anonymous and the self-registration is allowed by the
 * platform configuration.
 *
 * @Route("/user/registration", options={"expose"=true})
 */
class RegistrationController
{
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
     * @param TokenStorageInterface $tokenStorage
     * @param SessionInterface      $session
     * @param TranslatorInterface   $translator
     * @param ProfileSerializer     $profileSerializer
     * @param UserManager           $userManager
     * @param ParametersSerializer  $parametersSerializer
     * @param RoutingHelper         $routingHelper
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        SessionInterface $session,
        TranslatorInterface $translator,
        ProfileSerializer $profileSerializer,
        UserManager $userManager,
        ParametersSerializer $parametersSerializer,
        RoutingHelper $routingHelper
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->session = $session;
        $this->translator = $translator;
        $this->profileSerializer = $profileSerializer;
        $this->userManager = $userManager;
        $this->parameters = $parametersSerializer->serialize();
        $this->routingHelper = $routingHelper;
    }

    /**
     * @Route("/activate/{hash}", name="claro_security_activate_user")
     *
     * @param string $hash
     *
     * @return RedirectResponse
     */
    public function activateUserAction($hash)
    {
        $user = $this->userManager->getByResetPasswordHash($hash);
        if (!$user) {
            $this->session->getFlashBag()->add(
                'warning',
                $this->translator->trans('link_outdated', [], 'platform')
            );

            return new RedirectResponse(
                $this->routingHelper->indexPath()
            );
        }

        $this->userManager->activateUser($user);
        $this->userManager->logUser($user);

        return new RedirectResponse(
            $this->routingHelper->desktopPath('home')
        );
    }

    /**
     * Fetches data self-registration form.
     *
     * @Route("/fetch", name="claro_user_registration_data_fetch")
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
                'validation' => $this->parameters['registration']['validation'],
                'localeLanguage' => $this->parameters['locales']['default'],
                'defaultRole' => $this->parameters['registration']['default_role'],
                'userNameRegex' => $this->parameters['registration']['username_regex'],
                'forceOrganizationCreation' => $this->parameters['registration']['force_organization_creation'],
                'allowWorkspace' => $this->parameters['registration']['allow_workspace'],
            ],
        ]);
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
