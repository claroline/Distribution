<?php

namespace Claroline\CoreBundle\Controller\APINew\Model;

use Claroline\CoreBundle\API\Crud;
use Symfony\Component\HttpFoundation\Request;

trait HasGroupsTrait
{
    public function addGroups($uuid, $class, Request $request, $env)
    {
        try {
            $object = $this->find($class, $uuid);
            $groups = $this->decodeIdsString($request, $class);
            $this->crud->patch($object, 'groups', Crud::ADD_ARRAY_ELEMENT, $groups);

            return new JsonResponse(
                $this->serializer->serialize($object)
            );
        } catch (\Exception $e) {
            $this->handleException($e, $env);
        }
    }

    public function removeGroups($uuid, $class, Request $request, $env)
    {
        try {
            $object = $this->find($class, $uuid);
            $groups = $this->decodeIdsString($request, $class);
            $this->crud->patch($object, 'groups', Crud::REMOVE_ARRAY_ELEMENT, $groups);

            return new JsonResponse(
              $this->serializer->serialize($object)
          );
        } catch (\Exception $e) {
            $this->handleException($e, $env);
        }
    }
}
