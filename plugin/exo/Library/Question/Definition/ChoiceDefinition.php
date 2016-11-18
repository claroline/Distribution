<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Answer\Type\ChoiceAnswerSerializer;
use UJM\ExoBundle\Serializer\Question\Type\ChoiceQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\ChoiceQuestionValidator;

/**
 * Choice question definition.
 *
 * @DI\Service("ujm_exo.definition.question_choice")
 * @DI\Tag("ujm_exo.definition.question")
 */
class ChoiceDefinition extends AbstractDefinition
{
    /**
     * @var ChoiceQuestionValidator
     */
    private $validator;

    /**
     * @var ChoiceQuestionSerializer
     */
    private $serializer;

    private $answerSerializer;

    /**
     * ChoiceDefinition constructor.
     *
     * @param ChoiceQuestionValidator  $validator
     * @param ChoiceQuestionSerializer $serializer
     * @param ChoiceAnswerSerializer   $answerSerializer
     *
     * @DI\InjectParams({
     *     "validator"        = @DI\Inject("ujm_exo.validator.question_choice"),
     *     "serializer"       = @DI\Inject("ujm_exo.serializer.question_choice"),
     *     "answerSerializer" = @DI\Inject("ujm_exo.serializer.answer_choice")
     * })
     */
    public function __construct(
        ChoiceQuestionValidator $validator,
        ChoiceQuestionSerializer $serializer,
        ChoiceAnswerSerializer $answerSerializer)
    {
        $this->validator = $validator;
        $this->serializer = $serializer;
        $this->answerSerializer = $answerSerializer;
    }

    /**
     * Gets the choice question mime-type.
     * 
     * @return string
     */
    public function getMimeType()
    {
        return QuestionType::CHOICE;
    }

    /**
     * Gets the choice question validator.
     *
     * @return ChoiceQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the choice question serializer.
     *
     * @return ChoiceQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    /**
     * Gets the choice answer serializer.
     *
     * @return ChoiceAnswerSerializer
     */
    protected function getAnswerSerializer()
    {
        return $this->answerSerializer;
    }
}
