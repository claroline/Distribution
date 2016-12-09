<?php

namespace UJM\ExoBundle\Controller\Api;

use Claroline\CoreBundle\Entity\User;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use UJM\ExoBundle\Entity\Question;
use UJM\ExoBundle\Manager\QuestionManager;
use UJM\ExoBundle\Transfer\Json\ValidationException;

/**
 * Question Controller.
 *
 * @EXT\Route(
 *     "/questions",
 *     options={"expose"=true},
 *     defaults={"_format": "json"}
 * )
 * @EXT\Method("GET")
 */
class QuestionController
{
    /**
     * @var QuestionManager
     */
    private $questionManager;

    /**
     * QuestionController constructor.
     *
     * @DI\InjectParams({
     *     "questionManager" = @DI\Inject("ujm_exo.manager.question")
     * })
     *
     * @param QuestionManager $questionManager
     */
    public function __construct(QuestionManager $questionManager)
    {
        $this->questionManager = $questionManager;
    }

    /**
     * Lists all the Questions of the current User
     * (its owns and the ones that are shared with him).
     *
     * @EXT\Route("", name="question_list")
     * @EXT\Method("POST")
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * @param User $user
     *
     * @return JsonResponse
     */
    public function listAction(User $user)
    {
        return new JsonResponse(
            $this->questionManager->exportUserQuestions($user, [
                'includeSolutions' => true,
                'includeUsedBy' => true,
            ])
        );
    }

    /**
     * Gets detail information about a Question.
     *
     * @EXT\Route("/{id}", name="question_get")
     * @EXT\Method("POST")
     *
     * @param Question $question
     *
     * @return JsonResponse
     */
    public function getAction(Question $question)
    {
        return new JsonResponse(
            $this->questionManager->export($question, [
                'includeSolutions' => true,
                'includeUsedBy' => true,
            ])
        );
    }

    /**
     * Creates a new Question.
     *
     * @EXT\Route("", name="question_create")
     * @EXT\Method("POST")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function createAction(Request $request)
    {
        $errors = [];
        $question = null;

        $data = $this->decodeRequestData($request);
        if (empty($data)) {
            // Invalid or empty JSON data received
            $errors[] = [
                'path' => '',
                'message' => 'Invalid JSON data',
            ];
        } else {
            // Try to update question with data
            try {
                $question = $this->questionManager->create($data);
            } catch (ValidationException $e) {
                $errors = $e->getErrors();
            }
        }

        if (empty($errors)) {
            // Question updated
            return new JsonResponse(
                $this->questionManager->export($question, [
                    'includeSolutions' => true,
                    'includeUsedBy' => true,
                ])
            );
        } else {
            // Invalid data received
            return new JsonResponse($errors, 422);
        }
    }

    /**
     * Updates a Question.
     *
     * @EXT\Route("/{id}", name="question_update")
     * @EXT\Method("PUT")
     *
     * @param Question $question
     * @param Request  $request
     *
     * @return JsonResponse
     */
    public function updateAction(Question $question, Request $request)
    {
        $errors = [];

        $data = $this->decodeRequestData($request);
        if (empty($data)) {
            // Invalid or empty JSON data received
            $errors[] = [
                'path' => '',
                'message' => 'Invalid JSON data',
            ];
        } else {
            // Try to update question with data
            try {
                $question = $this->questionManager->update($question, $data);
            } catch (ValidationException $e) {
                $errors = $e->getErrors();
            }
        }

        if (empty($errors)) {
            // Question updated
            return new JsonResponse(
                $this->questionManager->export($question, [
                    'includeSolutions' => true,
                    'includeUsedBy' => true,
                ])
            );
        } else {
            // Invalid data received
            return new JsonResponse($errors, 422);
        }
    }

    /**
     * Deletes a Question.
     *
     * @EXT\Route("/{id}", name="question_delete")
     * @EXT\Method("DELETE")
     *
     * @param Question $question
     *
     * @return JsonResponse
     */
    public function deleteAction(Question $question)
    {
        try {
            $this->questionManager->delete($question);
        } catch (ValidationException $e) {
            return new JsonResponse($e->getErrors(), 422);
        }

        return new JsonResponse(null, 204);
    }

    /**
     * Gets and Deserializes JSON data from Request.
     *
     * @param Request $request
     *
     * @return mixed $data
     */
    private function decodeRequestData(Request $request)
    {
        $dataRaw = $request->getContent();

        $data = null;
        if (!empty($dataRaw)) {
            $data = json_decode($dataRaw);
        }

        return $data;
    }
}
