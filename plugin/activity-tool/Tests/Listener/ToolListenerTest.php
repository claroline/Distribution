<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ActivityToolBundle\Listener;

use Claroline\CoreBundle\Library\Testing\MockeryTestCase;
use Mockery as m;

class ToolListenerTest extends MockeryTestCase
{
    //    private $container;
    private $toolListener;
    private $em;
    private $activityRepo;
    private $resourceManager;
    private $securityContext;
    private $templating;
    private $utils;

    protected function setUp()
    {
        parent::setUp();
        $this->em = $this->mock('Doctrine\ORM\EntityManager');
        $this->activityRepo = $this->mock('Claroline\CoreBundle\Repository\ActivityRepository');
        $this->resourceManager = $this->mock('Claroline\CoreBundle\Manager\ResourceManager');
        $this->securityContext = $this->mock('Symfony\Component\Security\Core\SecurityContext');
        $this->templating = $this->mock('Symfony\Bundle\TwigBundle\TwigEngine');
        $this->utils = $this->mock('Claroline\CoreBundle\Library\Security\Utilities');

        $this->em->shouldReceive('getRepository')
            ->with('ClarolineCoreBundle:Resource\Activity')
            ->once()
            ->andReturn($this->activityRepo);

        $this->toolListener = new ToolListener(
            $this->em,
            $this->resourceManager,
            $this->securityContext,
            $this->templating,
            $this->utils
        );
    }

    public function testFetchActivitiesDatasForDesktopTool()
    {
        $token = $this->mock('Symfony\Component\Security\Core\Authentication\Token\TokenInterface');
        $startDate = $this->mock('\DateTime');

        $this->securityContext
            ->shouldReceive('getToken')
            ->once()
            ->andReturn($token);
        $this->utils
            ->shouldReceive('getRoles')
            ->with($token)
            ->once()
            ->andReturn([]);
        $this->resourceManager
            ->shouldReceive('getByCriteria')
            ->with(['roots' => [], 'types' => ['activity']], [], true)
            ->once()
            ->andReturn(
                [
                    [
                        'id' => 1,
                        'name' => 'my_resource',
                        'path' => 'my_path',
                        'parent_id' => 2,
                        'creator_username' => 'my_name',
                        'type' => 'activity',
                        'previous_id' => 3,
                        'next_id' => 4,
                        'large_icon' => 'no_icon',
                    ],
                ]
            );
        $this->resourceManager
            ->shouldReceive('getWorkspaceInfoByIds')
            ->with([1])
            ->once()
            ->andReturn(
                [
                    [
                        'id' => 1,
                        'code' => 'workspace_code',
                        'name' => 'workspace_name',
                    ],
                ]
            );
        $this->activityRepo
            ->shouldReceive('findActivitiesByNodeIds')
            ->with([1])
            ->once()
            ->andReturn(
                [
                    [
                        'nodeId' => 1,
                        'instructions' => 'my_instructions',
                        'startDate' => $startDate,
                        'endDate' => null,
                    ],
                ]
            );
        $startDate->shouldReceive('format')
            ->with('Y-m-d H:i:s')
            ->once()
            ->andReturn('2013-06-18 10:49:00');

        $this->assertEquals(
            [
                'resourceInfos' => [
                    1 => [
                        'id' => 1,
                        'name' => 'my_resource',
                        'path' => 'my_path',
                        'parent_id' => 2,
                        'creator_username' => 'my_name',
                        'type' => 'activity',
                        'previous_id' => 3,
                        'next_id' => 4,
                        'large_icon' => 'no_icon',
                    ],
                ],
                'activityInfos' => [
                    1 => [
                        'instructions' => 'my_instructions',
                        'startDate' => '2013-06-18 10:49:00',
                        'endDate' => '-',
                    ],
                ],
                'workspaceInfos' => [
                    'workspace_code' => [
                        'code' => 'workspace_code',
                        'name' => 'workspace_name',
                        'nodes' => [1],
                    ],
                ],
            ],
            $this->toolListener->fetchActivitiesDatas(true, null)
        );
    }

    public function testFetchActivitiesDatasForWorkspaceTool()
    {
        $token = $this->mock('Symfony\Component\Security\Core\Authentication\Token\TokenInterface');
        $workspace = $this->mock('Claroline\CoreBundle\Entity\Workspace\Workspace');
        $root = $this->mock('Claroline\CoreBundle\Entity\Resource\ResourceNode');
        $startDate = $this->mock('\DateTime');

        $this->securityContext
            ->shouldReceive('getToken')
            ->once()
            ->andReturn($token);
        $this->utils
            ->shouldReceive('getRoles')
            ->with($token)
            ->once()
            ->andReturn([]);
        $this->resourceManager
            ->shouldReceive('getWorkspaceRoot')
            ->with($workspace)
            ->once()
            ->andReturn($root);
        $root->shouldReceive('getPath')
            ->once()
            ->andReturn('my_path');
        $this->resourceManager
            ->shouldReceive('getByCriteria')
            ->with(['roots' => ['my_path'], 'types' => ['activity']], [], true)
            ->once()
            ->andReturn(
                [
                    [
                        'id' => 1,
                        'name' => 'my_resource',
                        'path' => 'my_path',
                        'parent_id' => 2,
                        'creator_username' => 'my_name',
                        'type' => 'activity',
                        'previous_id' => 3,
                        'next_id' => 4,
                        'large_icon' => 'no_icon',
                    ],
                ]
            );
        $this->activityRepo
            ->shouldReceive('findActivitiesByNodeIds')
            ->with([1])
            ->once()
            ->andReturn(
                [
                    [
                        'nodeId' => 1,
                        'instructions' => 'my_instructions',
                        'startDate' => $startDate,
                        'endDate' => null,
                    ],
                ]
            );
        $startDate->shouldReceive('format')
            ->with('Y-m-d H:i:s')
            ->once()
            ->andReturn('2013-06-18 10:49:00');

        $this->assertEquals(
            [
                'resourceInfos' => [
                    1 => [
                        'id' => 1,
                        'name' => 'my_resource',
                        'path' => 'my_path',
                        'parent_id' => 2,
                        'creator_username' => 'my_name',
                        'type' => 'activity',
                        'previous_id' => 3,
                        'next_id' => 4,
                        'large_icon' => 'no_icon',
                    ],
                ],
                'activityInfos' => [
                    1 => [
                        'instructions' => 'my_instructions',
                        'startDate' => '2013-06-18 10:49:00',
                        'endDate' => '-',
                    ],
                ],
            ],
            $this->toolListener->fetchActivitiesDatas(false, $workspace)
        );
    }
}
