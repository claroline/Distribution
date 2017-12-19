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
use Claroline\TeamBundle\Manager\TeamManager;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @EXT\Route("/dropzone", options={"expose"=true})
 */
class DropzoneController extends Controller
{
    use PermissionCheckerTrait;

    /** @var DropzoneManager */
    private $manager;

    /** @var TeamManager */
    private $teamManager;

    /** @var TranslatorInterface */
    private $translator;

    /**
     * DropzoneController constructor.
     *
     * @DI\InjectParams({
     *     "manager"     = @DI\Inject("claroline.manager.dropzone_manager"),
     *     "teamManager" = @DI\Inject("claroline.manager.team_manager"),
     *     "translator"  = @DI\Inject("translator")
     * })
     *
     * @param DropzoneManager     $manager
     * @param TeamManager         $teamManager
     * @param TranslatorInterface $translator
     */
    public function __construct(
        DropzoneManager $manager,
        TeamManager $teamManager,
        TranslatorInterface $translator
    ) {
        $this->manager = $manager;
        $this->teamManager = $teamManager;
        $this->translator = $translator;
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
        $resourceNode = $dropzone->getResourceNode();
        $this->checkPermission('OPEN', $resourceNode, [], true);
        $teams = !empty($user) ?
            $this->teamManager->getSearializedTeamsByUserAndWorkspace($user, $resourceNode->getWorkspace()) :
            [];
        $myDrop = null;
        $peerDrop = null;
        $finishedPeerDrops = [];
        $errorMessage = null;
        $teamId = null;
        $teamName = null;

        if (!$dropzone->getDropClosed() && $dropzone->getAutoCloseDropsAtDropEndDate() && !$dropzone->getManualPlanning()) {
            $dropEndDate = $dropzone->getDropEndDate();

            if ($dropEndDate < new \DateTime()) {
                $this->manager->closeAllUnfinishedDrops($dropzone);
            }
        }

        switch ($dropzone->getDropType()) {
            case Dropzone::DROP_TYPE_USER:
                $myDrop = !empty($user) ? $this->manager->getUserDrop($dropzone, $user) : null;
                $peerDrop = $this->manager->getPeerDrop($dropzone, $user, null, null, false);
                $finishedPeerDrops = $this->manager->getFinishedPeerDrops($dropzone, $user);
                break;
            case Dropzone::DROP_TYPE_TEAM:
                $drops = [];
                $teamsIds = array_map(function ($team) {
                    return $team['id'];
                }, $teams);

                /* Fetches team drops associated to user */
                $teamDrops = !empty($user) ? $this->manager->getTeamDrops($dropzone, $user) : [];

                /* Unregisters user from unfinished drops associated to team he doesn't belong to anymore */
                foreach ($teamDrops as $teamDrop) {
                    if (!$teamDrop->isFinished() && !in_array($teamDrop->getTeamId(), $teamsIds)) {
                        /* Unregisters user from unfinished drop */
                        $this->manager->unregisterUserFromTeamDrop($teamDrop, $user);
                    } else {
                        $drops[] = $teamDrop;
                    }
                }
                if (count($drops) === 0) {
                    /* Checks if there are unfinished drops from teams he belongs but not associated to him */
                    $unfinishedTeamsDrops = $this->manager->getTeamsUnfinishedDrops($dropzone, $teamsIds);

                    if (count($unfinishedTeamsDrops) > 0) {
                        $errorMessage = $this->translator->trans('existing_unfinished_team_drop_error', [], 'dropzone');
                    }
                } elseif (count($drops) === 1) {
                    $myDrop = $drops[0];
                } else {
                    $errorMessage = $this->translator->trans('more_than_one_drop_error', [], 'dropzone');
                }
                if (!empty($myDrop)) {
                    $teamId = $myDrop->getTeamId();
                    $teamName = $myDrop->getTeamName();
                }
                $peerDrop = $this->manager->getPeerDrop($dropzone, $user, $teamId, $teamName, false);
                $finishedPeerDrops = $this->manager->getFinishedPeerDrops($dropzone, $user, $teamId);
                break;
        }
        $serializedTools = $this->manager->getSerializedTools();
        /* TODO: generate ResourceUserEvaluation for team */
        $userEvaluation = !empty($user) ? $this->manager->generateResourceUserEvaluation($dropzone, $user) : null;

        return [
            '_resource' => $dropzone,
            'user' => $user,
            'myDrop' => $myDrop,
            'nbCorrections' => count($finishedPeerDrops),
            'peerDrop' => $peerDrop,
            'tools' => $serializedTools,
            'userEvaluation' => $userEvaluation,
            'teams' => $teams,
            'errorMessage' => $errorMessage,
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
