<?php

namespace UJM\ExoBundle\Library\Item\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\ItemType\AbstractItem;
use UJM\ExoBundle\Library\Attempt\CorrectedAnswer;
use UJM\ExoBundle\Library\Item\ItemType;
use UJM\ExoBundle\Serializer\Item\Type\ImageContentItemSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData\ImageContentAnswerValidator;
use UJM\ExoBundle\Validator\JsonSchema\Item\Type\ImageContentItemValidator;

/**
 * Image content item definition.
 *
 * @DI\Service("ujm_exo.definition.item_image_content")
 * @DI\Tag("ujm_exo.definition.item")
 */
class ImageContentItemDefinition extends AbstractDefinition
{
    /**
     * @var ImageContentItemValidator
     */
    private $validator;

    /**
     * @var ImageContentAnswerValidator
     */
    private $answerValidator;

    /**
     * @var ImageContentItemSerializer
     */
    private $serializer;

    /**
     * ImageContentItemDefinition constructor.
     *
     * @param ImageContentItemValidator   $validator
     * @param ImageContentAnswerValidator $answerValidator
     * @param ImageContentItemSerializer  $serializer
     *
     * @DI\InjectParams({
     *     "validator"       = @DI\Inject("ujm_exo.validator.item_image_content"),
     *     "answerValidator" = @DI\Inject("ujm_exo.validator.answer_image_content"),
     *     "serializer"      = @DI\Inject("ujm_exo.serializer.item_image_content")
     * })
     */
    public function __construct(
        ImageContentItemValidator $validator,
        ImageContentAnswerValidator $answerValidator,
        ImageContentItemSerializer $serializer)
    {
        $this->validator = $validator;
        $this->answerValidator = $answerValidator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the image content item mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return ItemType::IMAGE_CONTENT;
    }

    /**
     * Gets the image content item entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\ItemType\ImageContentItem';
    }

    /**
     * Gets the image content item validator.
     *
     * @return ImageContentItemValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the image content answer validator.
     *
     * @return ImageContentAnswerValidator
     */
    protected function getAnswerValidator()
    {
        return $this->answerValidator;
    }

    /**
     * Gets the image content item serializer.
     *
     * @return ImageContentItemSerializer
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
