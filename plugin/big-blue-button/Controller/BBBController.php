<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\BigBlueButtonBundle\Controller;

use Claroline\BigBlueButtonBundle\Entity\BBB;
use Claroline\BigBlueButtonBundle\Manager\BBBManager;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;
use Ramsey\Uuid\Uuid;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Translation\TranslatorInterface;

class BBBController extends Controller
{
    private $bbbManager;
    private $platformConfigHandler;
    private $request;
    private $tokenStorage;
    private $translator;

    /**
     * @DI\InjectParams({
     *     "bbbManager"            = @DI\Inject("claroline.manager.bbb_manager"),
     *     "platformConfigHandler" = @DI\Inject("claroline.config.platform_config_handler"),
     *     "request"               = @DI\Inject("request"),
     *     "tokenStorage"          = @DI\Inject("security.token_storage"),
     *     "translator"            = @DI\Inject("translator")
     * })
     */
    public function __construct(
        BBBManager $bbbManager,
        PlatformConfigurationHandler $platformConfigHandler,
        Request $request,
        TokenStorageInterface $tokenStorage,
        TranslatorInterface $translator
    ) {
        $this->bbbManager = $bbbManager;
        $this->platformConfigHandler = $platformConfigHandler;
        $this->request = $request;
        $this->tokenStorage = $tokenStorage;
        $this->translator = $translator;
    }

    /**
     * @EXT\Route(
     *     "/bbb/{bbb}/open",
     *     name="claro_bbb_open",
     *     options={"expose"=true}
     * )
     * @EXT\Template()
     */
    public function bbbOpenAction(BBB $bbb)
    {
        $this->bbbManager->checkRight($bbb, 'OPEN');
        $user = $this->tokenStorage->getToken()->getUser();
        $isAnon = $user === 'anon.';
        $serverUrl = $this->platformConfigHandler->hasParameter('bbb_server_url') ?
            $this->platformConfigHandler->getParameter('bbb_server_url') :
            null;
        $securitySalt = $this->platformConfigHandler->hasParameter('bbb_security_salt') ?
            $this->platformConfigHandler->getParameter('bbb_security_salt') :
            null;

        if ($isAnon) {
            $uuid = Uuid::uuid4()->toString();
            $anonymous = [
                'id' => '-'.$uuid,
                'fullName' => $this->translator->trans('anonymous', [], 'platform').'_'.$uuid,
            ];
        }

        return [
            'isAnon' => $isAnon,
            'user' => $isAnon ? $anonymous : $user,
            '_resource' => $bbb,
            'serverUrl' => $serverUrl,
            'securitySalt' => $securitySalt,
        ];
    }

    /**
     * @SEC\PreAuthorize("canOpenAdminTool('platform_parameters')")
     * @EXT\Route(
     *     "/plugin/configuration/form",
     *     name="claro_bbb_plugin_configuration_form",
     *     options={"expose"=true}
     * )
     * @EXT\Template()
     */
    public function pluginConfigurationFormAction()
    {
        $serverUrl = $this->platformConfigHandler->hasParameter('bbb_server_url') ?
            $this->platformConfigHandler->getParameter('bbb_server_url') :
            null;
        $securitySalt = $this->platformConfigHandler->hasParameter('bbb_security_salt') ?
            $this->platformConfigHandler->getParameter('bbb_security_salt') :
            null;

        return [
            'serverUrl' => $serverUrl,
            'securitySalt' => $securitySalt,
        ];
    }

    /**
     * @SEC\PreAuthorize("canOpenAdminTool('platform_parameters')")
     * @EXT\Route(
     *     "/plugin/configuration/save",
     *     name="claro_bbb_plugin_configuration_save",
     *     options={"expose"=true}
     * )
     */
    public function pluginConfigurationSaveAction()
    {
        $serverUrl = $this->request->get('serverUrl', false) === false ? null : $this->request->get('serverUrl');
        $securitySalt = $this->request->get('securitySalt', false) === false ? null : $this->request->get('securitySalt');
        $this->platformConfigHandler->setParameters([
            'bbb_server_url' => $serverUrl,
            'bbb_security_salt' => $securitySalt,
        ]);

        return new JsonResponse([
            'serverUrl' => $serverUrl,
            'securitySalt' => $securitySalt,
        ]);
    }
}
