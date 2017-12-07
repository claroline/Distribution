<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\APINew;

use Claroline\CoreBundle\API\TransferProvider;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route("/transfer")
 */
class TransferController
{
    /** @var TransferProvider */
    private $provider;

    /**
     * @DI\InjectParams({
     *    "provider" = @DI\Inject("claroline.api.transfer")
     * })
     *
     * @param TransferProvider $provider
     */
    public function __construct(TransferProvider $provider)
    {
        $this->provider = $provider;
    }

    /**
     * Difference with file controller ?
     *
     * @Route(
     *    "/execute/{action}",
     *    name="apiv2_transfer_execute",
     *    defaults={"action" = "json"},
     * )
     * @Method("POST")
     */
    public function executeAction($action, Request $request)
    {
        $data = $this->getData($request);
        $this->provider->execute(
            $data['data'],
            $action,
            $data['mime_type'],
            $this->getLogFile($request)
        );

        return new JsonResponse('done', 200);
    }

    /**
     * @Route("/action/{name}/{format}", name="apiv2_transfer_action")
     * @Method("GET")
     */
    public function getAction($name, $format)
    {
        return new JsonResponse($this->provider->explainAction($name, $format));
    }

    /**
     * @Route("/actions/{format}", name="apiv2_transfer_actions")
     * @Method("GET")
     */
    public function getAvailableActions($format)
    {
        return new JsonResponse($this->provider->getAvailableActions($format));
    }

    /**
     * @param Request $request
     *
     * @return array
     */
    private function getData(Request $request)
    {
        $files = $request->files->all();

        if (count($files) > 1) {
            $file = $files[0];

            return [
              'data' => file_get_contents($file->getPathname()),
              'mime_type' => $file->getMimeType(),
            ];
        }

        //maybe it's in the body request, who knows ?
        return [
          'data' => $request->getContent(),
          'mime_type' => $request->headers->get('content_type'),
        ];
    }

    /**
     * @param Request $request
     *
     * @return string
     */
    private function getLogFile(Request $request)
    {
        return $request->query->get('log');
    }
}
