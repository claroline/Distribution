<?php

namespace Claroline\AppBundle\Controller;

use Claroline\CoreBundle\Validator\Exception\InvalidDataException;
use Symfony\Component\DependencyInjection\ContainerAware;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

abstract class AbstractApiController extends ContainerAware
{
    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    /**
     * @param Request $request
     *
     * @return array
     *
     * @throws InvalidDataException
     */
    protected function decodeRequest(Request $request)
    {
        $decodedRequest = json_decode($request->getContent(), true);

        if (null === $decodedRequest) {
            throw new InvalidDataException('Invalid request content sent.', []);
        }

        return $decodedRequest;
    }

    protected function sendResponse($data, $code = 200)
    {
        $request = $this->container->get('request_stack')->getMasterRequest();
        $debug = $request->query->get('debug');

        if (!$debug) {
            return new JsonResponse($data, $code);
        }

        //this is for debug purpose
        return new Response('<body>'.json_encode($data).'</body>', $code);
    }
}
