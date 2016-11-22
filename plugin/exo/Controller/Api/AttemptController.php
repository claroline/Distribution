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
use UJM\ExoBundle\Entity\Attempt\Paper;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Question\Hint;
use UJM\ExoBundle\Library\Validator\ValidationException;
use UJM\ExoBundle\Manager\AttemptManager;
use UJM\ExoBundle\Manager\HintManager;
use UJM\ExoBundle\Manager\Attempt\PaperManager;

/**
 * Attempt Controller.
 *
 * @EXT\Route("/{exerciseId}/attempts", options={"expose"=true})
 * @EXT\ParamConverter("exercise", class="UJMExoBundle:Exercise", options={"mapping": {"exerciseId": "uuid"}})
 */
class AttemptController extends AbstractController
{
    /**
     * @var AuthorizationCheckerInterface
     */
    private $authorization;

    /**
     * @var AttemptManager
     */
    private $attemptManager;

    /**
     * @var PaperManager
     */
    private $paperManager;

    /**
     * @var HintManager
     */
    private $hintManager;

    /**
     * AttemptController constructor.
     *
     * @DI\InjectParams({
     *     "authorization" = @DI\Inject("security.authorization_checker"),
     *     "attemptManager" = @DI\Inject("ujm_exo.manager.attempt"),
     *     "paperManager" = @DI\Inject("ujm_exo.manager.paper"),
     *     "hintManager" = @DI\Inject("ujm_exo.manager.hint")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param AttemptManager $attemptManager
     * @param PaperManager $paperManager
     * @param HintManager $hintManager
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        AttemptManager $attemptManager,
        PaperManager $paperManager,
        HintManager $hintManager)
    {
        $this->authorization = $authorization;
        $this->paperManager = $paperManager;
        $this->hintManager = $hintManager;
    }

    /**
     * Opens an exercise, creating a new paper or re-using an unfinished one.
     * Also check that max attempts are not reached if needed.
     *
     * @EXT\Route("", name="exercise_attempt_new", requirements={"id"="\d+"})
     * @EXT\Method("GET")
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     *
     * @param Exercise $exercise
     * @param User     $user
     *
     * @return JsonResponse
     */
    public function startAction(Exercise $exercise, User $user = null)
    {
        $this->assertHasPermission('OPEN', $exercise);

        if (!$this->attemptManager->canPass($exercise, $user)) {
            throw new AccessDeniedException('max attempts reached');
        }
        
        $paper = $this->attemptManager->startOrContinue($exercise, $user);

        return new JsonResponse([
            'paper' => $this->paperManager->exportPaper($paper, $this->isAdmin($paper->getExercise())),
            'questions' => $this->paperManager->exportPaperQuestions($paper, $this->isAdmin($paper->getExercise())),
        ]);
    }

    /**
     * Submits answers to an Exercise.
     *
     * @EXT\Route("/{id}", name="exercise_attempt_submit")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter("paper", class="UJMExoBundle:Attempt\Paper", options={"mapping": {"paperId": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     *
     * @param User $user
     * @param Paper $paper
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function submitAnswersAction(Paper $paper, User $user = null, Request $request)
    {
        $this->assertHasPermission('OPEN', $paper->getExercise());
        $this->assertHasPaperAccess($paper, $user);

        $errors = [];

        $data = $this->decodeRequestData($request);
        if (empty($data) || !is_array($data)) {
            $errors[] = [
                'path' => '',
                'message' => 'Invalid JSON data',
            ];
        } else {
            try {
                $this->attemptManager->submit($paper, $data);
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
     * Flags a paper as finished.
     *
     * @EXT\Route("/{id}/end", name="exercise_attempt_finish")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter("paper", class="UJMExoBundle:Attempt\Paper", options={"mapping": {"paperId": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     *
     * @param Paper $paper
     * @param User  $user
     *
     * @return JsonResponse
     */
    public function finishAction(Paper $paper, User $user = null)
    {
        $this->assertHasPermission('OPEN', $paper->getExercise());
        $this->assertHasPaperAccess($paper, $user);

        $this->attemptManager->close($paper, true);

        return new JsonResponse($this->paperManager->exportPaper($paper), 200);
    }

    /**
     * Returns the content of a question hint, and records the fact that it has
     * been consulted within the context of a given paper.
     *
     * @EXT\Route("/{paperId}/hints/{id}", name="exercise_attempt_hint_show")
     * @EXT\Method("GET")
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     * @EXT\ParamConverter("paper", class="UJMExoBundle:Attempt\Paper", options={"mapping": {"paperId": "uuid"}})
     * @EXT\ParamConverter("hint", class="UJMExoBundle:Question\Hint")
     *
     * @param Paper $paper
     * @param Hint  $hint
     * @param User  $user
     *
     * @return JsonResponse
     */
    public function useHintAction(Paper $paper, Hint $hint, User $user = null)
    {
        $this->assertHasPermission('OPEN', $paper->getExercise());
        $this->assertHasPaperAccess($paper, $user);

        $hintContent = null;
        $errors = [];

        try {
            $hintContent = $this->attemptManager->useHint($paper, $hint);
        } catch (\Exception $e) {
            $errors[] = [
                'path' => '',
                'message' => $e->getMessage()
            ];
        }

        if (empty($errors)) {
            return new JsonResponse($hintContent, !empty($hintContent) ? 200 : 204);
        } else {
            return new JsonResponse($errors, 422);
        }
    }

    /**
     * Checks whether a User has access to a Paper
     * ATTENTION : As is, anonymous have access to all the other anonymous Papers !!!
     *
     * @param Paper $paper
     * @param User $user
     *
     * @throws AccessDeniedException
     */
    private function assertHasPaperAccess(Paper $paper, User $user = null)
    {
        if (!$this->attemptManager->canUpdate($paper, $user)) {
            throw new AccessDeniedException();
        }
    }

    private function assertHasPermission($permission, Exercise $exercise)
    {
        $collection = new ResourceCollection([$exercise->getResourceNode()]);

        if (!$this->authorization->isGranted($permission, $collection)) {
            throw new AccessDeniedException($collection->getErrorsForDisplay());
        }
    }
}
