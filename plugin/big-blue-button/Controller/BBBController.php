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
use Claroline\CoreBundle\Manager\CurlManager;
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
    private $curlManager;
    private $platformConfigHandler;
    private $request;
    private $tokenStorage;
    private $translator;

    /**
     * @DI\InjectParams({
     *     "bbbManager"            = @DI\Inject("claroline.manager.bbb_manager"),
     *     "curlManager"           = @DI\Inject("claroline.manager.curl_manager"),
     *     "platformConfigHandler" = @DI\Inject("claroline.config.platform_config_handler"),
     *     "request"               = @DI\Inject("request"),
     *     "tokenStorage"          = @DI\Inject("security.token_storage"),
     *     "translator"            = @DI\Inject("translator")
     * })
     */
    public function __construct(
        BBBManager $bbbManager,
        CurlManager $curlManager,
        PlatformConfigurationHandler $platformConfigHandler,
        Request $request,
        TokenStorageInterface $tokenStorage,
        TranslatorInterface $translator
    ) {
        $this->bbbManager = $bbbManager;
        $this->curlManager = $curlManager;
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
            trim($this->platformConfigHandler->getParameter('bbb_server_url'), '/') :
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
     * @EXT\Route(
     *     "/bbb/{bbb}/configuration/save",
     *     name="claro_bbb_configuration_save",
     *     options={"expose"=true}
     * )
     */
    public function bbbConfigurationSaveAction(BBB $bbb)
    {
        $this->bbbManager->checkRight($bbb, 'EDIT');
        $roomName = $this->request->get('roomName', false) ?
            $this->request->get('roomName') :
            null;
        $welcomeMessage = $this->request->get('welcomeMessage', false) ?
            $this->request->get('welcomeMessage') :
            null;
        $newTab = boolval($this->request->get('newTab', false));
        $moderatorRequired = boolval($this->request->get('moderatorRequired', false));
        $record = boolval($this->request->get('record', false));
        $startDate = $this->request->get('startDate', false) ?
            new \DateTime($this->request->get('startDate')) :
            null;
        $endDate = $this->request->get('endDate', false) ?
            new \DateTime($this->request->get('endDate')) :
            null;
        $this->bbbManager->updateBBB(
            $bbb,
            $roomName,
            $welcomeMessage,
            $newTab,
            $moderatorRequired,
            $record,
            $startDate,
            $endDate
        );

        return new JsonResponse($bbb);
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
        $serverUrl = $this->request->get('serverUrl', false) ? $this->request->get('serverUrl') : null;
        $securitySalt = $this->request->get('securitySalt', false) ? $this->request->get('securitySalt') : null;
        $this->platformConfigHandler->setParameters([
            'bbb_server_url' => $serverUrl,
            'bbb_security_salt' => $securitySalt,
        ]);

        return new JsonResponse([
            'serverUrl' => $serverUrl,
            'securitySalt' => $securitySalt,
        ]);
    }

    /**
     * @EXT\Route(
     *     "/bbb/{bbb}/create",
     *     name="claro_bbb_create",
     *     options={"expose"=true}
     * )
     */
    public function bbbCreateAction(BBB $bbb)
    {
        $this->bbbManager->checkRight($bbb, 'OPEN');
        $code = 403;
        $response = '';
        $serverUrl = $this->platformConfigHandler->hasParameter('bbb_server_url') ?
            trim($this->platformConfigHandler->getParameter('bbb_server_url'), '/') :
            null;
        $securitySalt = $this->platformConfigHandler->hasParameter('bbb_security_salt') ?
            $this->platformConfigHandler->getParameter('bbb_security_salt') :
            null;

        if ($serverUrl && $securitySalt) {
            $meetingId = $bbb->getResourceNode()->getGuid();
            $record = $bbb->getRecord();
            $roomName = $bbb->getRoomName();
            $welcomeMessage = $bbb->getWelcomeMessage();
            $queryString = "meetingID=$meetingId&attendeePW=collaborator&moderatorPW=manager";
            $queryString .= $record ? '&record=true' : '&record=false';
            $queryString .= $roomName ? '&name='.urlencode($roomName) : '';
            $queryString .= $welcomeMessage ? '&welcome='.urlencode($welcomeMessage) : '';
            $checksum = sha1("create$queryString$securitySalt");
            $url = "$serverUrl/bigbluebutton/api/create?$queryString&checksum=$checksum";
            $response = $this->curlManager->exec($url, null, 'GET', [], false, $ch);
            $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            $dom = new \DOMDocument();

            if ($dom->loadXML($response)) {
                $returnCodes = $dom->getElementsByTagName('returncode');
                $success = $returnCodes->length > 0 && $returnCodes->item(0)->textContent === 'SUCCESS';
                $code = $success ? 200 : 404;
            }
        }

        return new JsonResponse($response, $code);
    }

    /**
     * @EXT\Route(
     *     "/bbb/{bbb}/end",
     *     name="claro_bbb_end",
     *     options={"expose"=true}
     * )
     */
    public function bbbEndAction(BBB $bbb)
    {
        $this->bbbManager->checkRight($bbb, 'EDIT');
        $code = 403;
        $url = '';
        $serverUrl = $this->platformConfigHandler->hasParameter('bbb_server_url') ?
            trim($this->platformConfigHandler->getParameter('bbb_server_url'), '/') :
            null;
        $securitySalt = $this->platformConfigHandler->hasParameter('bbb_security_salt') ?
            $this->platformConfigHandler->getParameter('bbb_security_salt') :
            null;

        if ($serverUrl && $securitySalt) {
            $meetingId = $bbb->getResourceNode()->getGuid();
            $queryString = "meetingID=$meetingId&password=manager";
            $checksum = sha1("end$queryString$securitySalt");
            $url = "$serverUrl/bigbluebutton/api/end?$queryString&checksum=$checksum";
            $this->curlManager->exec($url, null, 'GET', [], false, $ch);
            $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
        }

        return new JsonResponse($url, $code);
    }
}
