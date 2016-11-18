<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Answer\Type\ClozeAnswerSerializer;
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
     * @var ClozeAnswerSerializer
     */
    private $answerSerializer;

    /**
     * ClozeDefinition constructor.
     *
     * @param ClozeQuestionValidator  $validator
     * @param ClozeQuestionSerializer $serializer
     * @param ClozeAnswerSerializer   $answerSerializer
     *
     * @DI\InjectParams({
     *     "validator"  = @DI\Inject("ujm_exo.validator.question_cloze"),
     *     "serializer" = @DI\Inject("ujm_exo.serializer.question_cloze"),
     *     "answerSerializer" = @DI\Inject("ujm_exo.serializer.answer_cloze")
     * })
     */
    public function __construct(
        ClozeQuestionValidator $validator,
        ClozeQuestionSerializer $serializer,
        ClozeAnswerSerializer $answerSerializer)
    {
        $this->validator = $validator;
        $this->serializer = $serializer;
        $this->answerSerializer = $answerSerializer;
    }

    /**
     * Gets the cloze question mime-type.
     *
     * @return string
     */
    public function getMimeType()
    {
        return QuestionType::CLOZE;
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

    /**
     * Gets the cloze answer serializer.
     *
     * @return ClozeAnswerSerializer
     */
    protected function getAnswerSerializer()
    {
        return $this->answerSerializer;
    }
}
