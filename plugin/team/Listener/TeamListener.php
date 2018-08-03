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

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Event\DisplayToolEvent;
use Claroline\CoreBundle\Repository\ResourceTypeRepository;
use Claroline\TeamBundle\Manager\TeamManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @DI\Service
 */
class TeamListener
{
    /** @var AuthorizationCheckerInterface */
    private $authorization;
    /** @var ObjectManager */
    private $om;
    /** @var TeamManager */
    private $teamManager;
    /** @var TwigEngine */
    private $templating;

    /** @var ResourceTypeRepository */
    private $resourceTypeRepo;

    /**
     * @DI\InjectParams({
     *     "authorization" = @DI\Inject("security.authorization_checker"),
     *     "om"            = @DI\Inject("claroline.persistence.object_manager"),
     *     "teamManager"   = @DI\Inject("claroline.manager.team_manager"),
     *     "templating"    = @DI\Inject("templating")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param ObjectManager                 $om
     * @param TeamManager                   $teamManager
     * @param TwigEngine                    $templating
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        ObjectManager $om,
        TeamManager $teamManager,
        TwigEngine $templating
    ) {
        $this->authorization = $authorization;
        $this->om = $om;
        $this->teamManager = $teamManager;
        $this->templating = $templating;

        $this->resourceTypeRepo = $om->getRepository('Claroline\CoreBundle\Entity\Resource\ResourceType');
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
        $canEdit = $this->authorization->isGranted(['claroline_team_tool', 'edit'], $workspace);
        $resouceTypes = $this->resourceTypeRepo->findBy(['isEnabled' => true]);

        $content = $this->templating->render(
            'ClarolineTeamBundle:team:tool.html.twig', [
                'workspace' => $workspace,
                'teamParams' => $teamParams,
                'canEdit' => $canEdit,
                'resourceTypes' => array_map(function (ResourceType $resourceType) {
                    return $resourceType->getName();
                }, $resouceTypes),
            ]
        );
        $event->setContent($content);
        $event->stopPropagation();
    }
}
