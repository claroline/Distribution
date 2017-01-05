<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Misc\Hole;
use UJM\ExoBundle\Entity\Misc\Keyword;
use UJM\ExoBundle\Entity\QuestionType\AbstractQuestion;
use UJM\ExoBundle\Entity\QuestionType\ClozeQuestion;
use UJM\ExoBundle\Library\Attempt\CorrectedAnswer;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Question\Type\ClozeQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData\ClozeAnswerValidator;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\ClozeQuestionValidator;

/**
 * Cloze question definition.
 *
 * @DI\Service("ujm_exo.definition.question_cloze")
 * @DI\Tag("ujm_exo.definition.question")
 */
class ClozeDefinition extends AbstractDefinition
{
    /**
     * @var ClozeQuestionValidator
     */
    private $validator;

    /**
     * @var ClozeAnswerValidator
     */
    private $answerValidator;

    /**
     * @var ClozeQuestionSerializer
     */
    private $serializer;

    /**
     * ClozeDefinition constructor.
     *
     * @param ClozeQuestionValidator  $validator
     * @param ClozeAnswerValidator    $answerValidator
     * @param ClozeQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"       = @DI\Inject("ujm_exo.validator.question_cloze"),
     *     "answerValidator" = @DI\Inject("ujm_exo.validator.answer_cloze"),
     *     "serializer"      = @DI\Inject("ujm_exo.serializer.question_cloze")
     * })
     */
    public function __construct(
        ClozeQuestionValidator $validator,
        ClozeAnswerValidator $answerValidator,
        ClozeQuestionSerializer $serializer)
    {
        $this->validator = $validator;
        $this->answerValidator = $answerValidator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the cloze question mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return QuestionType::CLOZE;
    }

    /**
     * Gets the cloze question entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\QuestionType\ClozeQuestion';
    }

    /**
     * Gets the cloze question validator.
     *
     * @return ClozeQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the cloze answer validator.
     *
     * @return ClozeAnswerValidator
     */
    protected function getAnswerValidator()
    {
        return $this->answerValidator;
    }

    /**
     * Gets the cloze question serializer.
     *
     * @return ClozeQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    /**
     * @param ClozeQuestion $question
     * @param $answer
     *
     * @return CorrectedAnswer
     */
    public function correctAnswer(AbstractQuestion $question, $answer)
    {
        $corrected = new CorrectedAnswer();

        // TODO : implement

        return $corrected;
    }

    /**
     * @param ClozeQuestion $question
     *
     * @return array
     */
    public function expectAnswer(AbstractQuestion $question)
    {
        $expected = [];
        foreach ($question->getHoles() as $hole) {
            $best = null;
            foreach ($hole->getKeywords() as $keyword) {
                if (empty($best) || $best->getScore() < $keyword->getScore()) {
                    $best = $keyword;
                }
            }

            $expected[] = $best;
        }

        return $expected;
    }

    /**
     * @param ClozeQuestion $clozeQuestion
     * @param array         $answersData
     *
     * @return array
     */
    public function getStatistics(AbstractQuestion $clozeQuestion, array $answersData)
    {
        // Create an array with holeId => holeObject for easy search
        $holesMap = [];
        /** @var Hole $hole */
        foreach ($clozeQuestion->getHoles() as $hole) {
            $holesMap[$hole->getId()] = $hole;
        }

        $holes = [];

        foreach ($answersData as $answerData) {
            foreach ($answerData as $holeAnswer) {
                if (!empty($holeAnswer->answerText)) {
                    if (!isset($holes[$holeAnswer->holeId])) {
                        $holes[$holeAnswer->holeId] = new \stdClass();
                        $holes[$holeAnswer->holeId]->id = $holeAnswer->holeId;
                        $holes[$holeAnswer->holeId]->answered = 0;

                        // Answers counters for each keyword of the hole
                        $holes[$holeAnswer->holeId]->keywords = [];
                    }

                    // Increment the hole answers count
                    ++$holes[$holeAnswer->holeId]->answered;

                    /** @var Keyword $keyword */
                    foreach ($holesMap[$holeAnswer->holeId]->getKeywords() as $keyword) {
                        // Check if the response match the current keyword
                        if ($holesMap[$holeAnswer->holeId]->getSelector()) {
                            // It's the ID of the keyword which is stored
                            $found = $keyword->getId() === (int) $holeAnswer->answerText;
                        } else {
                            if ($keyword->isCaseSensitive()) {
                                $found = strtolower($keyword->getText()) === strtolower($holeAnswer->answerText);
                            } else {
                                $found = $keyword->getText() === $holeAnswer->answerText;
                            }
                        }

                        if ($found) {
                            if (!isset($holes[$holeAnswer->holeId]->keywords[$keyword->getId()])) {
                                // Initialize the Hole keyword counter if it's the first time we find it
                                $holes[$holeAnswer->holeId]->keywords[$keyword->getId()] = new \stdClass();
                                $holes[$holeAnswer->holeId]->keywords[$keyword->getId()]->id = $keyword->getId();
                                $holes[$holeAnswer->holeId]->keywords[$keyword->getId()]->count = 0;
                            }

                            ++$holes[$holeAnswer->holeId]->keywords[$keyword->getId()]->count;

                            break;
                        }
                    }
                }
            }
        }

        return $holes;
    }
}
