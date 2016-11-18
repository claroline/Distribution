<?php

namespace UJM\ExoBundle\Manager;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Step;
use UJM\ExoBundle\Entity\StepQuestion;
use UJM\ExoBundle\Manager\Question\QuestionManager;

/**
 * @DI\Service("ujm.exo.step_manager")
 *
 * @deprecated
 */
class StepManager
{
    /**
     * @var QuestionManager
     *
     * @deprecated it's no longer needed by the class
     */
    private $questionManager;

    /**
     * StepManager constructor.
     *
     * @DI\InjectParams({
     *     "questionManager" = @DI\Inject("ujm.exo.question_manager")
     * })
     *
     * @param QuestionManager $questionManager
     */
    public function __construct(QuestionManager $questionManager)
    {
        $this->questionManager = $questionManager;
    }

    /**
     * Exports a step in a JSON-encodable format.
     *
     * @deprecated use StepManager::export instead
     *
     * @param Step $step
     * @param bool $withSolutions
     *
     * @return array
     */
    public function exportStep(Step $step, $withSolutions = true)
    {
        $stepQuestions = $step->getStepQuestions();

        $items = [];

        /** @var StepQuestion $stepQuestion */
        foreach ($stepQuestions as $stepQuestion) {
            $question = $stepQuestion->getQuestion();
            $items[] = $this->questionManager->exportQuestion($question, $withSolutions);
        }

        return [
            'id' => $step->getId(),
            'meta' => [
                'description' => $step->getText(),
                'maxAttempts' => $step->getMaxAttempts(),
                'title' => $step->getTitle(),
            ],
            'items' => $items,
        ];
    }
}
