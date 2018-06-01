<?php

namespace Claroline\CoreBundle\Controller\APINew\Model;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;

trait HasParentTrait
{
    /**
     * @Route("/{parent}/move/{child}")
     * @Method("PATCH")
     */
    public function moveAction($child, $parent, $class, Request $request)
    {
        $child = $this->find($class, $child);
        $parent = $this->find($class, $parent);
        $this->crud->replace($child, 'parent', $parent);

        return $this->sendResponse($this->serializer->serialize($child));
    }
}
