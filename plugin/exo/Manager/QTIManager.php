<?php

namespace UJM\ExoBundle\Manager;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Question\Question;
use UJM\ExoBundle\Manager\Question\QuestionManager;

/**
 * QTIManager.
 *
 * @DI\Service("ujm_exo.manager.qti")
 */
class QTIManager
{
    /**
     * @var QuestionManager
     */
    private $questionManager;

    /**
     * QTIManager constructor.
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
     * Exports an Exercise into an assessment test.
     *
     * @param Exercise $exercise
     *
     * @return \ZipArchive
     */
    public function exportExercise(Exercise $exercise)
    {
        return new \ZipArchive();
    }

    /**
     * Imports an assessment test as a new Exercise.
     */
    public function importTest()
    {

    }

    /**
     * Exports questions into an assessment item.
     *
     * @param Question[] $questions
     *
     * @return \ZipArchive
     */
    public function exportQuestions(array $questions)
    {
        return new \ZipArchive();
    }

    /**
     * Imports an assessment item as a new Question.
     */
    public function importItems()
    {
        return [];
    }
}
