<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\QuestionType\AbstractQuestion;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Question\Type\ClozeQuestionSerializer;
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
     * @var ClozeQuestionSerializer
     */
    private $serializer;

    /**
     * ClozeDefinition constructor.
     *
     * @param ClozeQuestionValidator  $validator
     * @param ClozeQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"        = @DI\Inject("ujm_exo.validator.question_cloze"),
     *     "serializer"       = @DI\Inject("ujm_exo.serializer.question_cloze")
     * })
     */
    public function __construct(
        ClozeQuestionValidator $validator,
        ClozeQuestionSerializer $serializer)
    {
        $this->validator = $validator;
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
     * Gets the cloze question serializer.
     *
     * @return ClozeQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    public function correctAnswer(AbstractQuestion $question, $answer)
    {
        // TODO: Implement correctAnswer() method.
    }

    public function expectAnswer(AbstractQuestion $question)
    {
        // TODO: Implement expectAnswer() method.
    }

    public function getStatistics(AbstractQuestion $clozeQuestion, array $answers)
    {
        // Create an array with holeId => holeObject for easy search
        $holesMap = [];
        /** @var Hole $hole */
        foreach ($clozeQuestion->getHoles() as $hole) {
            $holesMap[$hole->getId()] = $hole;
        }

        $holes = [];

        /** @var Answer $answer */
        foreach ($answers as $answer) {
            // Manually decode data to make it easier to process
            $decoded = $this->convertAnswerDetails($answer);

            foreach ($decoded as $holeAnswer) {
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
