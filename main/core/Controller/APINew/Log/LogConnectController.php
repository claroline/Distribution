<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\APINew\Log;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\ToolManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @EXT\Route("/log_connect")
 */
class LogConnectController
{
    /** @var AuthorizationCheckerInterface */
    protected $authorization;

    /** @var FinderProvider */
    protected $finder;

    /** @var ToolManager */
    private $toolManager;

    /**
     * CourseController constructor.
     *
     * @DI\InjectParams({
     *     "authorization" = @DI\Inject("security.authorization_checker"),
     *     "finder"        = @DI\Inject("claroline.api.finder"),
     *     "toolManager"   = @DI\Inject("claroline.manager.tool_manager")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param FinderProvider                $finder
     * @param ToolManager                   $toolManager
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        FinderProvider $finder,
        ToolManager $toolManager
    ) {
        $this->authorization = $authorization;
        $this->finder = $finder;
        $this->toolManager = $toolManager;
    }

    public function getName()
    {
        return 'log_connect_platform';
    }

    /**
     * @EXT\Route(
     *     "/platform/list",
     *     name="apiv2_log_connect_platform_list"
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param User    $user
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function logConnectPlatformListAction(User $user, Request $request)
    {
        $this->checkToolAccess();
        $isAdmin = $this->authorization->isGranted('ROLE_ADMIN');
        $hiddenFilters = $isAdmin ?
            [] :
            ['hiddenFilters' => [
                'organizations' => array_map(function (Organization $organization) {
                    return $organization->getUuid();
                }, $user->getAdministratedOrganizations()->toArray()),
            ]];

        return new JsonResponse(
            $this->finder->search('Claroline\CoreBundle\Entity\Log\Connection\LogConnectPlatform', array_merge(
                $request->query->all(),
                $hiddenFilters
            ))
        );
    }

    /**
     * @EXT\Route(
     *     "/platform/csv",
     *     name="apiv2_log_connect_platform_list_csv"
     * )
     * @EXT\Method("GET")
     *
     * @param Request $request
     *
     * @return StreamedResponse
     */
    public function logConnectPlatformListCsvAction(Request $request)
    {
        // Filter data, but return all of them
//        $query = $this->addOrganizationFilter($request->query->all());
//        $downloadDate = date('Y-m-d_H-i-s');
//
//        return new StreamedResponse(function () use ($query) {
//            $this->logManager->exportUserActionToCsv($query);
//        }, 200, [
//            'Content-Type' => 'application/force-download',
//            'Content-Disposition' => 'attachment; filename="connection_time_platform_'.$downloadDate.'.csv"',
//        ]);
    }

    /**
     * @param string $rights
     */
    private function checkToolAccess($rights = 'OPEN')
    {
        $logsTool = $this->toolManager->getAdminToolByName('claroline_cursus_tool');

        if (is_null($logsTool) || !$this->authorization->isGranted($rights, $logsTool)) {
            throw new AccessDeniedException();
        }
    }
}
