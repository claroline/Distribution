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
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class BBBController extends Controller
{
    private $bbbManager;
    private $platformConfigHandler;
    private $request;
    private $tokenStorage;

    /**
     * @DI\InjectParams({
     *     "bbbManager"            = @DI\Inject("claroline.manager.bbb_manager"),
     *     "platformConfigHandler" = @DI\Inject("claroline.config.platform_config_handler"),
     *     "request"               = @DI\Inject("request"),
     *     "tokenStorage"          = @DI\Inject("security.token_storage")
     * })
     */
    public function __construct(
        BBBManager $bbbManager,
        PlatformConfigurationHandler $platformConfigHandler,
        Request $request,
        TokenStorageInterface $tokenStorage
    ) {
        $this->bbbManager = $bbbManager;
        $this->platformConfigHandler = $platformConfigHandler;
        $this->request = $request;
        $this->tokenStorage = $tokenStorage;
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
        $canEdit = $this->bbbManager->hasRight($bbb, 'EDIT');
        $user = $this->tokenStorage->getToken()->getUser();
        $isAnon = $user === 'anon.';
        $serverUrl = $this->platformConfigHandler->hasParameter('bbb_server_url') ?
            $this->platformConfigHandler->getParameter('bbb_server_url') :
            null;
        $securityKey = $this->platformConfigHandler->hasParameter('bbb_security_key') ?
            $this->platformConfigHandler->getParameter('bbb_security_key') :
            null;

        return [
            'isAnon' => $isAnon,
            'userId' => $isAnon ? null : $user->getId(),
            'canEdit' => $canEdit,
            '_resource' => $bbb,
            'serverUrl' => $serverUrl,
            'securityKey' => $securityKey,
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
        $securityKey = $this->platformConfigHandler->hasParameter('bbb_security_key') ?
            $this->platformConfigHandler->getParameter('bbb_security_key') :
            null;

        return [
            'serverUrl' => $serverUrl,
            'securityKey' => $securityKey,
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
        $securityKey = $this->request->get('securityKey', false) === false ? null : $this->request->get('securityKey');
        $this->platformConfigHandler->setParameters([
            'bbb_server_url' => $serverUrl,
            'bbb_security_key' => $securityKey,
        ]);

        return new JsonResponse([
            'serverUrl' => $serverUrl,
            'securityKey' => $securityKey,
        ]);
    }
}
