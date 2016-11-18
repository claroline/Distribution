<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Answer\Type\MatchAnswerSerializer;
use UJM\ExoBundle\Serializer\Question\Type\MatchQuestionSerializer;
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
     * @var MatchQuestionSerializer
     */
    private $serializer;

    /**
     * @var MatchAnswerSerializer
     */
    private $answerSerializer;

    /**
     * MatchDefinition constructor.
     *
     * @param MatchQuestionValidator  $validator
     * @param MatchQuestionSerializer $serializer
     * @param MatchAnswerSerializer $answerSerializer
     *
     * @DI\InjectParams({
     *     "validator"  = @DI\Inject("ujm_exo.validator.question_match"),
     *     "serializer" = @DI\Inject("ujm_exo.serializer.question_match"),
     *     "answerSerializer" = @DI\Inject("ujm_exo.serializer.answer_match")
     * })
     */
    public function __construct(
        MatchQuestionValidator $validator,
        MatchQuestionSerializer $serializer,
        MatchAnswerSerializer $answerSerializer)
    {
        $this->validator = $validator;
        $this->serializer = $serializer;
        $this->answerSerializer = $answerSerializer;
    }

    /**
     * Gets the match question mime-type.
     *
     * @return string
     */
    public function getMimeType()
    {
        return QuestionType::MATCH;
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
     * Gets the match question serializer.
     *
     * @return MatchQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    /**
     * Gets the match answer serializer.
     *
     * @return MatchAnswerSerializer
     */
    protected function getAnswerSerializer()
    {
        return $this->answerSerializer;
    }
}
