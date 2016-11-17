<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Question\Type\OpenQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\OpenQuestionValidator;

/**
 * Open question definition.
 *
 * @DI\Service("ujm_exo.definition.question_open")
 * @DI\Tag("ujm_exo.definition.question")
 */
class OpenDefinition extends AbstractDefinition
{
    /**
     * @var OpenQuestionValidator
     */
    private $validator;

    /**
     * @var OpenQuestionSerializer
     */
    private $serializer;

    /**
     * Open constructor.
     *
     * @param OpenQuestionValidator  $validator
     * @param OpenQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"  = @DI\Inject("ujm_exo.validator.question_open"),
     *     "serializer" = @DI\Inject("ujm_exo.serializer.question_open")
     * })
     */
    public function __construct(
        OpenQuestionValidator $validator,
        OpenQuestionSerializer $serializer)
    {
        $this->validator = $validator;
        $this->serializer = $serializer;
    }

    /**
     * Get the open question mime-type.
     *
     * @return string
     */
    public function getMimeType()
    {
        return QuestionType::OPEN;
    }

    /**
     * Get the open question validator.
     *
     * @return OpenQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Get the open question serializer.
     *
     * @return OpenQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }
}
