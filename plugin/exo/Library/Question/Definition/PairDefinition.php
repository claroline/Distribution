<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\QuestionType\AbstractQuestion;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Question\Type\PairQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData\PairAnswerValidator;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\PairQuestionValidator;

/**
 * Pair question definition.
 *
 * @DI\Service("ujm_exo.definition.question_pair")
 * @DI\Tag("ujm_exo.definition.question")
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
        return QuestionType::PAIR;
    }

    /**
     * Gets the pair question entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\QuestionType\MatchQuestion';
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

    public function correctAnswer(AbstractQuestion $question, $answer)
    {
        // TODO: Implement correctAnswer() method.
    }

    public function expectAnswer(AbstractQuestion $question)
    {
        // TODO: Implement expectAnswer() method.
    }

    public function getStatistics(AbstractQuestion $pairQuestion, array $answers)
    {
        // TODO: Implement getStatistics() method.

        return [];
    }
}
