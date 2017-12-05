<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\DropZoneBundle\Controller;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\DropZoneBundle\Entity\Dropzone;
use Claroline\DropZoneBundle\Manager\DropzoneManager;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @EXT\Route("/dropzone", options={"expose"=true})
 */
class DropzoneController extends Controller
{
    use PermissionCheckerTrait;

    /** @var DropzoneManager */
    private $manager;

    /**
     * DropzoneController constructor.
     *
     * @DI\InjectParams({
     *     "manager" = @DI\Inject("claroline.manager.dropzone_manager")
     * })
     *
     * @param DropzoneManager $manager
     */
    public function __construct(DropzoneManager $manager)
    {
        $this->manager = $manager;
    }

    /**
     * Updates a Dropzone resource.
     *
     * @EXT\Route("/{id}/open", name="claro_dropzone_open")
     * @EXT\Method("GET")
     * @EXT\ParamConverter(
     *     "dropzone",
     *     class="ClarolineDropZoneBundle:Dropzone"
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     * @EXT\Template()
     *
     * @param Dropzone $dropzone
     * @param User     $user
     *
     * @return JsonResponse
     */
    public function dropzoneOpenAction(Dropzone $dropzone, User $user = null)
    {
        $this->checkPermission('OPEN', $dropzone->getResourceNode(), [], true);
        $teamEnabled = $this->manager->isTeamBundleEnabled();

        if (!$teamEnabled && $dropzone->getDropType() === Dropzone::DROP_TYPE_ROLE) {
            $this->manager->setDefaultDropType($dropzone);
        }
        $myDrop = empty($user) ? null : $this->manager->getUserDrop($dropzone, $user);
        $finishedPeerDrops = $this->manager->getUserFinishedPeerDrops($dropzone, $user);
        $peerDrop = $this->manager->getPeerDrop($dropzone, $user, false);
        $serializedTools = $this->manager->getSerializedTools();
        $userEvaluation = !empty($user) ? $this->manager->generateResourceUserEvaluation($dropzone, $user) : null;

        return [
            '_resource' => $dropzone,
            'user' => $user,
            'myDrop' => $myDrop,
            'nbCorrections' => count($finishedPeerDrops),
            'peerDrop' => !empty($peerDrop) ? $this->manager->serializeDrop($peerDrop) : $peerDrop,
            'tools' => $serializedTools,
            'userEvaluation' => $userEvaluation,
            'teamEnabled' => $teamEnabled,
        ];
    }

    /**
     * @SEC\PreAuthorize("canOpenAdminTool('platform_parameters')")
     * @EXT\Route("/plugin/configure", name="claro_dropzone_plugin_configure")
     * @EXT\Template()
     */
    public function pluginConfigureAction()
    {
        return [
            'tools' => $this->manager->getSerializedTools(),
        ];
    }
}
