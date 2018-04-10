<?php

namespace Claroline\CoreBundle\Controller\APINew\Tool\Administration;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\CoreBundle\Entity\Log\Log;
use Claroline\CoreBundle\Manager\LogManager;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * @Route("/tools/admin/logs", name="admin_tool_logs")
 * @SEC\PreAuthorize("canOpenAdminTool('platform_logs')")
 */
class LogController
{
    /** @var FinderProvider */
    private $finder;

    /** @var SerializerProvider */
    private $serializer;

    /** @var LogManager */
    private $logManager;

    /**
     * @DI\InjectParams({
     *     "finder"                 = @DI\Inject("claroline.api.finder"),
     *     "serializer"             = @DI\Inject("claroline.api.serializer"),
     *     "logManager"             = @DI\Inject("claroline.log.manager")
     * })
     *
     * LogController constructor.
     *
     * @param FinderProvider     $finder
     * @param SerializerProvider $serializer
     * @param LogManager         $logManager
     */
    public function __construct(
        FinderProvider $finder,
        SerializerProvider $serializer,
        LogManager $logManager
    ) {
        $this->finder = $finder;
        $this->serializer = $serializer;
        $this->logManager = $logManager;
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
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/", name="apiv2_admin_tool_logs_list")
     * @Method("GET")
     */
    public function listAction(Request $request)
    {
        return new JsonResponse($this->finder->search(
            $this->getClass(),
            $request->query->all(),
            []
        ));
    }

    /**
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     * @Route("/csv", name="apiv2_admin_tool_logs_list_csv")
     * @Method("GET")
     */
    public function listCsvAction(Request $request)
    {
        // Filter data, but return all of them
        $query = $request->query->all();
        $dateStr = date('YmdHis');

        return new StreamedResponse(function () use ($query) {
            $this->logManager->exportLogsToCsv($query);
        }, 200, [
            'Content-Type' => 'application/force-download',
            'Content-Disposition' => 'attachment; filename="actions_'.$dateStr.'.csv"',
        ]);
    }

    /**
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/chart", name="apiv2_admin_tool_logs_list_chart")
     * @Method("GET")
     */
    public function listChartAction(Request $request)
    {
        $chartData = $this->logManager->getChartData($request->query->all());

        return new JsonResponse($chartData);
    }

    /**
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/users", name="apiv2_admin_tool_logs_list_users")
     * @Method("GET")
     */
    public function userActionsListAction(Request $request)
    {
        $userList = $this->logManager->getUserActionsList($request->query->all());

        return new JsonResponse($userList);
    }

    /**
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     * @Route("/users/csv", name="apiv2_admin_tool_logs_list_users_csv")
     * @Method("GET")
     */
    public function userActionsListCsvAction(Request $request)
    {
        // Filter data, but return all of them
        $query = $request->query->all();
        $dateStr = date('YmdHis');

        return new StreamedResponse(function () use ($query) {
            $this->logManager->exportUserActionToCsv($query);
        }, 200, [
            'Content-Type' => 'application/force-download',
            'Content-Disposition' => 'attachment; filename="user_actions_'.$dateStr.'.csv"',
        ]);
    }

    /**
     * @param Log $log
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     * @Route("/{id}", name="apiv2_admin_tool_logs_get", requirements={"id"="\d+"})
     * @Method("GET")
     *
     * @ParamConverter("log", class="Claroline\CoreBundle\Entity\Log\Log")
     */
    public function getAction(Log $log)
    {
        return new JsonResponse($this->serializer->serialize($log, ['details' => true]));
    }

    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Log\Log';
    }
}
