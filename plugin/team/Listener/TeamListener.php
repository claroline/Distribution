<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\TeamBundle\Listener;

use Claroline\CoreBundle\Event\DisplayToolEvent;
use Claroline\TeamBundle\Manager\TeamManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;

/**
 * @DI\Service
 */
class TeamListener
{
    /** @var TeamManager */
    private $teamManager;
    /** @var TwigEngine */
    private $templating;

    /**
     * @DI\InjectParams({
     *     "teamManager" = @DI\Inject("claroline.manager.team_manager"),
     *     "templating"  = @DI\Inject("templating")
     * })
     *
     * @param TeamManager $teamManager
     * @param TwigEngine  $templating
     */
    public function __construct(TeamManager $teamManager, TwigEngine $templating)
    {
        $this->teamManager = $teamManager;
        $this->templating = $templating;
    }

    /**
     * @DI\Observe("open_tool_workspace_claroline_team_tool")
     *
     * @param DisplayToolEvent $event
     */
    public function onWorkspaceToolOpen(DisplayToolEvent $event)
    {
        $workspace = $event->getWorkspace();
        $teamParams = $this->teamManager->getWorkspaceTeamParameters($workspace);

        $content = $this->templating->render(
            'ClarolineTeamBundle:team:tool.html.twig', [
                'workspace' => $workspace,
                'teamParams' => $teamParams,
            ]
        );
        $event->setContent($content);
        $event->stopPropagation();
    }
}
