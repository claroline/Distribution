<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Manager\Resource\ResourceActionManager;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @EXT\Route("/resources", options={"expose"=true})
 */
class ResourceController
{
    use PermissionCheckerTrait;

    /** @var ResourceActionManager */
    private $actionManager;

    /**
     * ResourceController constructor.
     *
     * @DI\InjectParams({
     *     "actionManager" = @DI\Inject("claroline.manager.resource_action")
     * })
     *
     * @param ResourceActionManager $actionManager
     */
    public function __construct(ResourceActionManager $actionManager)
    {
        $this->actionManager = $actionManager;
    }

    /**
     * Executes an action on one resource.
     *
     * @EXT\Route("/{action}/{id}", name="claro_resource_action_short")
     * @EXT\Route("/{resourceType}/{action}/{id}", name="claro_resource_action")
     *
     * @param Request      $request
     * @param ResourceNode $resourceNode
     * @param string       $action
     *
     * @return Response
     *
     * @throws NotFoundHttpException
     */
    public function singleAction(Request $request, ResourceNode $resourceNode, $action)
    {
        if (!$this->actionManager->support($resourceNode, $action, $request->getMethod())) {
            // undefined action
            throw new NotFoundHttpException(
                sprintf('The action %s with method [%s] does not exist for resource %s.', $action, $request->getMethod(), $resourceNode->getResourceType()->getName())
            );
        }

        // check current user rights
        // $this->checkPermission($resourceAction->getMask(), $resourceNode, [], true);

        // read request and get user query
        $parameters = $request->query->all();
        $content = null;
        if (!empty($request->getContent())) {
            $content = json_decode($request->getContent(), true);
        }

        // dispatch action event
        return $this->actionManager->execute($resourceNode, $action, $parameters, $content);
    }

    public function bulkAction(Request $request)
    {

    }
}
