<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Innova\PathBundle\Controller\API;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceUserEvaluation;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\ToolManager;
use Innova\PathBundle\Entity\Path\Path;
use Innova\PathBundle\Entity\UserProgression;
use Innova\PathBundle\Manager\UserProgressionManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @EXT\Route("/pathtracking")
 */
class PathTrackingController
{
    /** @var AuthorizationCheckerInterface */
    private $authorization;

    /** @var FinderProvider */
    private $finder;

    /** @var SerializerProvider */
    private $serializer;

    /** @var ToolManager */
    private $toolManager;

    /** @var UserProgressionManager */
    private $userProgressionManager;

    private $userProgressionRepo;

    /**
     * PathTrackingController constructor.
     *
     * @DI\InjectParams({
     *     "authorization"          = @DI\Inject("security.authorization_checker"),
     *     "finder"                 = @DI\Inject("claroline.api.finder"),
     *     "om"                     = @DI\Inject("claroline.persistence.object_manager"),
     *     "serializer"             = @DI\Inject("claroline.api.serializer"),
     *     "toolManager"            = @DI\Inject("claroline.manager.tool_manager"),
     *     "userProgressionManager" = @DI\Inject("innova_path.manager.user_progression")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param FinderProvider                $finder
     * @param ObjectManager                 $om
     * @param SerializerProvider            $serializer
     * @param ToolManager                   $toolManager
     * @param UserProgressionManager        $userProgressionManager
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        FinderProvider $finder,
        ObjectManager $om,
        SerializerProvider $serializer,
        ToolManager $toolManager,
        UserProgressionManager $userProgressionManager
    ) {
        $this->authorization = $authorization;
        $this->finder = $finder;
        $this->serializer = $serializer;
        $this->toolManager = $toolManager;
        $this->userProgressionManager = $userProgressionManager;

        $this->userProgressionRepo = $om->getRepository(UserProgression::class);
    }

    /**
     * Fetch all path trackings of the workspace.
     *
     * @EXT\Route(
     *     "/workspace/{workspace}/paths/tracking",
     *     name="claroline_paths_trackings_fetch"
     * )
     * @EXT\Method("GET")
     * @EXT\ParamConverter(
     *     "workspace",
     *     class="ClarolineCoreBundle:Workspace\Workspace",
     *     options={"mapping": {"workspace": "uuid"}}
     * )
     *
     * @param Workspace $workspace
     *
     * @return JsonResponse
     */
    public function pathsTrackingFetchAction(Workspace $workspace)
    {
        $tool = $this->toolManager->getToolByName('dashboard');

        if (!$tool || !$this->authorization->isGranted('OPEN', $tool)) {
            throw new AccessDeniedException();
        }
        $paths = $this->finder->fetch(
            Path::class,
            ['workspace' => $workspace->getUuid()]
        );
        $data = [];

        foreach ($paths as $path) {
            $steps = $path->getSteps();
            $stepsData = [];

            foreach ($steps as $step) {
                $progressions = $this->userProgressionRepo->findBy(['step' => $step]);
                $stepUsers = [];

                foreach ($progressions as $progression) {
                    if (in_array($progression->getStatus(), ['seen', 'done'])) {
                        $user = $progression->getUser();

                        $stepUsers[] = [
                            'id' => $user->getUuid(),
                            'username' => $user->getUsername(),
                            'name' => $user->getFirstName().' '.$user->getLastName(),
                        ];
                    }
                }
                $stepsData[] = [
                    'step' => [
                        'id' => $step->getUuid(),
                        'title' => $step->getTitle(),
                    ],
                    'users' => $stepUsers,
                ];
            }

            $data[] = [
                'path' => [
                    'id' => $path->getResourceNode()->getUuid(),
                    'name' => $path->getResourceNode()->getName(),
                    'resourceId' => $path->getResourceNode()->getUuid(),
                ],
                'steps' => $stepsData,
            ];
        }

        return new JsonResponse($data, 200);
    }

    /**
     * Fetch path evaluations.
     *
     * @EXT\Route(
     *     "/path/{resourceNode}/evaluations/list",
     *     name="claroline_path_evaluations_list"
     * )
     * @EXT\Method("GET")
     * @EXT\ParamConverter(
     *     "resourceNode",
     *     class="ClarolineCoreBundle:Resource\ResourceNode",
     *     options={"mapping": {"resourceNode": "uuid"}}
     * )
     *
     * @param ResourceNode $resourceNode
     * @param Request      $request
     *
     * @return JsonResponse
     */
    public function pathEvaluationFetchAction(ResourceNode $resourceNode, Request $request)
    {
        $tool = $this->toolManager->getToolByName('dashboard');

        if (!$tool || !$this->authorization->isGranted('OPEN', $tool)) {
            throw new AccessDeniedException();
        }
        $params = $request->query->all();

        if (!isset($params['hiddenFilters'])) {
            $params['hiddenFilters'] = [
                'resourceNode' => $resourceNode->getUuid(),
            ];
        }

        return new JsonResponse(
            $this->finder->search(ResourceUserEvaluation::class, $params)
        );
    }
}
