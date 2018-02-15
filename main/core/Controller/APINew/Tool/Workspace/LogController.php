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

use Claroline\CoreBundle\Annotations\ApiMeta;
use Claroline\CoreBundle\Controller\APINew\AbstractCrudController;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @ApiMeta(class="Claroline\CoreBundle\Entity\Log\Log",
 *     ignore={"create", "update", "deleteBulk", "copyBulk", "exist", "schema"})
 * @Route("/tools/workspace/{workspaceId}/logs", name="workspace_tool_logs", requirements={"workspaceId"="\d+"})
 */
class LogController extends AbstractCrudController
{
    /** @var AuthorizationCheckerInterface */
    private $authorizationChecker;

    /**
     * LogController constructor.
     *
     * @DI\InjectParams({
     *      "authorizationChecker" = @DI\Inject("security.authorization_checker")
     * })
     */
    public function __construct(AuthorizationCheckerInterface $authorizationChecker)
    {
        $this->authorizationChecker = $authorizationChecker;
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
     * @param string  $workspaceId
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @ParamConverter("workspace", class="Claroline\CoreBundle\Entity\Workspace\Workspace", options={"mapping": {"workspaceId": "id"}})
     */
    public function listAction(Request $request, $workspace)
    {
        if (!$this->authorizationChecker->isGranted('logs', $workspace)) {
            throw new AccessDeniedHttpException();
        }

        $hiddenFilters = empty($request->query->get('hiddenFilters')) ? [] : $request->query->get('hiddenFilters');
        $hiddenFilters = array_merge($hiddenFilters, ['workspace' => $workspace]);
        $request->query->set('hiddenFilters', $hiddenFilters);

        return parent::listAction($request, 'Claroline\CoreBundle\Entity\Log\Log');
    }
}
