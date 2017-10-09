<?php

namespace Claroline\CoreBundle\Controller\APINew\Model;

use Claroline\CoreBundle\API\Crud;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

trait IsRecursiveTrait
{
    /**
     * @Route("{child}/move/{parent}")
     * @Method("PATCH")
     */
    public function moveAction($child, $parent, $class, Request $request, $env)
    {
        try {
            $child = $this->find($class, $child);
            $parent = $this->find($class, $parent);
            $this->crud->patch($child, 'parent', Crud::PROPERTY_SET, $parent);

            return new JsonResponse($this->serializer->serialize($child));
        } catch (\Exception $e) {
            $this->handleException($e, $env);
        }
    }
}
