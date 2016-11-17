<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
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
     * Cloze constructor.
     *
     * @param ClozeQuestionValidator  $validator
     * @param ClozeQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"  = @DI\Inject("ujm_exo.validator.question_cloze"),
     *     "serializer" = @DI\Inject("ujm_exo.serializer.question_cloze")
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
     * Get the cloze question mime-type.
     *
     * @return string
     */
    public function getMimeType()
    {
        return QuestionType::CLOZE;
    }

    /**
     * Get the cloze question validator.
     *
     * @return ClozeQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Get the cloze question serializer.
     *
     * @return ClozeQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }
}
