<?php

namespace UJM\ExoBundle\Library\Item\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\ItemType\AbstractItem;
use UJM\ExoBundle\Library\Attempt\CorrectedAnswer;
use UJM\ExoBundle\Library\Item\ItemType;
use UJM\ExoBundle\Serializer\Item\Type\TextContentItemSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData\TextContentAnswerValidator;
use UJM\ExoBundle\Validator\JsonSchema\Item\Type\TextContentItemValidator;

/**
 * Text content item definition.
 *
 * @DI\Service("ujm_exo.definition.item_text_content")
 * @DI\Tag("ujm_exo.definition.item")
 */
class TextContentItemDefinition extends AbstractDefinition
{
    /**
     * @var TextContentItemValidator
     */
    private $validator;

    /**
     * @var WordsAnswerValidator
     */
    private $answerValidator;

    /**
     * @var TextContentItemSerializer
     */
    private $serializer;

    /**
     * TextContentItemDefinition constructor.
     *
     * @param TextContentItemValidator   $validator
     * @param TextContentAnswerValidator $answerValidator
     * @param TextContentItemSerializer  $serializer
     *
     * @DI\InjectParams({
     *     "validator"       = @DI\Inject("ujm_exo.validator.item_text_content"),
     *     "answerValidator" = @DI\Inject("ujm_exo.validator.answer_text_content"),
     *     "serializer"      = @DI\Inject("ujm_exo.serializer.item_text_content")
     * })
     */
    public function __construct(
        TextContentItemValidator $validator,
        TextContentAnswerValidator $answerValidator,
        TextContentItemSerializer $serializer)
    {
        $this->validator = $validator;
        $this->answerValidator = $answerValidator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the text content item mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return ItemType::TEXT_CONTENT;
    }

    /**
     * Gets the text content item entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\ItemType\TextContentItem';
    }

    /**
     * Gets the text content item validator.
     *
     * @return TextContentItemValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the text content answer validator.
     *
     * @return TextContentAnswerValidator
     */
    protected function getAnswerValidator()
    {
        return $this->answerValidator;
    }

    /**
     * Gets the text content item serializer.
     *
     * @return TextContentItemSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    public function correctAnswer(AbstractItem $item, $answer)
    {
        return new CorrectedAnswer();
    }

    public function expectAnswer(AbstractItem $item)
    {
        return [];
    }

    public function getStatistics(AbstractItem $item, array $answersData)
    {
        return [];
    }
}
