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
use Claroline\CoreBundle\Entity\Workspace\Requirements;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route("/workspace")
 */
class RequirementsController
{
    /** @var FinderProvider */
    private $finder;
    /** @var SerializerProvider */
    private $serializer;

    /**
     * RequirementsController constructor.
     *
     * @param FinderProvider     $finder
     * @param SerializerProvider $serializer
     */
    public function __construct(FinderProvider $finder, SerializerProvider $serializer)
    {
        $this->finder = $finder;
        $this->serializer = $serializer;
    }

    /**
     * @Route(
     *    "/{workspace}/requirements/roles/list",
     *    name="apiv2_workspace_requirements_roles_list"
     * )
     * @Method("GET")
     * @ParamConverter("workspace", options={"mapping": {"workspace": "slug"}})
     *
     * @param Workspace $workspace
     * @param Request   $request
     *
     * @return JsonResponse
     */
    public function rolesListAction(Workspace $workspace, Request $request)
    {
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
     * @ParamConverter("workspace", options={"mapping": {"workspace": "slug"}})
     *
     * @param Workspace $workspace
     * @param Request   $request
     *
     * @return JsonResponse
     */
    public function usersListAction(Workspace $workspace, Request $request)
    {
        return new JsonResponse($this->finder->search(
            Requirements::class,
            array_merge($request->query->all(), ['hiddenFilters' => [
                'workspace' => $workspace->getUuid(),
                'withUser' => true
            ]])
        ));
    }
}
