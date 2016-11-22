<?php

namespace UJM\ExoBundle\Controller\Api;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Security\Collection\ResourceCollection;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use UJM\ExoBundle\Entity\Attempt\Paper;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Question\Question;
use UJM\ExoBundle\Manager\Attempt\PaperManager;
use UJM\ExoBundle\Repository\PaperRepository;

/**
 * Paper Controller.
 * Manages the submitted papers to an exercise.
 *
 * @EXT\Route("/papers", requirements={"id"="\d+"}, options={"expose"=true})
 */
class PaperController extends AbstractController
{
    /**
     * @var AuthorizationCheckerInterface
     */
    private $authorization;

    /**
     * @var PaperManager
     */
    private $paperManager;

    /**
     * PaperController constructor.
     *
     * @DI\InjectParams({
     *     "authorization"   = @DI\Inject("security.authorization_checker"),
     *     "paperManager"    = @DI\Inject("ujm_exo.manager.paper")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param PaperManager                  $paperManager
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        PaperManager $paperManager)
    {
        $this->authorization = $authorization;
        $this->paperManager = $paperManager;
    }

    /**
     * Returns all the papers associated with an exercise.
     * Administrators get the papers of all users, others get only theirs.
     *
     * @EXT\Route("/{id}/papers", name="exercise_papers", requirements={"id"="\d+"})
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * @param User     $user
     * @param Exercise $exercise
     *
     * @return JsonResponse
     */
    public function listAction(User $user, Exercise $exercise)
    {
        $this->assertHasPermission('OPEN', $exercise);

        if ($this->isAdmin($exercise)) {
            return new JsonResponse($this->paperManager->exportExercisePapers($exercise));
        }

        return new JsonResponse($this->paperManager->exportExercisePapers($exercise, $user));
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
    public function getAction(Paper $paper, User $user = null)
    {
        $this->assertHasPermission('OPEN', $paper->getExercise());

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
     * Deletes all the papers associated with an exercise.
     *
     * @EXT\Route(
     *     "/{id}/papers",
     *     name="ujm_exercise_delete_papers",
     *     options={"expose"=true}
     * )
     * @EXT\Method("DELETE")
     *
     * @param Exercise $exercise
     *
     * @return JsonResponse
     */
    public function deleteAction(Exercise $exercise)
    {
        $this->assertHasPermission('ADMINISTRATE', $exercise);

        $this->paperManager->deletePapers($exercise);

        return new JsonResponse(null, 204);
    }

    /**
     * Exports papers into a CSV file.
     *
     * @EXT\Route("/{id}/papers/export", name="exercise_papers_export", requirements={"id"="\d+"})
     *
     * @param Exercise $exercise
     *
     * @return StreamedResponse
     */
    public function exportCsvAction(Exercise $exercise)
    {
        $this->assertHasPermission('ADMINISTRATE', $exercise);

        /** @var PaperRepository $repo */
        $repo = $this->om->getRepository('UJMExoBundle:Attempt\Paper');

        $papers = $repo->findBy([
            'exercise' => $exercise
        ]);

        return new StreamedResponse(function () use ($papers) {
            $handle = fopen('php://output', 'w+');

            /** @var Paper $paper */
            foreach ($papers as $paper) {
                fputcsv(
                    $handle,
                    [
                        $paper->getUser()->getFirstName().'-'.$paper->getUser()->getLastName(),
                        $paper->getNumber(),
                        $paper->getStart()->format('Y-m-d H:i:s'),
                        $paper->getEnd() ? $paper->getEnd()->format('Y-m-d H:i:s') : '',
                        $paper->isInterrupted(),
                        $this->paperManager->calculateScore($paper, 20),
                    ],
                    ';'
                );
            }

            fclose($handle);
        }, 200, [
            'Content-Type' => 'application/force-download',
            'Content-Disposition' => 'attachment; filename="export.csv"',
        ]);
    }

    /**
     * Saves the score of a question that need manual correction.
     *
     * @EXT\Route("/{id}/questions/{questionId}/score/{score}", name="exercise_save_score")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter("question", class="UJMExoBundle:Question\Question", options={"mapping": {"questionId": "id"}})
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
