<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\APINew\Tool\Workspace;

use Claroline\CoreBundle\API\FinderProvider;
use Claroline\CoreBundle\API\SerializerProvider;
use Claroline\CoreBundle\Controller\APINew\AbstractApiController;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\LogManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @Route("/tools/workspace/{workspaceId}/logs", name="workspace_tool_logs", requirements={"workspaceId"="\d+"})
 */
class LogController extends AbstractApiController
{
    /** @var AuthorizationCheckerInterface */
    private $authorizationChecker;

    /** @var  FinderProvider */
    private $finder;

    /** @var  SerializerProvider */
    private $serializer;

    /** @var LogManager */
    private $logManager;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
        $this->authorizationChecker = $container->get('security.authorization_checker');
        $this->finder = $container->get('claroline.api.finder');
        $this->serializer = $container->get('claroline.api.serializer');
        $this->logManager = $container->get('claroline.log.manager');
    }

    /**
     * Get the name of the managed entity.
     *
     * @return string
     */
    public function getName()
    {
        return 'log';
    }

    /**
     * @param Request $request
     * @param Workspace $workspace
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/", name="apiv2_workspace_tool_logs_list")
     * @Method("GET")
     *
     * @ParamConverter("workspace", class="Claroline\CoreBundle\Entity\Workspace\Workspace", options={"mapping": {"workspaceId": "id"}})
     */
    public function listAction(Request $request, Workspace $workspace)
    {
        if (!$this->authorizationChecker->isGranted('logs', $workspace)) {
            throw new AccessDeniedHttpException();
        }

        $query = $request->query->all();
        $hiddenFilters = isset($query['hiddenFilters']) ? $query['hiddenFilters'] : [];
        $query['hiddenFilters'] = array_merge($hiddenFilters, ['workspace' => $workspace]);

        return new JsonResponse($this->finder->search(
            $this->getClass(),
            $query,
            []
        ));
    }

    /**
     * @param Workspace $workspace
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/{id}", name="apiv2_workspace_tool_logs_get", requirements={"id"="\d+"})
     * @Method("GET")
     *
     * @ParamConverter("workspace", class="Claroline\CoreBundle\Entity\Workspace\Workspace", options={"mapping": {"workspaceId": "id"}})
     */
    public function getAction(Workspace $workspace, $id)
    {
        if (!$this->authorizationChecker->isGranted('logs', $workspace)) {
            throw new AccessDeniedHttpException();
        }

        $log = $this->logManager->getLog($id);

        return new JsonResponse($this->serializer->serialize($log, []));
    }

    public function getClass() {
        return 'Claroline\CoreBundle\Entity\Log\Log';
    }
}
