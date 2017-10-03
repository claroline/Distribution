<?php

namespace Claroline\CoreBundle\Controller\APINew\Model;

use Claroline\CoreBundle\API\Crud;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

trait HasRolesTrait
{
    public function addRoles($uuid, $class, Request $request, $env)
    {
        try {
            $object = $this->find($class, $uuid);
            $roles = $this->decodeIdsString($request, 'Claroline\CoreBundle\Entity\Role');
            $this->crud->patch($object, 'roles', Crud::ADD_ARRAY_ELEMENT, $roles);

            return new JsonResponse(
            $this->serializer->serialize($object)
        );
        } catch (\Exception $e) {
            $this->handleException($e, $env);
        }
    }

    public function removeRoles($uuid, $class, Request $request, $env)
    {
        try {
            $object = $this->find($class, $uuid);
            $roles = $this->decodeIdsString($request, 'Claroline\CoreBundle\Entity\Role');
            $this->crud->patch($object, 'roles', Crud::REMOVE_ARRAY_ELEMENT, $roles);

            return new JsonResponse(
          $this->serializer->serialize($object)
      );
        } catch (\Exception $e) {
            $this->handleException($e, $env);
        }
    }
}
