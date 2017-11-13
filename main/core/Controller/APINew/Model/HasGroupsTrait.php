<?php

namespace Claroline\CoreBundle\Controller\APINew\Model;

use Claroline\CoreBundle\API\Crud;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

trait HasGroupsTrait
{
    /**
     * @Route("{id}/group")
     * @Method("PATCH")
     */
    public function addGroupsAction($id, $class, Request $request, $env)
    {
        try {
            $object = $this->find($class, $id);
            $groups = $this->decodeIdsString($request, 'Claroline\CoreBundle\Entity\Group');
            $this->crud->patch($object, 'group', Crud::COLLECTION_ADD, $groups);

            return new JsonResponse(
                $this->serializer->serialize($object)
            );
        } catch (\Exception $e) {
            $this->handleException($e, $env);
        }
    }

    /**
     * @Route("{id}/group")
     * @Method("DELETE")
     */
    public function removeGroupsAction($id, $class, Request $request, $env)
    {
        try {
            $object = $this->find($class, $id);
            $groups = $this->decodeIdsString($request, 'Claroline\CoreBundle\Entity\Group');
            $this->crud->patch($object, 'group', Crud::COLLECTION_REMOVE, $groups);

            return new JsonResponse(
              $this->serializer->serialize($object)
          );
        } catch (\Exception $e) {
            $this->handleException($e, $env);
        }
    }
}
