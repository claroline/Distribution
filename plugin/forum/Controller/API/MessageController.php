<?php

namespace Claroline\ForumBundle\Controller\API;

use Claroline\AppBundle\Annotations\ApiDoc;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

/**
 * @EXT\Route("/forum_message")
 */
class MessageController extends AbstractCrudController
{
    public function getName()
    {
        return 'forum_message';
    }

    /**
     * @EXT\Route("/{id}/comment")
     * @EXT\Method("POST")
     * @ParamConverter("message", options={"mapping": {"id": "uuid"}})
     *
     * @ApiDoc(
     *     description="Create a comment in a message",
     *     parameters={
     *         "id": {
     *              "type": {"string", "integer"},
     *              "description": "The message id or uuid"
     *          }
     *     }
     * )
     *
     * @param string  $id
     * @param string  $class
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function createComment(Message $message, Request $request)
    {
        $message = $this->serializer->serialize($message);
        $data = $this->decodeRequest($request);
        $data['parent'] = $message;

        $object = $this->crud->create(
            'Claroline\ForumBundle\Entity\Message',
            $data,
            $this->options['create']
        );

        if (is_array($object)) {
            return new JsonResponse($object, 400);
        }

        return new JsonResponse(
            $this->serializer->serialize($object, $this->options['get']),
            201
        );
    }

    public function getClass()
    {
        return "Claroline\ForumBundle\Entity\Message";
    }
}
