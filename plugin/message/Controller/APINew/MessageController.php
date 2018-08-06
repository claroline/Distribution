<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MessageBundle\Controller\APINew;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\MessageBundle\Entity\Message;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @EXT\Route("/message")
 */
class MessageController extends AbstractCrudController
{
    /** @return string */
    public function getName()
    {
        return 'message';
    }

    /**
     * @EXT\Route("/received", name="apiv2_message_received")
     * @EXT\Method("GET")
     *
     * @return JsonResponse
     */
    public function getReceivedAction(Request $request)
    {
        return new JsonResponse(
          $this->finder->search($this->getClass(), array_merge(
              $request->query->all(),
              ['hiddenFilters' => ['removed' => false, 'sent' => false]]
          ))
        );
    }

    /**
     * @EXT\Route("/removed", name="apiv2_message_removed")
     * @EXT\Method("GET")
     *
     * @return JsonResponse
     */
    public function getRemovedAction(Request $request)
    {
        return new JsonResponse(
          $this->finder->search($this->getClass(), array_merge(
              $request->query->all(),
              ['hiddenFilters' => ['removed' => true]]
          ))
        );
    }

    /**
     * @EXT\Route("/sent", name="apiv2_message_sent")
     * @EXT\Method("GET")
     *
     * @return JsonResponse
     */
    public function getSentAction(Request $request)
    {
        return new JsonResponse(
          $this->finder->search($this->getClass(), array_merge(
              $request->query->all(),
              ['hiddenFilters' => ['sent' => true, 'removed' => false]]
          ))
        );
    }

    /**
     * @EXT\Route("/softdelete", name="apiv2_message_soft_delete")
     * @EXT\Method("PUT")
     *
     * @return JsonResponse
     */
    public function softDeleteAction(Request $request)
    {
        $messages = $this->decodeIdsString($request, $this->getClass());
        $updated = [];

        $this->om->startFlushSuite();

        foreach ($messages as $message) {
            $data = [
                'id' => $message->getId(),
                'meta' => [
                    'removed' => true,
                ],
            ];
            $updated[] = $this->crud->update($this->getClass(), $data);
        }

        $this->om->endFlushSuite();

        return new JsonResponse(array_map(function (Message $message) {
            return $this->serializer->serialize($message);
        }, $messages));
    }

    /**
     * @EXT\Route("/restore", name="apiv2_message_restore")
     * @EXT\Method("PUT")
     *
     * @return JsonResponse
     */
    public function softUndeleteAction(Request $request)
    {
        $messages = $this->decodeIdsString($request, $this->getClass());
        $updated = [];

        $this->om->startFlushSuite();

        foreach ($messages as $message) {
            $data = [
                'id' => $message->getId(),
                'meta' => [
                    'removed' => false,
                ],
            ];
            $updated[] = $this->crud->update($this->getClass(), $data);
        }

        $this->om->endFlushSuite();

        return new JsonResponse(array_map(function (Message $message) {
            return $this->serializer->serialize($message);
        }, $messages));
    }

    /**
     * @EXT\Route("/read", name="apiv2_message_read")
     * @EXT\Method("PUT")
     *
     * @return JsonResponse
     */
    public function readAction(Request $request)
    {
        $messages = $this->decodeIdsString($request, $this->getClass());
        $updated = [];

        $this->om->startFlushSuite();

        foreach ($messages as $message) {
            $data = [
                'id' => $message->getId(),
                'meta' => [
                    'read' => true,
                ],
            ];
            $updated[] = $this->crud->update($this->getClass(), $data);
        }

        $this->om->endFlushSuite();

        return new JsonResponse(array_map(function (Message $message) {
            return $this->serializer->serialize($message);
        }, $messages));
    }

    /**
     * @EXT\Route("/unread", name="apiv2_message_unread")
     * @EXT\Method("PUT")
     *
     * @return JsonResponse
     */
    public function unreadAction(Request $request)
    {
        $messages = $this->decodeIdsString($request, $this->getClass());
        $updated = [];

        $this->om->startFlushSuite();

        foreach ($messages as $message) {
            $data = [
                'id' => $message->getId(),
                'meta' => [
                    'read' => false,
                ],
            ];
            $updated[] = $this->crud->update($this->getClass(), $data);
        }

        $this->om->endFlushSuite();

        return new JsonResponse(array_map(function (Message $message) {
            return $this->serializer->serialize($message);
        }, $messages));
    }

    /**
     * @EXT\Route("/remove", name="apiv2_message_user_remove")
     * @EXT\Method("DELETE")
     *
     * @return JsonResponse
     */
    public function hardRemoveAction(Request $request)
    {
        $ids = $request->query->get('ids');

        $this->om->startFlushSuite();

        foreach ($ids as $id) {
            $message = $this->om->getRepository($this->getClass())->find($id);
            $this->container->get('claroline.manager.message_manager')->remove($message);
        }

        $this->om->endFlushSuite();

        return new JsonResponse(null, 204);
    }

    public function getOptions()
    {
        return [
            'get' => [Options::IS_RECURSIVE],
        ];
    }

    public function getClass()
    {
        return Message::class;
    }
}
