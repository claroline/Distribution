<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\API\Workspace;

use Claroline\CoreBundle\API\FinderProvider;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\ApiManager;
use Claroline\CoreBundle\Manager\WorkspaceManager;
use Claroline\CoreBundle\Persistence\ObjectManager;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Controller\FOSRestController;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;

/**
 * @NamePrefix("api_")
 */
class WorkspaceController extends FOSRestController
{
    /** @var ObjectManager */
    private $om;
    /** @var FinderProvider */
    private $finder;
    /** @var ApiManager */
    private $apiManager;
    /** @var WorkspaceManager */
    private $workspaceManager;

    /**
     * WorkspaceController constructor.
     *
     * @DI\InjectParams({
     *     "om"               = @DI\Inject("claroline.persistence.object_manager"),
     *     "finder"           = @DI\Inject("claroline.api.finder"),
     *     "apiManager"       = @DI\Inject("claroline.manager.api_manager"),
     *     "workspaceManager" = @DI\Inject("claroline.manager.workspace_manager")
     * })
     *
     * @param ObjectManager    $om
     * @param FinderProvider   $finder
     * @param ApiManager       $apiManager
     * @param WorkspaceManager $workspaceManager
     */
    public function __construct(
        ObjectManager $om,
        FinderProvider $finder,
        ApiManager $apiManager,
        WorkspaceManager $workspaceManager
    ) {
        $this->om = $om;
        $this->finder = $finder;
        $this->apiManager = $apiManager;
        $this->workspaceManager = $workspaceManager;
    }

    /**
     * @View(serializerGroups={"api_workspace"})
     * @SEC\PreAuthorize("canOpenAdminTool('workspace_management')")
     *
     * @todo move into api
     *
     * @param bool $isModel
     *
     * @return array
     */
    public function copyWorkspacesAction($isModel)
    {
        $isModel = $isModel === 'true';
        $workspaces = $this->apiManager->getParameters('ids', 'Claroline\CoreBundle\Entity\Workspace\Workspace');

        $this->om->startFlushSuite();
        $newWorkspaces = array_map(function (Workspace $workspace) use ($isModel) {
            $new = new Workspace();
            $new->setName($workspace->getName());
            $new->setCode($workspace->getCode());

            return $this->workspaceManager->copy($workspace, $new, $isModel);
        }, $workspaces);
        $this->om->endFlushSuite();

        return $newWorkspaces;
    }
}
