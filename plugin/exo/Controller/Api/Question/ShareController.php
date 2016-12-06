<?php

namespace UJM\ExoBundle\Controller\Api\Question;

use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use UJM\ExoBundle\Controller\Api\AbstractController;
use UJM\ExoBundle\Library\Validator\ValidationException;
use UJM\ExoBundle\Manager\Question\ShareManager;

/**
 * Question Controller exposes REST API.
 *
 * @EXT\Route("/questions/share", options={"expose"=true})
 */
class ShareController extends AbstractController
{
    /**
     * @var ShareManager
     */
    private $shareManager;

    /**
     * ShareController constructor.
     *
     * @param ShareManager $shareManager
     */
    public function __construct(ShareManager $shareManager)
    {
        $this->shareManager = $shareManager;
    }

    /**
     * Shares a list of questions to users.
     *
     * @EXT\Route("", name="question_share")
     * @EXT\Method("POST")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function shareAction(Request $request)
    {
        $errors = [];

        $data = $this->decodeRequestData($request);
        if (empty($data)) {
            $errors[] = [
                'path' => '',
                'message' => 'Invalid JSON data.',
            ];
        } else {
            try {
                $this->shareManager->share($data);
            } catch (ValidationException $e) {
                $errors = $e->getErrors();
            }
        }

        if (!empty($errors)) {
            return new JsonResponse($errors, 422);
        } else {
            return new JsonResponse(null, 201);
        }
    }

    /**
     * @EXT\Route("", name="question_share_update")
     * @EXT\Method("DELETE")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function updateAction(Request $request)
    {
    }

    /**
     * @EXT\Route("", name="question_share_delete")
     * @EXT\Method("DELETE")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function deleteAction(Request $request)
    {
        $errors = [];

        if (!empty($errors)) {
            return new JsonResponse($errors, 422);
        } else {
            return new JsonResponse(null, 204);
        }
    }
}
