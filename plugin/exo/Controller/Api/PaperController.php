<?php

namespace UJM\ExoBundle\Controller\Api;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Security\Collection\ResourceCollection;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Paper;
use UJM\ExoBundle\Entity\Question;
use UJM\ExoBundle\Entity\Step;
use UJM\ExoBundle\Entity\StepQuestion;
use UJM\ExoBundle\Library\Validator\ValidationException;
use UJM\ExoBundle\Manager\AnswerManager;
use UJM\ExoBundle\Manager\PaperManager;
use UJM\ExoBundle\Manager\Question\QuestionManager;

/**
 * Paper Controller.
 *
 * @EXT\Route("/papers", requirements={"id"="\d+"}, options={"expose"=true})
 */
class PaperController extends AbstractController
{
    /**
     * @var AnswerManager
     */
    private $answerManager;

    /**
     * @var QuestionManager
     */
    private $questionManager;

    /**
     * @var PaperManager
     */
    private $paperManager;

    /**
     * PaperController constructor.
     *
     * @DI\InjectParams({
     *     "authorization"   = @DI\Inject("security.authorization_checker"),
     *     "questionManager" = @DI\Inject("ujm.exo.question_manager"),
     *     "paperManager"    = @DI\Inject("ujm.exo.paper_manager")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param QuestionManager               $questionManager
     * @param PaperManager                  $paperManager
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        QuestionManager $questionManager,
        PaperManager    $paperManager)
    {
        $this->authorization = $authorization;
        $this->questionManager = $questionManager;
        $this->paperManager = $paperManager;
    }

    /**
     * Submits answers to an Exercise.
     *
     * @EXT\Route("/{id}/submit", name="exercise_submit_answers")
     * @EXT\Method("POST")
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     *
     * @param User $user
     * @param Paper $paper
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function submitAction(Paper $paper, User $user = null, Request $request)
    {
        $this->assertHasPaperAccess($paper, $user);

        $errors = [];

        $data = $this->decodeRequestData($request);
        if (empty($data)) {

        } else {
            try {
                $this->answerManager->submit();
            } catch (ValidationException $e) {
                $errors = $e->getErrors();
            }
        }

        if (!empty($errors)) {
            return new JsonResponse($errors, 422);
        } else {
            return new JsonResponse(null, 204);
        }
    }

    /**
     * Records an answer for an exercise Step.
     *
     * @EXT\Route("/{paperId}/steps/{stepId}", name="exercise_submit_step")
     * @EXT\Method("PUT")
     *
     * @EXT\ParamConverter("user",  converter="current_user", options={"allowAnonymous"=true})
     * @EXT\ParamConverter("paper", class="UJMExoBundle:Paper", options={"mapping": {"paperId": "id"}})
     * @EXT\ParamConverter("step",  class="UJMExoBundle:Step",  options={"mapping": {"stepId": "id"}})
     *
     * @param Paper   $paper
     * @param Step    $step
     * @param User    $user
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function submitStepAction(Paper $paper, Step $step, User $user = null, Request $request)
    {
        $this->assertHasPaperAccess($paper, $user);

        // Get submitted answers from Request
        $data = $request->request->get('data');

        /** @var StepQuestion $stepQuestion */
        foreach ($step->getStepQuestions() as $stepQuestion) {
            /** @var Question $question */
            $question = $stepQuestion->getQuestion();

            // Get question data from Request
            $questionData = !isset($data[$question->getId()]) ? null : $data[$question->getId()];

            $errors = $this->questionManager->validateAnswerFormat($question, $questionData);
            if (count($errors) !== 0) {
                return new JsonResponse($errors, 422);
            }

            $this->paperManager->recordAnswer($paper, $question, $questionData, $request->getClientIp());
        }

        if (Exercise::TYPE_FORMATIVE === $paper->getExercise()->getType()) {
            // For formative, export solution and score for immediate feedback
            $answers = [];

            /** @var StepQuestion $stepQuestion */
            foreach ($step->getStepQuestions() as $stepQuestion) {
                $answers[] = [
                    'question' => $this->questionManager->exportQuestionAnswers($stepQuestion->getQuestion()),
                    'answer' => $this->paperManager->exportPaperAnswer($stepQuestion->getQuestion(), $paper, true),
                ];
            }

            return new JsonResponse($answers, 200);
        } else {
            return new JsonResponse('', 204);
        }
    }

    /**
     * Marks a paper as finished.
     *
     * @EXT\Route("/{id}/end", name="exercise_finish_paper")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     *
     * @param Paper $paper
     * @param User  $user
     *
     * @return JsonResponse
     */
    public function finishPaperAction(Paper $paper, User $user = null)
    {
        $this->assertHasPaperAccess($paper, $user);

        $this->paperManager->finishPaper($paper);

        return new JsonResponse($this->paperManager->exportPaper($paper), 200);
    }

    /**
     * Returns one paper.
     * Also includes the complete definition and solution of each question
     * associated with the exercise.
     *
     * @EXT\Route("/{id}", name="exercise_export_paper")
     * @EXT\Method("GET")
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     *
     * @param Paper $paper
     * @param User  $user
     *
     * @return JsonResponse
     */
    public function exportPaperAction(Paper $paper, User $user = null)
    {
        // ATTENTION : As is, anonymous have access to all the other anonymous Papers !!!
        if (!$this->isAdmin($paper->getExercise()) && $paper->getUser() !== $user) {
            // Only administrator or the User attached can see a Paper
            throw new AccessDeniedException();
        }

        return new JsonResponse([
            'questions' => $this->paperManager->exportPaperQuestions($paper, $this->isAdmin($paper->getExercise()), true),
            'paper' => $this->paperManager->exportPaper($paper, $this->isAdmin($paper->getExercise())),
        ]);
    }

    /**
     * Saves the score of a question that need manual correction.
     *
     * @EXT\Route("/{id}/questions/{questionId}/score/{score}", name="exercise_save_score")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter("question", class="UJMExoBundle:Question", options={"mapping": {"questionId": "id"}})
     *
     * @param Question $question
     * @param Paper    $paper
     * @param int      $score
     *
     * @return JsonResponse
     */
    public function saveScoreAction(Question $question, Paper $paper, $score)
    {
        $this->assertHasPermission('ADMINISTRATE', $paper->getExercise());

        $this->paperManager->recordScore($question, $paper, $score);

        return new JsonResponse($this->paperManager->exportPaper($paper, $this->isAdmin($paper->getExercise())), 200);
    }

    /**
     * Checks whether a User has access to a Paper
     * ATTENTION : As is, anonymous have access to all the other anonymous Papers !!!
     *
     * @param Paper     $paper
     * @param User|null $user
     */
    private function assertHasPaperAccess(Paper $paper, User $user = null)
    {
        if ($paper->getEnd() || $user !== $paper->getUser()) {
            throw new AccessDeniedException();
        }
    }

    /**
     * Checks whether the current User has the administration rights on the Exercise.
     *
     * @param Exercise $exercise
     *
     * @return bool
     */
    private function isAdmin(Exercise $exercise)
    {
        $collection = new ResourceCollection([$exercise->getResourceNode()]);

        return $this->authorization->isGranted('ADMINISTRATE', $collection);
    }

    private function assertHasPermission($permission, Exercise $exercise)
    {
        $collection = new ResourceCollection([$exercise->getResourceNode()]);

        if (!$this->authorization->isGranted($permission, $collection)) {
            throw new AccessDeniedException($collection->getErrorsForDisplay());
        }
    }
}
