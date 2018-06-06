<?php

namespace Claroline\ForumBundle\Controller\API;

use Claroline\AppBundle\Annotations\ApiDoc;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\ForumBundle\Entity\Message;
use Claroline\ForumBundle\Entity\Forum;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

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

    /**
     * @EXT\Route("/{id}/content")
     * @EXT\Method("PUT")
     * @ParamConverter("message", options={"mapping": {"id": "uuid"}})
     *
     * @ApiDoc(
     *     description="Udate a message content",
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
    public function updateMessageContent(Message $message, Request $request)
    {
        $data = $this->decodeRequest($request);
        $content = $data['content'];
        $this->crud->replace($message, 'content', $content);

        return new JsonResponse(
            $this->serializer->serialize($message, $this->options['get']),
            200
        );
    }

    /**
     * @EXT\Route("forum/{forum}/messages/list/flagged", name="apiv2_forum_message_flagged_list")
     * @EXT\Method("GET")
     * @EXT\ParamConverter("forum", class = "ClarolineForumBundle:Forum",  options={"mapping": {"forum": "uuid"}})
     *
     *
     * @param string  $id
     * @param string  $class
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getFlaggedMessagesAction(Request $request, Forum $forum)
    {
      return new JsonResponse(
        $this->finder->search($this->getClass(), array_merge(
                $request->query->all(),
                ['hiddenFilters' => ['flagged' => true, 'forum' => $forum->getUuid()]]
            ))
      );
    }

    /**
     * @EXT\Route("forum/{forum}/messages/list/blocked", name="apiv2_forum_message_blocked_list")
     * @EXT\Method("GET")
     * @EXT\ParamConverter("forum", class = "ClarolineForumBundle:Forum",  options={"mapping": {"forum": "uuid"}})
     *
     *
     * @param string  $id
     * @param string  $class
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getBlockedMessagesAction(Request $request, Forum $forum)
    {
      return new JsonResponse(
        $this->finder->search($this->getClass(), array_merge(
                $request->query->all(),
                ['hiddenFilters' => ['visible' => false, 'forum' => $forum->getUuid()]]
            ))
      );
    }

    public function getClass()
    {
        return "Claroline\ForumBundle\Entity\Message";
    }
}
