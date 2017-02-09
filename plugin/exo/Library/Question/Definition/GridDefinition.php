<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Misc\Cell;
use UJM\ExoBundle\Entity\Misc\CellChoice;
use UJM\ExoBundle\Entity\QuestionType\AbstractQuestion;
use UJM\ExoBundle\Entity\QuestionType\GridQuestion;
use UJM\ExoBundle\Library\Attempt\CorrectedAnswer;
use UJM\ExoBundle\Library\Attempt\GenericPenalty;
use UJM\ExoBundle\Library\Attempt\GenericScore;
use UJM\ExoBundle\Library\Options\GridSumMode;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Question\Type\GridQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData\GridAnswerValidator;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\GridQuestionValidator;

/**
 * Grid question definition.
 *
 * @DI\Service("ujm_exo.definition.question_grid")
 * @DI\Tag("ujm_exo.definition.question")
 */
class GridDefinition extends AbstractDefinition
{
    /**
     * @var GridQuestionValidator
     */
    private $validator;

    /**
     * @var GridAnswerValidator
     */
    private $answerValidator;

    /**
     * @var GridQuestionSerializer
     */
    private $serializer;

    /**
     * PairDefinition constructor.
     *
     * @param GridQuestionValidator  $validator
     * @param GridAnswerValidator    $answerValidator
     * @param GridQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"       = @DI\Inject("ujm_exo.validator.question_grid"),
     *     "answerValidator" = @DI\Inject("ujm_exo.validator.answer_grid"),
     *     "serializer"      = @DI\Inject("ujm_exo.serializer.question_grid")
     * })
     */
    public function __construct(
        GridQuestionValidator $validator,
        GridAnswerValidator $answerValidator,
        GridQuestionSerializer $serializer)
    {
        $this->validator = $validator;
        $this->answerValidator = $answerValidator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the grid question mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return QuestionType::GRID;
    }

    /**
     * Gets the grid question entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\QuestionType\GridQuestion';
    }

    /**
     * Gets the grid question validator.
     *
     * @return PairQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the grid answer validator.
     *
     * @return PairAnswerValidator
     */
    protected function getAnswerValidator()
    {
        return $this->answerValidator;
    }

    /**
     * Gets the grid question serializer.
     *
     * @return PairQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    /**
     * @param GridQuestion $question
     * @param array        $answer
     *
     * @return CorrectedAnswer
     */
    public function correctAnswer(AbstractQuestion $question, $answer)
    {
        $scoreRule = json_decode($question->getScoreRule());
        if ($scoreRule['type'] === 'fixed') {
            return $this->getCorrectAnswerForFixOrSumCellsMode($question, $answer);
        } else {
            // 3 sum submode
            switch ($question->getSumMode()) {
              case GridSumMode::SUM_CELL:
                return $this->getCorrectAnswerForFixOrSumCellsMode($question, $answer);
              break;
              case GridSumMode::SUM_COLUMN:
                return $this->getCorrectAnswerForColSumMode($question, $answer);
              break;
              case GridSumMode::SUM_ROWS:
                return $this->getCorrectAnswerForRowSumMode($question, $answer);
              break;
            }
        }
    }

    /**
     * @param GridQuestion $question
     * @param array        $answer
     *
     * @return CorrectedAnswer
     */
    private function getCorrectAnswerForFixOrSumCellsMode(AbstractQuestion $question, $answer)
    {
        $corrected = new CorrectedAnswer();
        if (!is_null($answer)) {
            foreach ($answer as $gridAnswer) {
                $cell = $question->getCell($gridAnswer->cellId);
                $choice = $cell->getChoice($gridAnswer->text);
                if (!empty($choice)) {
                    if (0 < $choice->getScore()) {
                        $corrected->addExpected($choice);
                    } else {
                        $corrected->addUnexpected($choice);
                    }
                } else {
                    // Retrieve the best answer for the cell
                  $corrected->addMissing($this->findCellExpectedAnswer($cell));
                }
            }
        } else {
            $cells = $question->getCells();
            foreach ($cells as $cell) {
                if (0 < count($cell->getChoices())) {
                    $corrected->addMissing($this->findCellExpectedAnswer($cell));
                }
            }
        }

        return $corrected;
    }

