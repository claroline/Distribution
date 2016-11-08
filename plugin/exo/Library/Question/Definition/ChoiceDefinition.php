<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Question\QuestionType;
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

    /**
     * Choice constructor.
     *
     * @param ChoiceQuestionValidator  $validator
     * @param ChoiceQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"  = @DI\Inject("ujm_exo.validator.question_choice"),
     *     "serializer" = @DI\Inject("ujm_exo.serializer.question_choice")
     * })
     */
    public function __construct(
        ChoiceQuestionValidator $validator,
        ChoiceQuestionSerializer $serializer)
    {
        $this->validator = $validator;
        $this->serializer = $serializer;
    }

    /**
     * Get the choice question mime-type.
     * 
     * @return string
     */
    public function getMimeType()
    {
        return QuestionType::CHOICE;
    }

    /**
     * Get the choice question validator.
     *
     * @return ChoiceQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Get the choice question serializer.
     *
     * @return ChoiceQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }
}