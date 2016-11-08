<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Question\Type\GraphicQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\GraphicQuestionValidator;

/**
 * Graphic question definition.
 *
 * @DI\Service("ujm_exo.definition.question_graphic")
 * @DI\Tag("ujm_exo.definition.question")
 */
class GraphicDefinition extends AbstractDefinition
{
    /**
     * @var GraphicQuestionValidator
     */
    private $validator;

    /**
     * @var GraphicQuestionSerializer
     */
    private $serializer;

    /**
     * Graphic constructor.
     *
     * @param GraphicQuestionValidator  $validator
     * @param GraphicQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"  = @DI\Inject("ujm_exo.validator.question_graphic"),
     *     "serializer" = @DI\Inject("ujm_exo.serializer.question_graphic")
     * })
     */
    public function __construct(
        GraphicQuestionValidator $validator,
        GraphicQuestionSerializer $serializer)
    {
        $this->validator = $validator;
        $this->serializer = $serializer;
    }

    /**
     * Get the graphic question mime-type.
     *
     * @return string
     */
    public function getMimeType()
    {
        return QuestionType::GRAPHIC;
    }

    /**
     * Get the graphic question validator.
     *
     * @return GraphicQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Get the graphic question serializer.
     *
     * @return GraphicQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }
}