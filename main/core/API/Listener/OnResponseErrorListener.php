<?php

namespace Claroline\CoreBundle\API\Listener;

use Claroline\CoreBundle\Validator\Exception\InvalidDataException;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;

/**
 * @DI\Service()
 */
class OnResponseErrorListener
{
    /**
     * @DI\Observe("kernel.exception")
     *
     * @param GetResponseForExceptionEvent $event
     */
    public function onKernelRequest(GetResponseForExceptionEvent $event)
    {
        $controller = $event->getRequest()->attributes->get('_controller');

        //get the first controller part
        $class = substr($controller, 0, strpos($controller, ':'));

        if (is_subclass_of($class, 'Claroline\CoreBundle\Controller\APINew\AbstractApiController')) {
            $this->handleError($event->getException(), $event);
        }
    }

    /**
     * @param \Exception                   $exception
     * @param GetResponseForExceptionEvent $event
     */
    private function handleError(\Exception $exception, GetResponseForExceptionEvent $event)
    {
        if ($exception instanceof InvalidDataException) {
            $response = new JsonResponse($exception->getErrors(), 422);
        } else {
            //the json_encode part could be changed
            $response = new JsonResponse(json_encode($exception, 16), 500);
        }

        $event->setResponse($response);
    }
}
