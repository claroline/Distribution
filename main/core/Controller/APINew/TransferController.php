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

use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\API\TransferProvider;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route("transfer")
 */
class TransferController
{
    /**
     * @DI\InjectParams({
     *    "provider" = @DI\Inject("claroline.api.transfer")
     * })
     */
    public function __construct(TransferProvider $provider)
    {
        $this->provider = $provider;
    }

    /**
     * @Route("/import/{action}", name="apiv2_transfer_import")
     * @Method("POST")
     */
    public function importAction($action, Request $request)
    {
        $data = $this->getData($request);
        $this->provider->import($data['data'], $action, $data['mime_type']);

        return new JsonResponse('done', 200);
    }

    /**
     * @Route("/actions", name="apiv2_transfer_actions")
     * @Method("GET")
     */
    public function getAvailableActions()
    {
        return new JsonResponse($this->provider->getAvailableActions());
    }

    private function getData(Request $request)
    {
        $files = $request->files->all();

        if (count($files) > 1) {
            $file = $files[0];

            return [
              'data' => file_get_contents($file->getPathname()),
              'mime_type' => $file->getMimeType()
            ];
        }

        //maybe it's in the body request, who knows ?
        return [
          'data' => $request->getContent(),
          'mime_type' => $request->headers->get('content_type')
        ];
    }
}
