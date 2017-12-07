<?php

namespace Claroline\CoreBundle\Controller\APINew\Model;

use Claroline\CoreBundle\API\Crud;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

trait HasRolesTrait
{
    /**
     * @EXT\Route("/{uuid}/role")
     * @EXT\Method("GET")
     *
     * @param string  $uuid
     * @param string  $class
     * @param Request $request
     * @param string  $env
     *
     * @return JsonResponse
     */
    public function listRolesAction($uuid, $class, Request $request, $env)
    {
        return new JsonResponse(
            $this->finder->search('Claroline\CoreBundle\Entity\Role', array_merge(
                $request->query->all(),
                ['hiddenFilters' => [$this->getName() => [$uuid]]]
            ))
        );
    }

    /**
     * @EXT\Route("/{uuid}/role")
     * @EXT\Method("PATCH")
     *
     * @param string  $uuid
     * @param string  $class
     * @param Request $request
     * @param string  $env
     *
     * @return JsonResponse
     */
    public function addRolesAction($uuid, $class, Request $request, $env)
    {
        $object = $this->find($class, $uuid);
        $roles = $this->decodeIdsString($request, 'Claroline\CoreBundle\Entity\Role');
        $this->crud->patch($object, 'role', Crud::COLLECTION_ADD, $roles);

        return new JsonResponse(
            $this->serializer->serialize($object)
        );
    }

    /**
     * @EXT\Route("/{uuid}/role")
     * @EXT\Method("DELETE")
     *
     * @param string  $uuid
     * @param string  $class
     * @param Request $request
     * @param string  $env
     *
     * @return JsonResponse
     */
    public function removeRolesAction($uuid, $class, Request $request, $env)
    {
        $object = $this->find($class, $uuid);
        $roles = $this->decodeIdsString($request, 'Claroline\CoreBundle\Entity\Role');
        $this->crud->patch($object, 'role', Crud::COLLECTION_REMOVE, $roles);

        return new JsonResponse(
          $this->serializer->serialize($object)
      );
    }
}
