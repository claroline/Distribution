<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Question\Type\SetQuestionSerializer;
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
     * @var SetQuestionSerializer
     */
    private $serializer;

    /**
     * Set constructor.
     *
     * @param SetQuestionValidator  $validator
     * @param SetQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"  = @DI\Inject("ujm_exo.validator.question_set"),
     *     "serializer" = @DI\Inject("ujm_exo.serializer.question_set")
     * })
     */
    public function __construct(
        SetQuestionValidator $validator,
        SetQuestionSerializer $serializer)
    {
        $this->validator = $validator;
        $this->serializer = $serializer;
    }

    /**
     * Get the set question mime-type.
     *
     * @return string
     */
    public function getMimeType()
    {
        return QuestionType::SET;
    }

    /**
     * Get the set question validator.
     *
     * @return SetQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Get the set question serializer.
     *
     * @return SetQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }
}