<?php

namespace UJM\ExoBundle\Library\Item\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\ItemType\AbstractItem;
use UJM\ExoBundle\Entity\ItemType\PairQuestion;
use UJM\ExoBundle\Entity\Misc\GridItem;
use UJM\ExoBundle\Entity\Misc\GridRow;
use UJM\ExoBundle\Library\Attempt\CorrectedAnswer;
use UJM\ExoBundle\Library\Attempt\GenericPenalty;
use UJM\ExoBundle\Library\Item\ItemType;
use UJM\ExoBundle\Serializer\Item\Type\PairQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData\PairAnswerValidator;
use UJM\ExoBundle\Validator\JsonSchema\Item\Type\PairQuestionValidator;

/**
 * Pair question definition.
 *
 * @DI\Service("ujm_exo.definition.question_pair")
 * @DI\Tag("ujm_exo.definition.item")
 */
class PairDefinition extends AbstractDefinition
{
    /**
     * @var PairQuestionValidator
     */
    private $validator;

    /**
     * @var PairAnswerValidator
     */
    private $answerValidator;

    /**
     * @var PairQuestionSerializer
     */
    private $serializer;

    /**
     * PairDefinition constructor.
     *
     * @param PairQuestionValidator  $validator
     * @param PairAnswerValidator    $answerValidator
     * @param PairQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"       = @DI\Inject("ujm_exo.validator.question_pair"),
     *     "answerValidator" = @DI\Inject("ujm_exo.validator.answer_pair"),
     *     "serializer"      = @DI\Inject("ujm_exo.serializer.question_pair")
     * })
     */
    public function __construct(
        PairQuestionValidator $validator,
        PairAnswerValidator $answerValidator,
        PairQuestionSerializer $serializer)
    {
        $this->validator = $validator;
        $this->answerValidator = $answerValidator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the pair question mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return ItemType::PAIR;
    }

    /**
     * Gets the pair question entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\ItemType\PairQuestion';
    }

    /**
     * Gets the pair question validator.
     *
     * @return PairQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the pair answer validator.
     *
     * @return PairAnswerValidator
     */
    protected function getAnswerValidator()
    {
        return $this->answerValidator;
    }

    /**
     * Gets the pair question serializer.
     *
     * @return PairQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    /**
     * @param PairQuestion $question
     * @param array        $answer
     *
     * @return CorrectedAnswer
     */
    public function correctAnswer(AbstractItem $question, $answer)
    {
        $corrected = new CorrectedAnswer();
        $rows = $question->getRows()->toArray();

        if (!is_null($answer)) {
            foreach ($answer as $answerRow) {
                $hasOdd = false;
                // Search for odd items
                foreach ($answerRow as $answerItem) {
                    $odd = $question->getOddItem($answerItem);
                    if (!empty($odd)) {
                        $corrected->addUnexpected($odd);
                        $hasOdd = true;
                    }
                }

                if (!$hasOdd) {
                    // Search for a defined row for the user answer
                    $row = $this->findRowByAnswer($answerRow, $rows);
                    if (!empty($row)) {
                        // Row found
                        if (0 < $row->getScore()) {
                            $corrected->addExpected($row);
                        } else {
                            $corrected->addUnexpected($row);
                        }
                    } else {
                        // user answer is not a defined one, apply default penalty if exist
                        if ($question->getPenalty()) {
                            $corrected->addPenalty(new GenericPenalty($question->getPenalty()));
                        }
                    }
                }
            }
        }

        if (!empty($rows)) {
            // There are defined rows that have not been found
            foreach ($rows as $row) {
                /** @var GridRow $row */
                if (0 < $row->getScore()) {
                    $corrected->addMissing($row);
                }
            }
        }

        return $corrected;
    }

    /**
     * @param PairQuestion $question
     *
     * @return array
     */
    public function expectAnswer(AbstractItem $question)
    {
        return array_filter($question->getRows()->toArray(), function (GridRow $row) {
            return 0 < $row->getScore();
        });
    }

    public function getStatistics(AbstractItem $pairQuestion, array $answers)
    {
        // TODO: Implement getStatistics() method.

        return [];
    }

    /**
     * Refreshes items UUIDs.
     *
     * @param PairQuestion $item
     */
    public function refreshIdentifiers(AbstractItem $item)
    {
        /** @var GridItem $pairItem */
        foreach ($item->getItems() as $pairItem) {
            $pairItem->refreshUuid();
        }
    }

    private function findRowByAnswer(array $items, array &$rows)
    {
        $found = null;

        /** @var GridRow $row */
        foreach ($rows as $index => $row) {
            if ($row->isOrdered()) {
                // answers must be in the correct order
                if ($row->getItemIds() === $items) {
                    $found = $row;
                    unset($rows[$index]);
                    break;
                }
            } else {
                $match = 0;
                foreach ($items as $item) {
                    if ($row->getItem($item)) {
                        ++$match;
                    }
                }

                if ($match === count($row->getItems())) {
                    // All items of the row must be found
                    $found = $row;
                    unset($rows[$index]);
                    break;
                }
            }
        }

        return $found;
    }
}
