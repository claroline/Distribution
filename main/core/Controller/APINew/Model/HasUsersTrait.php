<?php

namespace Claroline\CoreBundle\Controller\APINew\Model;

use Claroline\CoreBundle\API\Crud;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

trait HasUsersTrait
{
    /**
     * @Route("{uuid}/user")
     * @Method("GET")
     *
     * @param string  $uuid
     * @param string  $class
     * @param Request $request
     * @param string  $env
     *
     * @return JsonResponse
     */
    public function listUsersAction($uuid, $class, Request $request, $env)
    {
        return new JsonResponse(
            $this->finder->search('Claroline\CoreBundle\Entity\User', array_merge(
                $request->query->all(),
                ['hiddenFilters' => ['_id' => $uuid]]
            ))
        );
    }

    /**
     * @Route("{uuid}/user")
     * @Method("PATCH")
     */
    public function addUsersAction($uuid, $class, Request $request, $env)
    {
        try {
            $object = $this->find($class, $uuid);
            $users = $this->decodeIdsString($request, 'Claroline\CoreBundle\Entity\User');
            $this->crud->patch($object, 'user', Crud::COLLECTION_ADD, $users);

            return new JsonResponse(
                $this->serializer->serialize($object)
            );
        } catch (\Exception $e) {
            $this->handleException($e, $env);
        }
    }

    /**
     * @Route("{uuid}/user")
     * @Method("DELETE")
     */
    public function removeUsersAction($uuid, $class, Request $request, $env)
    {
        try {
            $object = $this->find($class, $uuid);
            $users = $this->decodeIdsString($request, 'Claroline\CoreBundle\Entity\User');
            $this->crud->patch($object, 'user', Crud::COLLECTION_REMOVE, $users);

            return new JsonResponse(
              $this->serializer->serialize($object)
          );
        } catch (\Exception $e) {
            $this->handleException($e, $env);
        }
    }
}
