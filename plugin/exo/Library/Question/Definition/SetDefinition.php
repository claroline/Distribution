<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\QuestionType\AbstractQuestion;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Question\Type\SetQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData\SetAnswerValidator;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\SetQuestionValidator;

/**
 * Set question definition.
 *
 * @DI\Service("ujm_exo.definition.question_set")
 * @DI\Tag("ujm_exo.definition.question")
 */
class SetDefinition extends AbstractDefinition
{
    /**
     * @var SetQuestionValidator
     */
    private $validator;

    /**
     * @var SetAnswerValidator
     */
    private $answerValidator;

    /**
     * @var SetQuestionSerializer
     */
    private $serializer;

    /**
     * SetDefinition constructor.
     *
     * @param SetQuestionValidator  $validator
     * @param SetAnswerValidator    $answerValidator
     * @param SetQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"       = @DI\Inject("ujm_exo.validator.question_set"),
     *     "answerValidator" = @DI\Inject("ujm_exo.validator.answer_set"),
     *     "serializer"      = @DI\Inject("ujm_exo.serializer.question_set")
     * })
     */
    public function __construct(
        SetQuestionValidator $validator,
        SetAnswerValidator $answerValidator,
        SetQuestionSerializer $serializer)
    {
        $this->validator = $validator;
        $this->answerValidator = $answerValidator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the set question mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return QuestionType::SET;
    }

    /**
     * Gets the set question entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\QuestionType\MatchQuestion';
    }

    /**
     * Gets the set question validator.
     *
     * @return SetQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the set answer validator.
     *
     * @return SetAnswerValidator
     */
    protected function getAnswerValidator()
    {
        return $this->answerValidator;
    }

    /**
     * Gets the set question serializer.
     *
     * @return SetQuestionSerializer
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

    public function getStatistics(AbstractQuestion $setQuestion, array $answers)
    {
        // TODO: Implement getStatistics() method.

        return [];
    }
}
