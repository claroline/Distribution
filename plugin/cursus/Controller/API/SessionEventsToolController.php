<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Controller\API;

use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CursusBundle\Manager\CursusManager;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @DI\Tag("security.secure_service")
 * @SEC\PreAuthorize("canOpenTool('claroline_session_events_tool')")
 */
class SessionEventsToolController extends Controller
{
    private $authorization;
    private $cursusManager;

    /**
     * @DI\InjectParams({
     *     "authorization" = @DI\Inject("security.authorization_checker"),
     *     "cursusManager" = @DI\Inject("claroline.manager.cursus_manager")
     * })
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        CursusManager $cursusManager
    ) {
        $this->authorization = $authorization;
        $this->cursusManager = $cursusManager;
    }

    /**
     * @EXT\Route(
     *     "/workspace/{workspace}/tool/session/events/index",
     *     name="claro_cursus_session_events_tool_index"
     * )
     * @EXT\Template()
     *
     * @return array
     */
    public function indexAction(Workspace $workspace)
    {
        return ['workspace' => $workspace];
    }
}
