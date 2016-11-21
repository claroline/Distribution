<?php

namespace UJM\ExoBundle\Controller\Api;

use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Library\Validator\ValidationException;
use UJM\ExoBundle\Manager\QTIManager;

/**
 * Transfers exercises and questions in QTI format.
 *
 * @EXT\Route("/qti", options={"expose"=true})
 */
class QTIController
{
    /**
     * @var QTIManager
     */
    private $qtiManager;

    /**
     * QTIController constructor.
     *
     * @DI\InjectParams({
     *     "qtiManager" = @DI\Inject("ujm_exo.manager.qti")
     * })
     *
     * @param QTIManager $qtiManager
     */
    public function __construct(QTIManager $qtiManager)
    {
        $this->qtiManager = $qtiManager;
    }

    /**
     * Imports a QTI archive.
     *
     * @EXT\Route("", name="question_qti_import")
     * @EXT\Method("POST")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function importAction(Request $request)
    {
        $errors = [];
        $questions = [];

        try {
            $questions = $this->qtiManager->importItems();
        } catch (ValidationException $e) {
            $errors = $e->getErrors();
        }

        if (!empty($errors)) {
            // Return errors
            return new JsonResponse($errors, 422);
        } else {
            // Returns the list of imported questions
            return new JsonResponse($questions);
        }
    }

    /**
     * Exports exercise in QTI format.
     *
     * @EXT\Route("/exercises/{id}", name="exercise_qti_export")
     * @EXT\Method("GET")
     *
     * @param Exercise $exercise
     *
     * @return StreamedResponse
     */
    public function exportExerciseAction(Exercise $exercise)
    {
        return new StreamedResponse(function () use ($exercise) {
            return $this->qtiManager->exportExercise($exercise);
        }, 200, [
            'Content-Type' => 'application/force-download',
            'Content-Disposition' => 'attachment; filename="qti-test.csv"',
        ]);
    }

    /**
     * Exports questions in QTI format.
     *
     * @EXT\Route("/questions", name="question_qti_export")
     * @EXT\Method("GET")
     *
     * @param Request $request
     *
     * @return StreamedResponse
     */
    public function exportQuestionsAction(Request $request)
    {
        return new StreamedResponse(function () {
            return $this->qtiManager->exportQuestions([]);
        }, 200, [
            'Content-Type' => 'application/force-download',
            'Content-Disposition' => 'attachment; filename="qti-items.csv"',
        ]);
    }
}