    /**
     * Score compution is the only purpose of those methods
     * @param GridQuestion $question
     * @param array        $answer
     *
     * @return CorrectedAnswer
     */
    private function getCorrectAnswerForRowSumMode(AbstractQuestion $question, $answer)
    {
        $corrected = new CorrectedAnswer();
        if (!is_null($answer)) {
            // correct answers per row
            for ($i = 0 ; $i < $question->getRows(); $i++) {

                // get cells where there is at least 1 awaited answers for the current row (none possible)
                $rowCellsUuids = array_map(function (Cell $cell) {
                    // only fill array with awaited answer cells uuid
                    if ($cell->getCoordsY === $i && 0 < $cell->getChoices()) {
                        return $cell->getUuid();
                    }
                }, $question->getCells());

                // if any answer are needed in this row
                if (!empty($rowCellsUuids)) {
                    // score will be applied only if all awaited answers are valid
                    $all = true;
                    foreach ($answer as $cellAnswer) {
                        if (in_array($cellAnswer->cellId, $rowCellsUuids)) {
                            $cell = $question->getCell($cellAnswer->cellId);
                            $choice = $cell->getChoice($cellAnswer->text);
                            // wrong or empty anwser -> score will not be applied
                            if (empty($choice)) {
                                $all = false;
                                break;
                            }
                        }
                    }

                    if ($all) {
                        $scoreToApply = $rowCells[0]->getChoices()[0]->getScore();
                        $corrected->addExpected(new GenericScore($scoreToApply));
                    } else {
                        $corrected->addUnexpected(new GenericPenalty($question->getPenalty()));
                    }
                }
            }
        }

        return $corrected;
    }


    /**
     * Score compution is the only purpose of those methods
     * @param GridQuestion $question
     * @param array        $answer
     *
     * @return CorrectedAnswer
     */
    private function getCorrectAnswerForColumnSumMode(AbstractQuestion $question, $answer)
    {
        $corrected = new CorrectedAnswer();
        if (!is_null($answer)) {
            // correct answers per row
            for ($i = 0 ; $i < $question->getColumns(); $i++) {

                // get cells where there is at least 1 awaited answers for the current column (none possible)
                $colCellsUuids = array_map(function (Cell $cell) {
                    // only fill array with awaited answer cells uuid
                    if ($cell->getCoordsX === $i && 0 < $cell->getChoices()) {
                        return $cell->getUuid();
                    }
                }, $question->getCells());

                // if any answer are needed in this row
                if (!empty($colCellsUuids)) {
                    // score will be applied only if all awaited answers are valid
                    $all = true;
                    foreach ($answer as $cellAnswer) {
                        if (in_array($cellAnswer->cellId, $colCellsUuids)) {
                            $cell = $question->getCell($cellAnswer->cellId);
                            $choice = $cell->getChoice($cellAnswer->text);
                            // wrong or empty anwser -> score will not be applied
                            if (empty($choice)) {
                                $all = false;
                                break;
                            }
                        }
                    }

                    if ($all) {
                        $scoreToApply = $rowCells[0]->getChoices()[0]->getScore();
                        $corrected->addExpected(new GenericScore($scoreToApply));
                    } else {
                        $corrected->addUnexpected(new GenericPenalty($question->getPenalty()));
                    }
                }
            }
        }

        return $corrected;
    }

    /**
     * @param GridQuestion $question
     *
     * @return array
     */
    public function expectAnswer(AbstractQuestion $question)
    {
        return array_map(function (Cell $cell) {
            // expected answer if there is at least one choice in the cell
            if (0 < count($cell->getChoices)) {
                return $this->findCellExpectedAnswer($cell);
            }
        }, $question->getCells()->toArray());

        return [];
    }

    public function getStatistics(AbstractQuestion $pairQuestion, array $answers)
    {
        // TODO: Implement getStatistics() method.

        return [];
    }

    /**
     * @param Cell $cell
     *
     * @return CellChoice|null
     */
    private function findCellExpectedAnswer(Cell $cell)
    {
        $best = null;
        foreach ($cell->getChoices() as $choice) {
            /** @var CellChoice $choice */
            if (empty($best) || $best->getScore() < $choice->getScore()) {
                $best = $choice;
            }
        }

        return $best;
    }
}
