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
