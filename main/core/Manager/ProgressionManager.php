<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\Resource\ResourceEvaluationManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.progression_manager")
 */
class ProgressionManager
{
    /** @var FinderProvider */
    private $finder;

    /** @var ResourceEvaluationManager */
    private $resourceEvalManager;

    /** @var SerializerProvider */
    private $serializer;

    /**
     * @DI\InjectParams({
     *     "finder"              = @DI\Inject("claroline.api.finder"),
     *     "resourceEvalManager" = @DI\Inject("claroline.manager.resource_evaluation_manager"),
     *     "serializer"          = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param FinderProvider            $finder
     * @param ResourceEvaluationManager $resourceEvalManager
     * @param SerializerProvider        $serializer
     */
    public function __construct(
        FinderProvider $finder,
        ResourceEvaluationManager $resourceEvalManager,
        SerializerProvider $serializer
    ) {
        $this->finder = $finder;
        $this->resourceEvalManager = $resourceEvalManager;
        $this->serializer = $serializer;
    }

    /**
     * Retrieves list of resource nodes accessible by user and formatted for the progression tool.
     *
     * @param Workspace $workspace
     * @param User      $user
     * @param int       $levelMax
     *
     * @return array
     */
    public function fetchItems(Workspace $workspace, User $user = null, $levelMax = 1)
    {
        $workspaceRoot = $this->finder->get(ResourceNode::class)->find([
            'workspace' => $workspace->getUuid(),
            'parent' => null,
        ])[0];

        $roles = $user ? $user->getRoles() : ['ROLE_ANONYMOUS'];
        $filters = [
            'active' => true,
            'published' => true,
            'hidden' => false,
            'resourceTypeEnabled' => true,
            'workspace' => $workspace->getUuid(),
        ];
        $sortBy = [
            'property' => 'name',
            'direction' => 1,
        ];

        if (!in_array('ROLE_ADMIN', $roles)) {
            $filters['roles'] = $roles;
        }
        // Get all resource nodes available for current user in the workspace
        $nodes = $this->finder->get(ResourceNode::class)->find($filters);
        $filters['parent'] = $workspaceRoot;
        // Get all root resource nodes available for current user in the workspace
        $rootNodes = $this->finder->get(ResourceNode::class)->find($filters, $sortBy);

        $items = $this->formatNodes($rootNodes, $nodes, $user);

        return $items;
    }

    private function formatNodes(array $rootNodes, array $nodes, User $user = null)
    {
        $items = [];
        $nodesArray = [];

        foreach ($nodes as $node) {
            $nodesArray[$node->getUuid()] = $node;
        }
        foreach ($rootNodes as $node) {
            $evaluation = $user ?
                $this->resourceEvalManager->getResourceUserEvaluation($node, $user, false) :
                null;
            $item = $this->serializer->serialize($node, [Options::SERIALIZE_MINIMAL, Options::IS_RECURSIVE]);
            $item['level'] = 0;
            $item['openingUrl'] = ['claro_resource_show_short', ['id' => $item['id']]];
            $item['validated'] = !is_null($evaluation) && 0 < $evaluation->getNbOpenings();
            $items[] = $item;

            if (isset($item['children']) && 0 < count($item['children'])) {
                usort($item['children'], function ($a, $b) {
                    return strcmp($a['name'], $b['name']);
                });

                foreach ($item['children'] as $child) {
                    if (isset($nodesArray[$child['id']])) {
                        $childEval = $user ?
                            $this->resourceEvalManager->getResourceUserEvaluation($nodesArray[$child['id']], $user, false) :
                            null;
                        $childItem = $child;
                        $childItem['level'] = 1;
                        $childItem['openingUrl'] = ['claro_resource_show_short', ['id' => $childItem['id']]];
                        $childItem['validated'] = !is_null($childEval) && 0 < $childEval->getNbOpenings();
                        $items[] = $childItem;
                    }
                }
            }
        }

        return $items;
    }
}
