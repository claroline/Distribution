<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\APINew\Workspace;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Requirements;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\Workspace\EvaluationManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @Route("/workspace")
 */
class RequirementsController
{
    /** @var AuthorizationCheckerInterface */
    private $authorization;
    /** @var EvaluationManager */
    private $evaluationManager;
    /** @var FinderProvider */
    private $finder;
    /** @var ObjectManager */
    private $om;
    /** @var SerializerProvider */
    private $serializer;

    /**
     * RequirementsController constructor.
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param EvaluationManager             $evaluationManager
     * @param FinderProvider                $finder
     * @param ObjectManager                 $om
     * @param SerializerProvider            $serializer
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        EvaluationManager $evaluationManager,
        FinderProvider $finder,
        ObjectManager $om,
        SerializerProvider $serializer
    ) {
        $this->authorization = $authorization;
        $this->evaluationManager = $evaluationManager;
        $this->finder = $finder;
        $this->om = $om;
        $this->serializer = $serializer;
    }

    /**
     * @Route(
     *    "/{workspace}/requirements/roles/list",
     *    name="apiv2_workspace_requirements_roles_list"
     * )
     * @Method("GET")
     * @ParamConverter("workspace", options={"mapping": {"workspace": "uuid"}})
     *
     * @param Workspace $workspace
     * @param Request   $request
     *
     * @return JsonResponse
     */
    public function rolesListAction(Workspace $workspace, Request $request)
    {
        if (!$this->authorization->isGranted(['dashboard', 'OPEN'], $workspace)) {
            throw new AccessDeniedException();
        }

        return new JsonResponse($this->finder->search(
            Requirements::class,
            array_merge($request->query->all(), ['hiddenFilters' => [
                'workspace' => $workspace->getUuid(),
                'withRole' => true
            ]])
        ));
    }

    /**
     * @Route(
     *    "/{workspace}/requirements/users/list",
     *    name="apiv2_workspace_requirements_users_list"
     * )
     * @Method("GET")
     * @ParamConverter("workspace", options={"mapping": {"workspace": "uuid"}})
     *
     * @param Workspace $workspace
     * @param Request   $request
     *
     * @return JsonResponse
     */
    public function usersListAction(Workspace $workspace, Request $request)
    {
        if (!$this->authorization->isGranted(['dashboard', 'OPEN'], $workspace)) {
            throw new AccessDeniedException();
        }

        return new JsonResponse($this->finder->search(
            Requirements::class,
            array_merge($request->query->all(), ['hiddenFilters' => [
                'workspace' => $workspace->getUuid(),
                'withUser' => true
            ]])
        ));
    }

    /**
     * @Route(
     *    "/{workspace}/requirements/roles/create",
     *    name="apiv2_workspace_requirements_roles_create"
     * )
     * @Method("PUT")
     * @ParamConverter("workspace", options={"mapping": {"workspace": "uuid"}})
     *
     * @param Workspace $workspace
     * @param Request   $request
     *
     * @return JsonResponse
     */
    public function rolesRequirementsCreateAction(Workspace $workspace, Request $request)
    {
        if (!$this->authorization->isGranted(['dashboard', 'OPEN'], $workspace)) {
            throw new AccessDeniedException();
        }
        $roles = $this->decodeIdsString($request, Role::class);
        $this->evaluationManager->createRolesRequirements($workspace, $roles);

        return new JsonResponse();
    }

    /**
     * @Route(
     *    "/{workspace}/requirements/users/create",
     *    name="apiv2_workspace_requirements_users_create"
     * )
     * @Method("PUT")
     * @ParamConverter("workspace", options={"mapping": {"workspace": "uuid"}})
     *
     * @param Workspace $workspace
     * @param Request   $request
     *
     * @return JsonResponse
     */
    public function usersRequirementsCreateAction(Workspace $workspace, Request $request)
    {
        if (!$this->authorization->isGranted(['dashboard', 'OPEN'], $workspace)) {
            throw new AccessDeniedException();
        }
        $users = $this->decodeIdsString($request, User::class);
        $this->evaluationManager->createUsersRequirements($workspace, $users);

        return new JsonResponse();
    }
    /**
     * @Route(
     *     "/{workspace}/requirements/delete",
     *     name="apiv2_workspace_requirements_delete"
     * )
     * @Method("DELETE")
     * @ParamConverter("workspace", options={"mapping": {"workspace": "uuid"}})
     *
     * @param Workspace $workspace
     * @param Request   $request
     *
     * @return JsonResponse
     */
    public function deleteBulkAction(Workspace $workspace, Request $request)
    {
        if (!$this->authorization->isGranted(['dashboard', 'OPEN'], $workspace)) {
            throw new AccessDeniedException();
        }
        $requirementsToDelete = $this->decodeIdsString($request, Requirements::class);
        $this->evaluationManager->deleteMultipleRequirements($requirementsToDelete);

        return new JsonResponse();
    }

    /**
     * @param Request $request
     * @param string  $class
     * @param string  $property
     *
     * @return array
     */
    private function decodeIdsString(Request $request, $class, $property = 'ids')
    {
        $ids = $request->query->get($property);

        $property = is_numeric($ids[0]) ? 'id' : 'uuid';

        return $this->om->findList($class, $property, $ids);
    }
}
