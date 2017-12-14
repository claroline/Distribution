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

use Claroline\CoreBundle\API\FinderProvider;
use Claroline\CoreBundle\API\TransferProvider;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * @Route("/transfer")
 */
class TransferController
{
    /** @var TransferProvider */
    private $provider;

    /** @var FinderProvider */
    private $finder;

    /**
     * @DI\InjectParams({
     *    "provider" = @DI\Inject("claroline.api.transfer"),
     *    "finder"   = @DI\Inject("claroline.api.finder")
     * })
     *
     * @param TransferProvider $provider
     * @param FinderProvider   $finder
     */
    public function __construct(
        TransferProvider $provider,
        FinderProvider $finder
    ) {
        $this->provider = $provider;
        $this->finder = $finder;
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
     * @Route(
     *    "/export/{format}",
     *    name="apiv2_transfer_export"
     * )
     * @Method("GET")
     */
    public function exportAction(Request $request, $format)
    {
        $results = $this->finder->search(
            //maybe use a class map because it's the entity one currently
            $request->query->get('class'),
            $request->query->all(),
            []
        );

        return new Response($this->provider->format($format, $results['data'], $request->query->all()));
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
