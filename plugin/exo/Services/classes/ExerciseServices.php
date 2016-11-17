<?php

namespace UJM\ExoBundle\Services\classes;

use Claroline\CoreBundle\Persistence\ObjectManager;
use Doctrine\Bundle\DoctrineBundle\Registry;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use UJM\ExoBundle\Entity\Question;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Step;
use UJM\ExoBundle\Entity\StepQuestion;

/**
 * @deprecated prefer the use of UJM\ExoBundle\Manager\ExerciseManager to add new methods
 */
class ExerciseServices
{
    protected $om;
    protected $authorizationChecker;
    protected $doctrine;
    protected $container;

    /**
     * Constructor.
     *
     *
     * @param \Claroline\CoreBundle\Persistence\ObjectManager                              $om
     * @param \Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface $authorizationChecker
     * @param \Doctrine\Bundle\DoctrineBundle\Registry                                     $doctrine
     * @param \Symfony\Component\DependencyInjection\Container                             $container
     */
    public function __construct(
        ObjectManager $om,
        AuthorizationCheckerInterface $authorizationChecker,
        Registry $doctrine,
        Container $container
    ) {
        $this->om = $om;
        $this->authorizationChecker = $authorizationChecker;
        $this->doctrine = $doctrine;
        $this->container = $container;
    }

    /**
     * Get max score possible for an exercise.
     *
     *
     * @param Exercise $exercise
     *
     * @return float
     */
    public function getExerciseTotalScore(Exercise $exercise)
    {
        $exoTotalScore = 0;

        $questions = $this->om
                    ->getRepository('UJMExoBundle:Question')
                    ->findByExercise($exercise);

        foreach ($questions as $question) {
            $typeInter = $question->getType();
            $interSer = $this->container->get('ujm.exo_'.$typeInter);
            $interactionX = $interSer->getInteractionX($question->getId());
            $scoreMax = $interSer->maxScore($interactionX);
            $exoTotalScore += $scoreMax;
        }

        return $exoTotalScore;
    }

    /**
     * Add a question in a step.
     *
     *
     * @param Question $question
     * @param Step     $step
     * @param int      $order
     *
     * @deprecated Use StepManager::addQuestion(Step $step, Question $question, $order = -1) instead
     */
    public function addQuestionInStep($question, $step, $order)
    {
        if ($step != null) {
            $sq = new StepQuestion();

            if ($order == -1) {
                $order = $step->getStepQuestions()->count() + 1;
            }

            $sq->setOrdre($order);
            $sq->setStep($step);
            $sq->setQuestion($question);

            $this->om->persist($sq);
            $this->om->flush();
        }
    }

    /**
     * @param Exercise $exercise
     * @param int      $orderStep
     *
     * @return Step
     */
    public function createStep(Exercise $exercise, $orderStep)
    {
        $em = $this->doctrine->getManager();

        //Creating a step by question
        $step = new Step();
        $step->setText(' ');
        $step->setExercise($exercise);
        $step->setNbQuestion(0);
        $step->setDuration(0);
        $step->setMaxAttempts(0);
        $step->setOrder($orderStep);

        $em->persist($step);

        return $step;
    }
}
