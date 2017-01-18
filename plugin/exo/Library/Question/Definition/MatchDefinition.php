<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Misc\Label;
use UJM\ExoBundle\Entity\Misc\Proposal;
use UJM\ExoBundle\Entity\QuestionType\AbstractQuestion;
use UJM\ExoBundle\Library\Attempt\CorrectedAnswer;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Question\Type\MatchQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData\MatchAnswerValidator;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\MatchQuestionValidator;

/**
 * Match question definition.
 *
 * @DI\Service("ujm_exo.definition.question_match")
 * @DI\Tag("ujm_exo.definition.question")
 */
class MatchDefinition extends AbstractDefinition
{
    /**
     * @var MatchQuestionValidator
     */
    private $validator;

    /**
     * @var MatchAnswerValidator
     */
    private $answerValidator;

    /**
     * @var MatchQuestionSerializer
     */
    private $serializer;

    /**
     * MatchDefinition constructor.
     *
     * @param MatchQuestionValidator  $validator
     * @param MatchAnswerValidator    $answerValidator
     * @param MatchQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"       = @DI\Inject("ujm_exo.validator.question_match"),
     *     "answerValidator" = @DI\Inject("ujm_exo.validator.answer_match"),
     *     "serializer"      = @DI\Inject("ujm_exo.serializer.question_match")
     * })
     */
    public function __construct(
        MatchQuestionValidator $validator,
        MatchAnswerValidator $answerValidator,
        MatchQuestionSerializer $serializer)
    {
        $this->validator = $validator;
        $this->answerValidator = $answerValidator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the match question mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return QuestionType::MATCH;
    }

    /**
     * Gets the match question entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\QuestionType\MatchQuestion';
    }

    /**
     * Gets the match question validator.
     *
     * @return MatchQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the match answer validator.
     *
     * @return MatchAnswerValidator
     */
    protected function getAnswerValidator()
    {
        return $this->answerValidator;
    }

    /**
     * Gets the match question serializer.
     *
     * @return MatchQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    /**
     * @param MatchQuestion $question
     * @param $answer
     *
     * @return CorrectedAnswer
     */
    public function correctAnswer(AbstractQuestion $question, $answer)
    {
        $corrected = new CorrectedAnswer();

        foreach ($question->getProposals() as $proposal) {
            if (is_array($answer)) {
                foreach ($answer as $association) {
                    if ($association->firstId === $proposal->getUuid()) {
                        $expectedLabels = $proposal->getExpectedLabels();
                        foreach ($expectedLabels as $label) {
                            if ($association->secondId === $label->getUuid()) {
                                if (0 < $label->getScore()) {
                                    $corrected->addExpected($label);
                                } else {
                                    $corrected->addUnexpected($label);
                                }
                            } elseif (0 < $label->getScore()) {
                                // The choice is not selected but it's part of the correct answer
                                $corrected->addMissing($label);
                            }
                        }
                    }
                }
            }
        }

        return $corrected;
    }

    public function expectAnswer(AbstractQuestion $question)
    {
        $expected = [];

        $expected = array_map(function (Proposal $proposal) {
            $validLabels = array_filter($proposal->getExpectedLabels()->toArray(), function (Label $label) {
                return 0 < $label->getScore();
            });
            foreach ($validLabels as $label) {
                return $label;
            }
        }, $question->getProposals()->toArray());

        return $expected;
    }

    public function getStatistics(AbstractQuestion $matchQuestion, array $answersData)
    {
        // TODO: Implement getStatistics() method.

        return [];
    }
}
